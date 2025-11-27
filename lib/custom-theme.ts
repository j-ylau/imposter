// Custom Theme Management (24-hour localStorage cache)

const STORAGE_KEY = 'custom_theme';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const MIN_WORDS = 8;

export interface CustomTheme {
  words: string[];
  createdAt: string;
  expiresAt: string;
}

/**
 * Check if custom theme exists and is not expired
 */
export function hasCustomTheme(): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return false;

    const theme: CustomTheme = JSON.parse(stored);
    const now = new Date().getTime();
    const expiresAt = new Date(theme.expiresAt).getTime();

    return now < expiresAt;
  } catch (error) {
    // Invalid data, clean up
    localStorage.removeItem(STORAGE_KEY);
    return false;
  }
}

/**
 * Get custom theme words (if valid and not expired)
 */
export function getCustomTheme(): string[] | null {
  if (!hasCustomTheme()) return null;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const theme: CustomTheme = JSON.parse(stored);
    return theme.words;
  } catch (error) {
    return null;
  }
}

/**
 * Parse and validate word input
 * Supports comma-separated or newline-separated
 */
export function parseWords(input: string): { valid: boolean; words: string[]; error?: string } {
  // Try splitting by newlines first, then by commas
  let words = input
    .split(/[\n,]/)
    .map((w) => w.trim())
    .filter((w) => w.length > 0);

  // Remove duplicates
  words = Array.from(new Set(words));

  // Validation
  if (words.length < MIN_WORDS) {
    return {
      valid: false,
      words: [],
      error: `Please enter at least ${MIN_WORDS} words (found ${words.length})`,
    };
  }

  // Check for words that are too long
  const tooLong = words.filter((w) => w.length > 30);
  if (tooLong.length > 0) {
    return {
      valid: false,
      words: [],
      error: `Some words are too long (max 30 characters): ${tooLong[0]}`,
    };
  }

  return {
    valid: true,
    words,
  };
}

/**
 * Save custom theme to localStorage
 */
export function saveCustomTheme(words: string[]): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + CACHE_DURATION);

    const theme: CustomTheme = {
      words,
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(theme));
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Delete custom theme
 */
export function deleteCustomTheme(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Get expiry info for custom theme
 */
export function getCustomThemeExpiry(): { expiresAt: Date; hoursLeft: number } | null {
  if (!hasCustomTheme()) return null;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const theme: CustomTheme = JSON.parse(stored);
    const expiresAt = new Date(theme.expiresAt);
    const now = new Date();
    const hoursLeft = Math.max(0, Math.round((expiresAt.getTime() - now.getTime()) / (60 * 60 * 1000)));

    return { expiresAt, hoursLeft };
  } catch (error) {
    return null;
  }
}
