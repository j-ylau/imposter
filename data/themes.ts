// Auto-generated from data/themes/manifest.json
// DO NOT EDIT MANUALLY - Run 'npm run generate:themes' to update

import type { Theme } from '@/schema';

// Static imports for SSG and game logic
import pokemon from './pokemon.json';
import nba from './nba.json';
import memes from './memes.json';
import movies from './movies.json';
import anime from './anime.json';
import videoGames from './video-games.json';
import youtube from './youtube.json';
import tiktok from './tiktok.json';
import music from './music.json';
import tvShows from './tv-shows.json';
import clashRoyale from './clash-royale.json';
import minecraft from './minecraft.json';
import roblox from './roblox.json';
import valorant from './valorant.json';
import fortnite from './fortnite.json';
import leagueOfLegends from './league-of-legends.json';
import marvel from './marvel.json';
import kpop from './kpop.json';
import horror from './horror.json';
import slang from './slang.json';
import disney from './disney.json';
import sneakers from './sneakers.json';
import fastFood from './fast-food.json';
import netflix from './netflix.json';

export const THEMES: Record<Theme, string[]> = {
  pokemon: pokemon,
  nba: nba,
  memes: memes,
  movies: movies,
  anime: anime,
  'video-games': videoGames,
  youtube: youtube,
  tiktok: tiktok,
  music: music,
  'tv-shows': tvShows,
  'clash-royale': clashRoyale,
  minecraft: minecraft,
  roblox: roblox,
  valorant: valorant,
  fortnite: fortnite,
  'league-of-legends': leagueOfLegends,
  marvel: marvel,
  kpop: kpop,
  horror: horror,
  slang: slang,
  disney: disney,
  sneakers: sneakers,
  'fast-food': fastFood,
  netflix: netflix,
} as const;

// Lazy-load helper for async contexts (reduces bundle size)
export async function getThemeWords(theme: Theme): Promise<string[]> {
  switch (theme) {
    case 'pokemon':
      return (await import('./pokemon.json')).default;
    case 'nba':
      return (await import('./nba.json')).default;
    case 'memes':
      return (await import('./memes.json')).default;
    case 'movies':
      return (await import('./movies.json')).default;
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
    case 'clash-royale':
      return (await import('./clash-royale.json')).default;
    case 'minecraft':
      return (await import('./minecraft.json')).default;
    case 'roblox':
      return (await import('./roblox.json')).default;
    case 'valorant':
      return (await import('./valorant.json')).default;
    case 'fortnite':
      return (await import('./fortnite.json')).default;
    case 'league-of-legends':
      return (await import('./league-of-legends.json')).default;
    case 'marvel':
      return (await import('./marvel.json')).default;
    case 'kpop':
      return (await import('./kpop.json')).default;
    case 'horror':
      return (await import('./horror.json')).default;
    case 'slang':
      return (await import('./slang.json')).default;
    case 'disney':
      return (await import('./disney.json')).default;
    case 'sneakers':
      return (await import('./sneakers.json')).default;
    case 'fast-food':
      return (await import('./fast-food.json')).default;
    case 'netflix':
      return (await import('./netflix.json')).default;
    default:
      return (await import('./pokemon.json')).default;
  }
}

export const THEME_LABELS: Record<Theme, string> = {
  'pokemon': 'Pokémon',
  'nba': 'NBA Players',
  'memes': 'Memes',
  'movies': 'Movies',
  'anime': 'Anime',
  'video-games': 'Video Games',
  'youtube': 'YouTubers',
  'tiktok': 'TikTok',
  'music': 'Music Artists',
  'tv-shows': 'TV Shows',
  'clash-royale': 'Clash Royale',
  'minecraft': 'Minecraft',
  'roblox': 'Roblox',
  'valorant': 'Valorant',
  'fortnite': 'Fortnite',
  'league-of-legends': 'League of Legends',
  'marvel': 'Marvel',
  'kpop': 'K-Pop',
  'horror': 'Horror',
  'slang': 'Slang',
  'disney': 'Disney',
  'sneakers': 'Sneakers',
  'fast-food': 'Fast Food',
  'netflix': 'Netflix',
};

export const THEME_DESCRIPTIONS: Record<Theme, string> = {
  'pokemon': 'Pokémon characters from all generations',
  'nba': 'NBA players past and present',
  'memes': 'Internet memes and viral trends',
  'movies': 'Popular movies and cinema',
  'anime': 'Popular anime characters and series',
  'video-games': 'Video game characters and franchises',
  'youtube': 'Famous YouTubers and content creators',
  'tiktok': 'TikTok stars and trending creators',
  'music': 'Popular music artists and singers',
  'tv-shows': 'Trending TV shows and series',
  'clash-royale': 'Clash Royale cards, troops, and spells',
  'minecraft': 'Minecraft mobs, items, and blocks',
  'roblox': 'Popular Roblox games, items, and characters',
  'valorant': 'Valorant agents, maps, and weapons',
  'fortnite': 'Fortnite skins, locations, and items',
  'league-of-legends': 'League of Legends champions and items',
  'marvel': 'Marvel heroes, villains, and movies',
  'kpop': 'K-Pop groups, idols, and hits',
  'horror': 'Horror movies, villains, and urban legends',
  'slang': 'Gen Z slang, internet lingo, and viral phrases',
  'disney': 'Disney characters, movies, and theme parks',
  'sneakers': 'Sneaker brands, models, and culture',
  'fast-food': 'Fast food chains, menu items, and combos',
  'netflix': 'Netflix originals, characters, and shows',
};

