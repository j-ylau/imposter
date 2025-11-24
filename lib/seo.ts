// Single source of truth for all SEO configuration
import type { Metadata } from 'next';
import type { Theme } from '@/schema';
import { THEME_LABELS, THEME_DESCRIPTIONS, THEME_EMOJIS } from '@/data/themes';
import {
  SITE_FULL_NAME,
  SITE_NAME,
  SITE_DOMAIN,
  SITE_DESCRIPTION,
  SITE_TAGLINE,
  SITE_URL,
  TWITTER_HANDLE,
  DEFAULT_KEYWORDS,
} from '@/lib/constants';

// Site Configuration (derived from constants)
export const SITE = {
  name: SITE_FULL_NAME,
  shortName: SITE_NAME,
  domain: SITE_URL,
  url: SITE_DOMAIN,
  description: SITE_DESCRIPTION,
  tagline: SITE_TAGLINE,
} as const;

// Default OpenGraph Image
export const DEFAULT_OG_IMAGE = {
  url: `${SITE.url}/og-image.png`,
  width: 1200,
  height: 630,
  alt: SITE.name,
};

// JSON-LD Structured Data for Game
export const GAME_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Game',
  name: SITE.name,
  description: SITE.description,
  url: SITE.url,
  applicationCategory: 'Game',
  genre: ['Party Game', 'Word Game', 'Social Deduction'],
  numberOfPlayers: {
    '@type': 'QuantitativeValue',
    minValue: 3,
    maxValue: 12,
  },
  gamePlatform: 'Web Browser',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};

// Generate Theme-Specific SEO (fully DRY - auto-reads from theme data)
export function generateThemeSEO(theme: Theme): Metadata {
  const label = THEME_LABELS[theme];
  const description = THEME_DESCRIPTIONS[theme];
  const emoji = THEME_EMOJIS[theme];
  const url = `${SITE.url}/theme/${theme}`;

  const title = `${emoji} ${label} - ${SITE.name}`;
  const fullDescription = `Play Imposter Word Game with ${label.toLowerCase()} theme. ${description}. Find the imposter, guess the word, and have fun with friends online!`;

  const keywords = [
    ...DEFAULT_KEYWORDS,
    `${label.toLowerCase()} word game`,
    `${label.toLowerCase()} party game`,
    `${label.toLowerCase()} imposter game`,
    `guess ${label.toLowerCase()}`,
    theme,
  ];

  return {
    title,
    description: fullDescription,
    keywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description: fullDescription,
      url,
      siteName: SITE.name,
      type: 'website',
      images: [
        {
          url: `${SITE.url}/api/og?theme=${theme}`,
          width: 1200,
          height: 630,
          alt: `${label} - ${SITE.name}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: fullDescription,
      images: [`${SITE.url}/api/og?theme=${theme}`],
      site: TWITTER_HANDLE,
    },
  };
}

// Generate Room-Specific SEO
export function generateRoomSEO(roomId: string): Metadata {
  const url = `${SITE.url}/room/${roomId}`;
  const title = `Room ${roomId} - ${SITE.name}`;
  const description = `Join room ${roomId} to play Imposter Word Game with your friends. Find the imposter and guess the secret word!`;

  return {
    title,
    description,
    keywords: DEFAULT_KEYWORDS,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE.name,
      type: 'website',
      images: [
        {
          url: `${SITE.url}/api/og?room=${roomId}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${SITE.url}/api/og?room=${roomId}`],
    },
  };
}

// Generate Default Page SEO
export function generatePageSEO(
  title: string,
  description: string,
  path: string = ''
): Metadata {
  const url = `${SITE.url}${path}`;
  const fullTitle = `${title} - ${SITE.name}`;

  return {
    title: fullTitle,
    description,
    keywords: DEFAULT_KEYWORDS,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE.name,
      type: 'website',
      images: [DEFAULT_OG_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [DEFAULT_OG_IMAGE.url],
    },
  };
}

// Theme-specific JSON-LD Schema
export function generateThemeSchema(theme: Theme) {
  const label = THEME_LABELS[theme];
  const description = THEME_DESCRIPTIONS[theme];

  // Determine audience based on theme
  const themeAudiences: Record<Theme, string> = {
    default: 'Everyone',
    pokemon: 'Teens and Young Adults',
    nba: 'Sports Fans',
    memes: 'Teens and Young Adults',
    movies: 'Movie Enthusiasts',
    countries: 'Geography Enthusiasts',
    anime: 'Teens and Young Adults',
    'video-games': 'Gamers',
    youtube: 'Content Creators',
    tiktok: 'Gen Z',
    music: 'Music Lovers',
    'tv-shows': 'TV Enthusiasts',
    food: 'Foodies',
    brands: 'Everyone',
    sports: 'Sports Fans',
  };

  return {
    '@context': 'https://schema.org',
    '@type': 'Game',
    name: `${label} - ${SITE.name}`,
    description: `Play Imposter Word Game with ${label.toLowerCase()} theme. ${description}`,
    url: `${SITE.url}/theme/${theme}`,
    applicationCategory: 'Game',
    genre: ['Party Game', 'Word Game', label],
    audience: themeAudiences[theme],
    inLanguage: 'en',
    gamePlatform: 'Web Browser',
    numberOfPlayers: {
      '@type': 'QuantitativeValue',
      minValue: 3,
      maxValue: 30,
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };
}
