import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { SITE_URL, SITE_NAME } from '@/lib/constants';

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
      <body className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex flex-col">
        {/* Google AdSense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4975735342482892"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

        <main className="flex-1">
          {children}
        </main>
        <footer className="py-6 text-center">
          <p className="text-sm text-gray-600">
            Made with <span className="font-semibold text-primary-700">{SITE_NAME}</span> — Play with your friends at{' '}
            <a
              href={`https://${SITE_URL}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary-600 hover:text-primary-700 underline"
            >
              {SITE_URL}
            </a>
          </p>
        </footer>
      </body>
    </html>
  );
}
