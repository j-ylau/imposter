import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import './theme.css';
import { SITE_URL } from '@/lib/constants';
import { ThemeProvider } from '@/components/Providers/ThemeProvider';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Footer } from '@/components/Layout/Footer';
import { PlayCTA } from '@/components/UI/PlayCTA';
import { ThemeToggle } from '@/components/UI/ThemeToggle';
import { GAME_SCHEMA } from '@/lib/seo';

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
    'social deduction game',
    'word game with friends',
  ],
  alternates: {
    canonical: 'https://imposterga.me',
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
      },
    ],
  },
  manifest: '/site.webmanifest',
  openGraph: {
    title: 'Imposter Word Game - Play Online with Friends',
    description:
      'A fun multiplayer party game. One player is the imposter. Give clues, vote, and guess the word. Play free in your browser.',
    url: 'https://imposterga.me',
    siteName: 'Imposter Word Game',
    type: 'website',
    images: [
      {
        url: 'https://imposterga.me/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Imposter Word Game',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Imposter Word Game',
    description: 'Multiplayer word guessing party game. Play free online.',
    images: ['https://imposterga.me/og-image.png'],
  },
  other: {
    'google-adsense-account': 'ca-pub-4975735342482892',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* JSON-LD Structured Data for Game */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(GAME_SCHEMA) }}
        />
      </head>
      <body className="min-h-screen bg-gradient-to-br from-[var(--color-bg-start)] to-[var(--color-bg-end)] transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {/* Google AdSense */}
          <Script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4975735342482892"
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />

          {/* Fixed Top Nav */}
          <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-3 flex items-center justify-between">
            <PlayCTA />
            <ThemeToggle />
          </nav>

          <main className="pb-16 pt-16">
            {children}
          </main>

          {/* Toast Container */}
          <ToastContainer
            position="top-center"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss={false}
            draggable
            pauseOnHover
            theme="colored"
          />

          {/* Fixed Footer - Always Visible */}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
