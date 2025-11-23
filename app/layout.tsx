import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  ),
  title: 'Imposter Word Game - Play Online with Friends',
  description:
    'A fun multiplayer party game where one player is the imposter. Everyone gets a secret word except one person. Give clues, vote, and guess. Play instantly with friends in your browser.',
  keywords: [
    'imposter word game',
    'word guessing game',
    'party game online',
    'multiplayer browser game',
    'group game',
    'online party game',
  ],
  openGraph: {
    title: 'Imposter Word Game - Play Online with Friends',
    description:
      'A fun multiplayer party game. One player is the imposter. Give clues, vote, and guess the word. Play free in your browser.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Imposter Word Game',
    description: 'Multiplayer word guessing party game. Play free online.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
        {children}
      </body>
    </html>
  );
}
