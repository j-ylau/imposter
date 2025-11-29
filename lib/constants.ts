// All application constants in one place

// Site constants
export const SITE_URL = 'imposterga.me';
export const SITE_NAME = 'Imposter';
export const SITE_FULL_NAME = 'Imposter Word Game';
export const SITE_DOMAIN = 'https://imposterga.me';
export const SITE_DESCRIPTION = 'A fun multiplayer party game where one player is the imposter. Everyone gets a secret word except one person. Give clues, vote, and guess. Play instantly with friends in your browser.';
export const SITE_TAGLINE = 'Find the Imposter. Guess the Word.';
export const TWITTER_HANDLE = '@imposterga_me';

// Player constants
export const PLAYER_NAME_MIN_LENGTH = 2;
export const PLAYER_NAME_MAX_LENGTH = 20;

// Room constants
export const ROOM_ID_LENGTH = 6;
export const MIN_PLAYERS_TO_START = 3;
export const ROOM_ID_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ'; // Letters only, removed similar-looking chars (I, O)

// Game constants
export const CLUE_MAX_LENGTH = 20;
export const CLUE_MAX_WORDS = 1;

// SEO constants
export const DEFAULT_KEYWORDS = [
  'imposter word game',
  'word guessing game',
  'party game online',
  'multiplayer browser game',
  'group game',
  'online party game',
  'social deduction game',
  'word game with friends',
  'imposter game online',
  'guess the word game',
];

// Contact form constants
export const CONTACT_NAME_MAX_LENGTH = 100;
export const CONTACT_EMAIL_MAX_LENGTH = 100;
export const CONTACT_MESSAGE_MAX_LENGTH = 2000;
export const CONTACT_RATE_LIMIT = 3; // emails per window
export const CONTACT_RATE_WINDOW = 60 * 60 * 1000; // 1 hour in ms
export const CONTACT_EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
