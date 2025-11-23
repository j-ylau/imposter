// Single file that consolidates all theme wordlists

import type { Theme } from '@/schema';

// Static imports for SSG and game logic (needed for sync access)
import defaultWords from './default.json';
import pokemon from './pokemon.json';
import nba from './nba.json';
import memes from './memes.json';
import movies from './movies.json';
import countries from './countries.json';
import anime from './anime.json';
import videoGames from './video-games.json';
import youtube from './youtube.json';
import tiktok from './tiktok.json';
import music from './music.json';
import tvShows from './tv-shows.json';
import food from './food.json';
import brands from './brands.json';
import sports from './sports.json';

export const THEMES: Record<Theme, string[]> = {
  default: defaultWords,
  pokemon,
  nba,
  memes,
  movies,
  countries,
  anime,
  'video-games': videoGames,
  youtube,
  tiktok,
  music,
  'tv-shows': tvShows,
  food,
  brands,
  sports,
} as const;

// Lazy-load helper for async contexts (reduces bundle size for client components)
export async function getThemeWords(theme: Theme): Promise<string[]> {
  switch (theme) {
    case 'default':
      return (await import('./default.json')).default;
    case 'pokemon':
      return (await import('./pokemon.json')).default;
    case 'nba':
      return (await import('./nba.json')).default;
    case 'memes':
      return (await import('./memes.json')).default;
    case 'movies':
      return (await import('./movies.json')).default;
    case 'countries':
      return (await import('./countries.json')).default;
    case 'anime':
      return (await import('./anime.json')).default;
    case 'video-games':
      return (await import('./video-games.json')).default;
    case 'youtube':
      return (await import('./youtube.json')).default;
    case 'tiktok':
      return (await import('./tiktok.json')).default;
    case 'music':
      return (await import('./music.json')).default;
    case 'tv-shows':
      return (await import('./tv-shows.json')).default;
    case 'food':
      return (await import('./food.json')).default;
    case 'brands':
      return (await import('./brands.json')).default;
    case 'sports':
      return (await import('./sports.json')).default;
    default:
      return (await import('./default.json')).default;
  }
}

export const THEME_LABELS: Record<Theme, string> = {
  default: 'Default',
  pokemon: 'Pokémon',
  nba: 'NBA Players',
  memes: 'Memes',
  movies: 'Movies',
  countries: 'Countries',
  anime: 'Anime',
  'video-games': 'Video Games',
  youtube: 'YouTubers',
  tiktok: 'TikTok',
  music: 'Music Artists',
  'tv-shows': 'TV Shows',
  food: 'Food & Drinks',
  brands: 'Popular Brands',
  sports: 'Sports Stars',
};

export const THEME_DESCRIPTIONS: Record<Theme, string> = {
  default: 'Random objects, animals, and places',
  pokemon: 'Pokémon characters from all generations',
  nba: 'NBA players past and present',
  memes: 'Internet memes and viral trends',
  movies: 'Popular movies and cinema',
  countries: 'Countries from around the world',
  anime: 'Popular anime characters and series',
  'video-games': 'Video game characters and franchises',
  youtube: 'Famous YouTubers and content creators',
  tiktok: 'TikTok stars and trending dances',
  music: 'Popular music artists and singers',
  'tv-shows': 'Trending TV shows and series',
  food: 'Delicious foods and beverages',
  brands: 'Well-known brands and companies',
  sports: 'Famous athletes and sports teams',
};

export const THEME_EMOJIS: Record<Theme, string> = {
  default: '🎲',
  pokemon: '⚡',
  nba: '🏀',
  memes: '😂',
  movies: '🎬',
  countries: '🌍',
  anime: '⚔️',
  'video-games': '🎮',
  youtube: '📹',
  tiktok: '🎵',
  music: '🎤',
  'tv-shows': '📺',
  food: '🍕',
  brands: '🏷️',
  sports: '⚽',
};
