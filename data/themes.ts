// Single file that consolidates all theme wordlists

import type { Theme } from '@/schema';
import defaultWords from './default.json';
import pokemon from './pokemon.json';
import nba from './nba.json';
import memes from './memes.json';
import movies from './movies.json';
import countries from './countries.json';

export const THEMES: Record<Theme, string[]> = {
  default: defaultWords,
  pokemon,
  nba,
  memes,
  movies,
  countries,
} as const;

export const THEME_LABELS: Record<Theme, string> = {
  default: 'Default',
  pokemon: 'Pokémon',
  nba: 'NBA Players',
  memes: 'Memes',
  movies: 'Movies & TV',
  countries: 'Countries',
};

export const THEME_DESCRIPTIONS: Record<Theme, string> = {
  default: 'Random objects, animals, and places',
  pokemon: 'Pokémon characters from all generations',
  nba: 'NBA players past and present',
  memes: 'Internet memes and viral trends',
  movies: 'Popular movies and TV shows',
  countries: 'Countries from around the world',
};

export const THEME_EMOJIS: Record<Theme, string> = {
  default: '🎲',
  pokemon: '⚡',
  nba: '🏀',
  memes: '😂',
  movies: '🎬',
  countries: '🌍',
};
