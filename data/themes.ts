// Auto-generated from data/themes/manifest.json
// DO NOT EDIT MANUALLY - Run 'npm run generate:themes' to update

import type { Theme } from '@/schema';

// Static imports for SSG and game logic
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
import clashRoyale from './clash-royale.json';
import minecraft from './minecraft.json';
import animals from './animals.json';
import companies from './companies.json';

export const THEMES: Record<Theme, string[]> = {
  'default': defaultWords,
  pokemon: pokemon,
  nba: nba,
  memes: memes,
  movies: movies,
  countries: countries,
  anime: anime,
  'video-games': videoGames,
  youtube: youtube,
  tiktok: tiktok,
  music: music,
  'tv-shows': tvShows,
  food: food,
  brands: brands,
  sports: sports,
  'clash-royale': clashRoyale,
  minecraft: minecraft,
  animals: animals,
  companies: companies,
} as const;

// Lazy-load helper for async contexts (reduces bundle size)
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
    case 'clash-royale':
      return (await import('./clash-royale.json')).default;
    case 'minecraft':
      return (await import('./minecraft.json')).default;
    case 'animals':
      return (await import('./animals.json')).default;
    case 'companies':
      return (await import('./companies.json')).default;
    default:
      return (await import('./default.json')).default;
  }
}

export const THEME_LABELS: Record<Theme, string> = {
  'default': 'Default',
  'pokemon': 'Pokémon',
  'nba': 'NBA Players',
  'memes': 'Memes',
  'movies': 'Movies',
  'countries': 'Countries',
  'anime': 'Anime',
  'video-games': 'Video Games',
  'youtube': 'YouTubers',
  'tiktok': 'TikTok',
  'music': 'Music Artists',
  'tv-shows': 'TV Shows',
  'food': 'Food & Drinks',
  'brands': 'Popular Brands',
  'sports': 'Sports Stars',
  'clash-royale': 'Clash Royale',
  'minecraft': 'Minecraft',
  'animals': 'Animals',
  'companies': 'Companies',
};

export const THEME_DESCRIPTIONS: Record<Theme, string> = {
  'default': 'Random objects, animals, and places',
  'pokemon': 'Pokémon characters from all generations',
  'nba': 'NBA players past and present',
  'memes': 'Internet memes and viral trends',
  'movies': 'Popular movies and cinema',
  'countries': 'Countries from around the world',
  'anime': 'Popular anime characters and series',
  'video-games': 'Video game characters and franchises',
  'youtube': 'Famous YouTubers and content creators',
  'tiktok': 'TikTok stars and trending dances',
  'music': 'Popular music artists and singers',
  'tv-shows': 'Trending TV shows and series',
  'food': 'Delicious foods and beverages',
  'brands': 'Well-known brands and companies',
  'sports': 'Famous athletes and sports teams',
  'clash-royale': 'Clash Royale cards, troops, and spells',
  'minecraft': 'Minecraft mobs, items, and blocks',
  'animals': 'Wild and domestic animals from around the world',
  'companies': 'Famous companies and global brands',
};

export const THEME_EMOJIS: Record<Theme, string> = {
  'default': '🎲',
  'pokemon': '⚡',
  'nba': '🏀',
  'memes': '😂',
  'movies': '🎬',
  'countries': '🌍',
  'anime': '⚔️',
  'video-games': '🎮',
  'youtube': '📹',
  'tiktok': '🎵',
  'music': '🎤',
  'tv-shows': '📺',
  'food': '🍕',
  'brands': '🏷️',
  'sports': '⚽',
  'clash-royale': '👑',
  'minecraft': '⛏️',
  'animals': '🦁',
  'companies': '🏢',
};

export const THEME_AUDIENCES: Record<Theme, string> = {
    'default': 'Everyone',
    'pokemon': 'Teens and Young Adults',
    'nba': 'Sports Fans',
    'memes': 'Teens and Young Adults',
    'movies': 'Movie Enthusiasts',
    'countries': 'Geography Enthusiasts',
    'anime': 'Teens and Young Adults',
    'video-games': 'Gamers',
    'youtube': 'Content Creators',
    'tiktok': 'Gen Z',
    'music': 'Music Lovers',
    'tv-shows': 'TV Enthusiasts',
    'food': 'Foodies',
    'brands': 'Everyone',
    'sports': 'Sports Fans',
    'clash-royale': 'Mobile Gamers',
    'minecraft': 'Gamers and Kids',
    'animals': 'Everyone',
    'companies': 'Business Professionals',
};

export const THEME_OG_COLORS: Record<Theme, { start: string; end: string; accent: string }> = {
  'default': { start: '#667eea', end: '#764ba2', accent: '#f093fb' },
  'pokemon': { start: '#FFCB05', end: '#3D7DCA', accent: '#CC0000' },
  'nba': { start: '#C9082A', end: '#17408B', accent: '#FDB927' },
  'memes': { start: '#FF6B6B', end: '#4ECDC4', accent: '#FFE66D' },
  'movies': { start: '#141E30', end: '#243B55', accent: '#FFD700' },
  'countries': { start: '#0575E6', end: '#021B79', accent: '#00F260' },
  'anime': { start: '#FF416C', end: '#FF4B2B', accent: '#FFE66D' },
  'video-games': { start: '#7F00FF', end: '#E100FF', accent: '#00FFA3' },
  'youtube': { start: '#FF0000', end: '#282828', accent: '#FFFFFF' },
  'tiktok': { start: '#00F2EA', end: '#FF0050', accent: '#000000' },
  'music': { start: '#11998e', end: '#38ef7d', accent: '#FFD700' },
  'tv-shows': { start: '#2C3E50', end: '#4CA1AF', accent: '#E74C3C' },
  'food': { start: '#F857A6', end: '#FF5858', accent: '#FFF176' },
  'brands': { start: '#000000', end: '#434343', accent: '#FFD700' },
  'sports': { start: '#56ab2f', end: '#a8e063', accent: '#FFD700' },
  'clash-royale': { start: '#5B4FFF', end: '#FF4F7D', accent: '#FFD700' },
  'minecraft': { start: '#62C370', end: '#8B4513', accent: '#4169E1' },
  'animals': { start: '#FF6B35', end: '#4ECDC4', accent: '#FFE66D' },
  'companies': { start: '#141E30', end: '#243B55', accent: '#00D4FF' },
};
