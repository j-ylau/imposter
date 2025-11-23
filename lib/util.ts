// Small utility helpers

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ROOM_ID_LENGTH, ROOM_ID_CHARS, PLAYER_NAME_MIN_LENGTH, PLAYER_NAME_MAX_LENGTH } from './constants';

// Tailwind classnames merge helper
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Generate random room ID
export function generateRoomId(): string {
  let result = '';
  for (let i = 0; i < ROOM_ID_LENGTH; i++) {
    result += ROOM_ID_CHARS.charAt(Math.floor(Math.random() * ROOM_ID_CHARS.length));
  }
  return result;
}

// Generate random player ID
export function generatePlayerId(): string {
  return `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Shuffle array (Fisher-Yates)
export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Get random item from array
export function randomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

// Format timestamp to readable time
export function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

// Validate room ID format
export function isValidRoomId(roomId: string): boolean {
  const pattern = new RegExp(`^[A-Z]{${ROOM_ID_LENGTH}}$`);
  return pattern.test(roomId);
}

// Get base URL dynamically based on environment
export function getBaseUrl(): string {
  // Check if we're on the client side
  if (typeof window !== 'undefined') {
    return `${window.location.protocol}//${window.location.host}`;
  }

  // Server-side: check environment variables
  // Vercel automatically sets VERCEL_URL
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // Check for custom domain in production
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }

  // Fallback to localhost for development
  return 'http://localhost:3002';
}

// Validate player name
export function isValidPlayerName(name: string): boolean {
  const trimmed = name.trim();
  return trimmed.length >= PLAYER_NAME_MIN_LENGTH && trimmed.length <= PLAYER_NAME_MAX_LENGTH;
}
