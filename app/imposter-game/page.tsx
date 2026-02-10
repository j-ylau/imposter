import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE } from '@/lib/seo';
import { GAME_SCHEMA } from '@/lib/seo';
import { THEME_LABELS, THEME_EMOJIS } from '@/data/themes';
import { Theme } from '@/schema';

export const metadata: Metadata = {
  title: 'Imposter Game Online — Play Free with Friends | No Download',
  description:
    'Play the Imposter Game online for free — the party word game where one player is the imposter. Create a room, share a code, and find the imposter. Works on any device, no download or sign-up needed.',
  keywords: [
    'imposter game',
    'imposter game online',
    'play imposter game',
    'free imposter game',
    'imposter game browser',
    'imposter game no download',
    'imposter word game',
    'imposter game with friends',
    'online imposter game free',
    'imposter party game',
    'who is the imposter game',
    'secret word game',
    'social deduction game online',
    'word guessing party game',
  ],
  alternates: {
    canonical: `${SITE.url}/imposter-game`,
  },
  openGraph: {
    title: 'Imposter Game — Play Free Online with Friends',
    description:
      'The free online imposter word game. One player is the imposter — find them before they blend in! No download needed.',
    url: `${SITE.url}/imposter-game`,
    siteName: SITE.name,
    type: 'website',
    images: [
      {
        url: `${SITE.url}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Imposter Game - Play Free Online',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Imposter Game — Play Free Online with Friends',
    description:
      'The free online imposter word game. One player is the imposter — find them! No download needed.',
    images: [`${SITE.url}/og-image.png`],
  },
};

// FAQ structured data for rich snippets
const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is the Imposter Game?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The Imposter Game is a free online party word game where one player is secretly the imposter. Everyone except the imposter receives the same secret word. Players take turns giving one-word clues related to the secret word, and then vote on who they think the imposter is. The imposter tries to blend in without knowing the word.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do you play the Imposter Game online?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'To play the Imposter Game online: (1) Go to imposterga.me and create a room. (2) Share the room code with your friends. (3) Once everyone joins, start the game. One player is randomly chosen as the imposter. (4) Everyone except the imposter sees the secret word. (5) Take turns giving one-word clues. (6) Vote on who you think the imposter is!',
      },
    },
    {
      '@type': 'Question',
      name: 'Is the Imposter Game free?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, the Imposter Game is completely free to play. There are no downloads, no sign-ups, and no hidden fees. Just open your browser, create a room, and start playing with friends instantly.',
      },
    },
    {
      '@type': 'Question',
      name: 'How many players do you need for the Imposter Game?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You need a minimum of 3 players to play the Imposter Game. The game works best with 4-8 players, but supports up to 30+ players in Pass & Play mode, making it perfect for large parties.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can you play the Imposter Game on your phone?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! The Imposter Game works on any device with a web browser — phones, tablets, laptops, and desktops. No app download is required. Each player just opens the link on their own device.',
      },
    },
    {
      '@type': 'Question',
      name: 'What themes are available in the Imposter Game?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The Imposter Game has 24+ themes including Pokémon, Anime, NBA, Fortnite, Valorant, Marvel, K-Pop, Disney, Minecraft, Roblox, Movies, Music Artists, TikTok, Horror, Sneakers, Fast Food, Netflix, and more. You can also create custom word lists.',
      },
    },
  ],
};

const FEATURED_THEMES: Theme[] = [
  'pokemon', 'anime', 'fortnite', 'valorant', 'marvel',
  'kpop', 'minecraft', 'nba', 'movies', 'disney',
  'netflix', 'tiktok',
];

export default function ImposterGamePage() {
  const allThemes = Object.keys(THEME_LABELS) as Theme[];

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(GAME_SCHEMA) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }}
      />

      <div className="min-h-screen flex items-center justify-center p-4">
        <article className="max-w-2xl w-full space-y-8">

          {/* Hero */}
          <header className="text-center">
            <div className="text-7xl mb-3">🕵️</div>
            <h1 className="text-4xl md:text-5xl font-black text-fg mb-3 tracking-tight">
              Imposter Game
            </h1>
            <p className="text-lg text-fg-muted max-w-lg mx-auto mb-5">
              The free online imposter word game where one player is the imposter.
              Give clues, find the imposter, and guess the secret word — play instantly
              with friends on any device. No download needed.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover transition-colors text-lg"
            >
              🎮 Play Imposter Game Now — Free
            </Link>
          </header>

          {/* What is it */}
          <section>
            <h2 className="text-2xl font-bold text-fg mb-3">What is the Imposter Game?</h2>
            <p className="text-fg-muted leading-relaxed mb-3">
              The <strong>Imposter Game</strong> is a social deduction party game you can play
              online for free. The concept is simple: everyone in the group receives the same
              secret word — except one person, the imposter. Players take turns giving one-word
              clues related to the secret word, trying to prove they know it without giving it away
              to the imposter. After the clue round, everyone votes on who they think the imposter is.
            </p>
            <p className="text-fg-muted leading-relaxed">
              If the group correctly identifies the imposter, they win. But if the imposter blends in
              and avoids detection — or guesses the secret word — the imposter wins. It creates
              tense, hilarious moments as players try to give clues that are specific enough to prove
              innocence but vague enough to not reveal the word.
            </p>
          </section>

          {/* How to play */}
          <section>
            <h2 className="text-2xl font-bold text-fg mb-3">How to Play the Imposter Game Online</h2>
            <div className="space-y-3">
              <div className="flex gap-3 items-start">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white font-bold flex items-center justify-center text-sm">1</span>
                <div>
                  <p className="font-semibold text-fg">Create a Room</p>
                  <p className="text-fg-muted text-sm">Pick a theme (Pokémon, Fortnite, Marvel, etc.) and get a unique room code.</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white font-bold flex items-center justify-center text-sm">2</span>
                <div>
                  <p className="font-semibold text-fg">Share the Code</p>
                  <p className="text-fg-muted text-sm">Send the room code to your friends. Each player joins on their own device.</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white font-bold flex items-center justify-center text-sm">3</span>
                <div>
                  <p className="font-semibold text-fg">Roles Are Assigned</p>
                  <p className="text-fg-muted text-sm">One player is randomly chosen as the imposter. Everyone else sees the secret word.</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white font-bold flex items-center justify-center text-sm">4</span>
                <div>
                  <p className="font-semibold text-fg">Give Clues & Vote</p>
                  <p className="text-fg-muted text-sm">Take turns giving one-word clues. Then vote on who the imposter is!</p>
                </div>
              </div>
            </div>
          </section>

          {/* Why play */}
          <section>
            <h2 className="text-2xl font-bold text-fg mb-3">Why Play This Imposter Game?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="border border-border rounded-xl p-4">
                <p className="font-semibold text-fg mb-1">🆓 100% Free</p>
                <p className="text-fg-muted text-sm">No hidden fees, no premium tier. Every feature is free.</p>
              </div>
              <div className="border border-border rounded-xl p-4">
                <p className="font-semibold text-fg mb-1">📱 Any Device</p>
                <p className="text-fg-muted text-sm">Works on phones, tablets, and computers. No app download needed.</p>
              </div>
              <div className="border border-border rounded-xl p-4">
                <p className="font-semibold text-fg mb-1">⚡ Instant Play</p>
                <p className="text-fg-muted text-sm">No sign-up or account required. Create a room and play in seconds.</p>
              </div>
              <div className="border border-border rounded-xl p-4">
                <p className="font-semibold text-fg mb-1">🎯 24+ Themes</p>
                <p className="text-fg-muted text-sm">From Pokémon to K-Pop, Fortnite to Marvel — pick your vibe.</p>
              </div>
              <div className="border border-border rounded-xl p-4">
                <p className="font-semibold text-fg mb-1">👥 3-30+ Players</p>
                <p className="text-fg-muted text-sm">Small friend groups or massive parties — it scales.</p>
              </div>
              <div className="border border-border rounded-xl p-4">
                <p className="font-semibold text-fg mb-1">🔄 Two Game Modes</p>
                <p className="text-fg-muted text-sm">Online multiplayer (each on their own device) or Pass & Play (share one device).</p>
              </div>
            </div>
          </section>

          {/* Themes */}
          <section>
            <h2 className="text-2xl font-bold text-fg mb-3">Popular Imposter Game Themes</h2>
            <p className="text-fg-muted mb-3">
              Choose from {allThemes.length}+ themed word lists to keep the imposter game fresh every round:
            </p>
            <div className="flex flex-wrap gap-2 mb-3">
              {FEATURED_THEMES.map((theme) => (
                <Link
                  key={theme}
                  href={`/theme/${theme}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border hover:border-primary hover:bg-primary-subtle transition-colors text-sm"
                >
                  <span>{THEME_EMOJIS[theme]}</span>
                  <span className="font-medium text-fg">{THEME_LABELS[theme]}</span>
                </Link>
              ))}
            </div>
            <Link
              href="/"
              className="text-primary hover:text-primary-hover font-medium text-sm underline"
            >
              Browse all {allThemes.length} themes →
            </Link>
          </section>

          {/* FAQ */}
          <section>
            <h2 className="text-2xl font-bold text-fg mb-4">Imposter Game — Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-fg mb-1">What is the Imposter Game?</h3>
                <p className="text-fg-muted text-sm leading-relaxed">
                  The Imposter Game is a free online party word game where one player is secretly the
                  imposter. Everyone except the imposter receives the same secret word. Players take turns
                  giving one-word clues related to the secret word, and then vote on who they think the
                  imposter is. The imposter tries to blend in without knowing the word.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-fg mb-1">How do you play the Imposter Game online?</h3>
                <p className="text-fg-muted text-sm leading-relaxed">
                  Go to imposterga.me and create a room. Share the room code with your friends.
                  Once everyone joins, start the game. One player is randomly chosen as the imposter — everyone else
                  sees the secret word. Take turns giving one-word clues, then vote on who you think the imposter is!
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-fg mb-1">Is the Imposter Game free?</h3>
                <p className="text-fg-muted text-sm leading-relaxed">
                  Yes, completely free. No downloads, no sign-ups, no hidden fees. Just open your browser and play.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-fg mb-1">How many players do you need?</h3>
                <p className="text-fg-muted text-sm leading-relaxed">
                  Minimum 3 players. Works best with 4-8, but supports 30+ in Pass & Play mode for big parties.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-fg mb-1">Can you play the Imposter Game on your phone?</h3>
                <p className="text-fg-muted text-sm leading-relaxed">
                  Yes! It works on any device with a web browser — phones, tablets, laptops, desktops. No app required.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-fg mb-1">What makes this different from other imposter games?</h3>
                <p className="text-fg-muted text-sm leading-relaxed">
                  24+ themed word lists (Pokémon, Fortnite, Marvel, K-Pop, and more), instant browser play with no
                  downloads, both online multiplayer and pass-and-play modes, and custom word list support.
                </p>
              </div>
            </div>
          </section>

          {/* Bottom CTA */}
          <div className="text-center py-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover transition-colors text-lg"
            >
              🎮 Play the Imposter Game — Free
            </Link>
            <p className="text-fg-muted text-sm mt-2">No download. No sign-up. Just play.</p>
          </div>

        </article>
      </div>
    </>
  );
}
