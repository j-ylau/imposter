// Popular Themes Today - Supabase integration and caching

import { supabase } from './supabase';
import type { Theme } from '@/schema';
import { logger } from './logger';
import { THEME_LABELS } from '@/data/themes';
import { getThemeLikeCount } from './theme-likes';

export interface PopularTheme {
  theme: Theme;
  count: number;
}

// In-memory cache for popular themes (refreshes every 5 minutes)
let cachedPopularThemes: PopularTheme[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Increment theme usage count for today
 * Called when a room is created
 */
export async function trackThemeUsage(theme: Theme): Promise<void> {
  try {
    // Call the Supabase function to increment count
    const { error } = await supabase.rpc('increment_theme_count', {
      p_theme: theme,
    });

    if (error) {
      logger.error('[trackThemeUsage] Failed to track theme:', error);
    } else {
      logger.log(`[trackThemeUsage] Tracked: ${theme}`);
      // Invalidate cache when new data is added
      invalidateCache();
    }
  } catch (err) {
    // Don't let tracking errors break room creation
    logger.error('[trackThemeUsage] Exception:', err);
  }
}

/**
 * Get popular themes for today
 * Uses in-memory cache to reduce database queries
 */
export async function getPopularThemes(limit: number = 10): Promise<PopularTheme[]> {
  const now = Date.now();

  // Return cached data if still fresh
  if (cachedPopularThemes && now - cacheTimestamp < CACHE_DURATION) {
    logger.log('[getPopularThemes] Returning cached data');
    return cachedPopularThemes.slice(0, limit);
  }

  try {
    // Fetch from database
    const { data, error } = await supabase.rpc('get_popular_themes', {
      p_date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
      p_limit: limit,
    });

    if (error) {
      logger.error('[getPopularThemes] Database error:', error);
      return [];
    }

    if (!data || data.length === 0) {
      logger.log('[getPopularThemes] No data yet for today');
      return [];
    }

    // Update cache
    cachedPopularThemes = data as PopularTheme[];
    cacheTimestamp = now;

    logger.log(`[getPopularThemes] Fetched ${data.length} popular themes`);
    return cachedPopularThemes;
  } catch (err) {
    logger.error('[getPopularThemes] Exception:', err);
    return [];
  }
}

/**
 * Manually invalidate the cache
 * Useful after tracking new theme usage
 */
export function invalidateCache(): void {
  cachedPopularThemes = null;
  cacheTimestamp = 0;
  logger.log('[invalidateCache] Cache cleared');
}

/**
 * Get theme stats for a specific date (for analytics)
 */
export async function getThemeStatsForDate(date: string): Promise<PopularTheme[]> {
  try {
    const { data, error } = await supabase.rpc('get_popular_themes', {
      p_date: date,
      p_limit: 50, // Get all themes
    });

    if (error) {
      logger.error('[getThemeStatsForDate] Database error:', error);
      return [];
    }

    return (data as PopularTheme[]) || [];
  } catch (err) {
    logger.error('[getThemeStatsForDate] Exception:', err);
    return [];
  }
}

/**
 * Get most popular themes by combining play count and like count
 * Uses a weighted score: (playCount * 2) + likeCount
 * This ensures themes with actual plays are prioritized over just likes
 */
export async function getMostPopularThemes(limit: number = 6): Promise<PopularTheme[]> {
  try {
    const allThemes = Object.keys(THEME_LABELS) as Theme[];

    // Get play counts for today
    const playCountsData = await getPopularThemes(50); // Get all themes with play data
    const playCountsMap = new Map(playCountsData.map(t => [t.theme, t.count]));

    // Get like counts and calculate combined popularity score
    const themesWithScores = await Promise.all(
      allThemes.map(async (theme) => {
        const playCount = playCountsMap.get(theme) || 0;
        const likeCount = await getThemeLikeCount(theme);

        // Weighted score: plays are worth 2x likes
        // This prioritizes themes people actually play vs just like
        const score = (playCount * 2) + likeCount;

        return {
          theme,
          count: playCount,
          score,
        };
      })
    );

    // Sort by score (descending) and return top N
    const sorted = themesWithScores
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(({ theme, count }) => ({ theme, count }));

    logger.log(`[getMostPopularThemes] Calculated ${sorted.length} popular themes by combined score`);
    return sorted;
  } catch (err) {
    logger.error('[getMostPopularThemes] Exception:', err);
    return [];
  }
}
