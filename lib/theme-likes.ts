// Theme likes — Supabase-backed social proof
// Reads/writes like counts. Rate-limited to 1 like per theme per session via sessionStorage.

import { supabase } from './supabase';
import type { Theme } from '@/schema';
import { logger } from './logger';

const SESSION_KEY = 'imposter_liked_themes';

// ── Session-based spam prevention ──────────────────────────────

function getLikedThemes(): Theme[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function markAsLiked(theme: Theme): void {
  if (typeof window === 'undefined') return;
  const liked = getLikedThemes();
  if (!liked.includes(theme)) {
    liked.push(theme);
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(liked));
  }
}

export function hasLikedInSession(theme: Theme): boolean {
  return getLikedThemes().includes(theme);
}

// ── Write: send a like ─────────────────────────────────────────

/** Like a theme. No-ops if already liked this session. */
export async function likeTheme(theme: Theme): Promise<void> {
  if (hasLikedInSession(theme)) return;

  try {
    const { error } = await supabase
      .from('theme_likes')
      .insert({ theme, session_id: getSessionId() });

    if (error) {
      logger.error('[likeTheme] DB error:', error);
      return;
    }

    markAsLiked(theme);
    // Invalidate cached counts so next fetch is fresh
    cachedCounts = null;
  } catch (err) {
    logger.error('[likeTheme] Exception:', err);
  }
}

// ── Read: fetch like counts ────────────────────────────────────

interface ThemeLikeCount {
  theme: string;
  count: number;
}

let cachedCounts: Record<string, number> | null = null;
let cacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/** Get like counts for all themes (cached). */
export async function getAllLikeCounts(): Promise<Record<string, number>> {
  const now = Date.now();
  if (cachedCounts && now - cacheTime < CACHE_TTL) {
    return cachedCounts;
  }

  try {
    const { data, error } = await supabase.rpc('get_most_loved_themes', { p_limit: 100 });

    if (error) {
      logger.error('[getAllLikeCounts] DB error:', error);
      return cachedCounts || {};
    }

    const counts: Record<string, number> = {};
    for (const row of (data as ThemeLikeCount[]) || []) {
      counts[row.theme] = Number(row.count);
    }

    cachedCounts = counts;
    cacheTime = now;
    return counts;
  } catch (err) {
    logger.error('[getAllLikeCounts] Exception:', err);
    return cachedCounts || {};
  }
}

// ── Helpers ────────────────────────────────────────────────────

function getSessionId(): string {
  if (typeof window === 'undefined') return 'server';
  let id = sessionStorage.getItem('imposter_session_id');
  if (!id) {
    id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    sessionStorage.setItem('imposter_session_id', id);
  }
  return id;
}
