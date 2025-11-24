// Popular Themes Today - Supabase integration and caching

import { supabase } from './supabase';
import type { Theme } from '@/schema';
import { logger } from './logger';

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
