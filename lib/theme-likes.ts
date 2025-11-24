// Most Loved Themes - Like tracking system

import { supabase } from './supabase';
import type { Theme } from '@/schema';
import { logger } from './logger';

// Session storage to prevent spam (limit 1 like per theme per session)
const SESSION_STORAGE_KEY = 'theme_likes';

/**
 * Get session ID for like tracking
 * Creates one if it doesn't exist
 */
function getSessionId(): string {
  if (typeof window === 'undefined') return '';

  let sessionId = sessionStorage.getItem('session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    sessionStorage.setItem('session_id', sessionId);
  }
  return sessionId;
}

/**
 * Check if user has already liked a theme in this session
 */
function hasLikedTheme(theme: Theme): boolean {
  if (typeof window === 'undefined') return false;

  const liked = sessionStorage.getItem(SESSION_STORAGE_KEY);
  if (!liked) return false;

  const likedThemes: Theme[] = JSON.parse(liked);
  return likedThemes.includes(theme);
}

/**
 * Mark theme as liked in session
 */
function markThemeAsLiked(theme: Theme): void {
  if (typeof window === 'undefined') return;

  const liked = sessionStorage.getItem(SESSION_STORAGE_KEY);
  const likedThemes: Theme[] = liked ? JSON.parse(liked) : [];

  if (!likedThemes.includes(theme)) {
    likedThemes.push(theme);
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(likedThemes));
  }
}

/**
 * Like a theme
 * Rate limited to 1 like per theme per session
 */
export async function likeTheme(theme: Theme): Promise<{ success: boolean; alreadyLiked: boolean }> {
  // Check if already liked in this session
  if (hasLikedTheme(theme)) {
    logger.log(`[likeTheme] Already liked: ${theme}`);
    return { success: false, alreadyLiked: true };
  }

  try {
    const sessionId = getSessionId();

    const { error } = await supabase
      .from('theme_likes')
      .insert({
        theme,
        session_id: sessionId,
      });

    if (error) {
      logger.error('[likeTheme] Failed to like theme:', error);
      return { success: false, alreadyLiked: false };
    }

    // Mark as liked in session
    markThemeAsLiked(theme);

    logger.log(`[likeTheme] Liked: ${theme}`);
    return { success: true, alreadyLiked: false };
  } catch (err) {
    logger.error('[likeTheme] Exception:', err);
    return { success: false, alreadyLiked: false };
  }
}

/**
 * Get like count for a specific theme
 */
export async function getThemeLikeCount(theme: Theme): Promise<number> {
  try {
    const { data, error } = await supabase.rpc('get_theme_like_count', {
      p_theme: theme,
    });

    if (error) {
      logger.error('[getThemeLikeCount] Database error:', error);
      return 0;
    }

    return data || 0;
  } catch (err) {
    logger.error('[getThemeLikeCount] Exception:', err);
    return 0;
  }
}

/**
 * Check if user has liked a theme (exported for UI)
 */
export function hasUserLikedTheme(theme: Theme): boolean {
  return hasLikedTheme(theme);
}
