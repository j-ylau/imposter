/**
 * Centralized logging utility
 * No console logs in production - dev-only logging
 */

const isDev = process.env.NODE_ENV === 'development';

export const logger = {
  log: (...args: unknown[]): void => {
    if (isDev) {
      console.log(...args);
    }
  },

  warn: (...args: unknown[]): void => {
    if (isDev) {
      console.warn(...args);
    }
  },

  error: (...args: unknown[]): void => {
    if (isDev) {
      console.error(...args);
    }
  },

  debug: (...args: unknown[]): void => {
    if (isDev) {
      console.debug(...args);
    }
  },
} as const;