export const THEME_EMOJIS: Record<Theme, string> = {
  'pokemon': '⚡',
  'nba': '🏀',
  'memes': '😂',
  'movies': '🎬',
  'anime': '⚔️',
  'video-games': '🎮',
  'youtube': '📹',
  'tiktok': '🎵',
  'music': '🎤',
  'tv-shows': '📺',
  'clash-royale': '👑',
  'minecraft': '⛏️',
  'roblox': '🧱',
  'valorant': '🔫',
  'fortnite': '🪂',
  'league-of-legends': '⚔️',
  'marvel': '🦸',
  'kpop': '🎶',
  'horror': '👻',
  'slang': '💬',
  'disney': '🏰',
  'sneakers': '👟',
  'fast-food': '🍔',
  'netflix': '🎥',
};

export const THEME_AUDIENCES: Record<Theme, string> = {
    'pokemon': 'Teens and Young Adults',
    'nba': 'Sports Fans',
    'memes': 'Teens and Young Adults',
    'movies': 'Movie Enthusiasts',
    'anime': 'Teens and Young Adults',
    'video-games': 'Gamers',
    'youtube': 'Content Creators',
    'tiktok': 'Gen Z',
    'music': 'Music Lovers',
    'tv-shows': 'TV Enthusiasts',
    'clash-royale': 'Mobile Gamers',
    'minecraft': 'Gamers and Kids',
    'roblox': 'Kids and Teens',
    'valorant': 'FPS Gamers',
    'fortnite': 'Teens and Gamers',
    'league-of-legends': 'MOBA Gamers',
    'marvel': 'Superhero Fans',
    'kpop': 'K-Pop Fans',
    'horror': 'Horror Fans',
    'slang': 'Gen Z and Millennials',
    'disney': 'Everyone',
    'sneakers': 'Sneakerheads',
    'fast-food': 'Foodies',
    'netflix': 'Binge Watchers',
};

export const THEME_CATEGORIES: Record<Theme, string> = {
  'pokemon': 'Gaming',
  'nba': 'Sports',
  'memes': 'Entertainment',
  'movies': 'Entertainment',
  'anime': 'Anime',
  'video-games': 'Gaming',
  'youtube': 'Social Media',
  'tiktok': 'Social Media',
  'music': 'Entertainment',
  'tv-shows': 'Entertainment',
  'clash-royale': 'Gaming',
  'minecraft': 'Gaming',
  'roblox': 'Gaming',
  'valorant': 'Gaming',
  'fortnite': 'Gaming',
  'league-of-legends': 'Gaming',
  'marvel': 'Entertainment',
  'kpop': 'Entertainment',
  'horror': 'Entertainment',
  'slang': 'Social Media',
  'disney': 'Entertainment',
  'sneakers': 'Fashion',
  'fast-food': 'Food',
  'netflix': 'Entertainment',
};

export const CATEGORIES = ["Anime","Entertainment","Fashion","Food","Gaming","Social Media","Sports"] as const;

export const THEME_OG_COLORS: Record<Theme, { start: string; end: string; accent: string }> = {
  'pokemon': { start: '#FFCB05', end: '#3D7DCA', accent: '#CC0000' },
  'nba': { start: '#C9082A', end: '#17408B', accent: '#FDB927' },
  'memes': { start: '#FF6B6B', end: '#4ECDC4', accent: '#FFE66D' },
  'movies': { start: '#141E30', end: '#243B55', accent: '#FFD700' },
  'anime': { start: '#FF416C', end: '#FF4B2B', accent: '#FFE66D' },
  'video-games': { start: '#7F00FF', end: '#E100FF', accent: '#00FFA3' },
  'youtube': { start: '#FF0000', end: '#282828', accent: '#FFFFFF' },
  'tiktok': { start: '#00F2EA', end: '#FF0050', accent: '#000000' },
  'music': { start: '#11998e', end: '#38ef7d', accent: '#FFD700' },
  'tv-shows': { start: '#2C3E50', end: '#4CA1AF', accent: '#E74C3C' },
  'clash-royale': { start: '#5B4FFF', end: '#FF4F7D', accent: '#FFD700' },
  'minecraft': { start: '#62C370', end: '#8B4513', accent: '#4169E1' },
  'roblox': { start: '#E2231A', end: '#393A3D', accent: '#00A2FF' },
  'valorant': { start: '#FF4655', end: '#0F1923', accent: '#ECE8E1' },
  'fortnite': { start: '#2B2E8B', end: '#6E32C9', accent: '#FFD700' },
  'league-of-legends': { start: '#C89B3C', end: '#091428', accent: '#0397AB' },
  'marvel': { start: '#ED1D24', end: '#1F1F1F', accent: '#FFE600' },
  'kpop': { start: '#FF6FA3', end: '#A855F7', accent: '#FFD700' },
  'horror': { start: '#1A1A2E', end: '#16213E', accent: '#E94560' },
  'slang': { start: '#6366F1', end: '#EC4899', accent: '#10B981' },
  'disney': { start: '#003087', end: '#1B1464', accent: '#FFD700' },
  'sneakers': { start: '#FF6B35', end: '#111827', accent: '#FFFFFF' },
  'fast-food': { start: '#DB0007', end: '#FFC72C', accent: '#27251F' },
  'netflix': { start: '#E50914', end: '#141414', accent: '#FFFFFF' },
};
