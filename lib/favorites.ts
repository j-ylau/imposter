// Local favorites — localStorage-based, no database needed
import type { Theme } from '@/schema';

const STORAGE_KEY = 'imposter_favorites';

/** Get all favorited themes */
export function getFavorites(): Theme[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/** Check if a theme is favorited */
export function isFavorite(theme: Theme): boolean {
  return getFavorites().includes(theme);
}

/** Toggle a theme's favorite status. Returns the new state. */
export function toggleFavorite(theme: Theme): boolean {
  const favorites = getFavorites();
  const index = favorites.indexOf(theme);

  if (index >= 0) {
    favorites.splice(index, 1);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    return false;
  } else {
    favorites.push(theme);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    return true;
  }
}
