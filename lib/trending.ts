// Trending Themes System - Detects themes gaining popularity

import { supabase } from './supabase';
import type { Theme } from '@/schema';
import { logger } from './logger';

export interface TrendingTheme {
  theme: Theme;
  currentRank: number;
  previousRank: number;
  rankChange: number;
  isTrending: boolean;
}

// In-memory cache for trending themes (refreshes every 30 minutes)
let cachedTrendingThemes: Set<Theme> = new Set();
let trendingCacheTimestamp: number = 0;
const TRENDING_CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

/**
 * Snapshot current theme rankings
 * Should be called hourly via cron job or API endpoint
 */
export async function snapshotRankings(): Promise<void> {
  try {
    const { error } = await supabase.rpc('snapshot_theme_rankings');

    if (error) {
      logger.error('[snapshotRankings] Failed to snapshot:', error);
    } else {
      logger.log('[snapshotRankings] Rankings snapshot created');
    }
  } catch (err) {
    logger.error('[snapshotRankings] Exception:', err);
  }
}

/**
 * Get themes that are currently trending
 * A theme is trending if it improved rank by 3+ positions in the last 6 hours
 */
export async function getTrendingThemes(minRankImprovement: number = 3): Promise<TrendingTheme[]> {
  try {
    const { data, error } = await supabase.rpc('get_trending_themes', {
      p_min_rank_improvement: minRankImprovement,
    });

    if (error) {
      logger.error('[getTrendingThemes] Database error:', error);
      return [];
    }

    if (!data || data.length === 0) {
      logger.log('[getTrendingThemes] No trending themes found');
      return [];
    }

    logger.log(`[getTrendingThemes] Found ${data.length} trending themes`);
    return data as TrendingTheme[];
  } catch (err) {
    logger.error('[getTrendingThemes] Exception:', err);
    return [];
  }
}

/**
 * Check if a specific theme is trending
 * Uses in-memory cache to reduce database queries
 */
export async function isThemeTrending(theme: Theme): Promise<boolean> {
  const now = Date.now();

  // Return cached result if still fresh
  if (now - trendingCacheTimestamp < TRENDING_CACHE_DURATION) {
    return cachedTrendingThemes.has(theme);
  }

  try {
    // Refresh cache
    const trending = await getTrendingThemes();
    cachedTrendingThemes = new Set(trending.map(t => t.theme as Theme));
    trendingCacheTimestamp = now;

    return cachedTrendingThemes.has(theme);
  } catch (err) {
    logger.error('[isThemeTrending] Exception:', err);
    return false;
  }
}

/**
 * Manually invalidate the trending cache
 */
export function invalidateTrendingCache(): void {
  cachedTrendingThemes = new Set();
  trendingCacheTimestamp = 0;
  logger.log('[invalidateTrendingCache] Cache cleared');
}
