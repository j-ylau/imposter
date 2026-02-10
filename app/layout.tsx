import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import './theme.css';
import { ThemeProvider } from '@/components/Providers/ThemeProvider';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Footer } from '@/components/Layout/Footer';
import { PlayCTA } from '@/components/UI/PlayCTA';
import { ThemeToggle } from '@/components/UI/ThemeToggle';
import { GAME_SCHEMA } from '@/lib/seo';
import { Analytics } from '@vercel/analytics/next';
import { FloatingEmojis } from '@/components/Animations/FloatingEmojis';
import { UpdateBanner } from '@/components/Layout/UpdateBanner';

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  ),
  title: {
    default: 'Imposter Game - Play Free Online with Friends | Imposter Word Game',
    template: '%s | Imposter Game',
  },
  description:
    'Imposter Game — the free online party word game where one player is the imposter! Everyone gets a secret word except one person. Give clues, find the imposter, and guess the word. Play instantly with 3-12 friends. No downloads, no sign-up.',
  keywords: [
    'imposter game',
    'imposter game online',
    'imposter word game',
    'free imposter game',
    'play imposter game',
    'imposter game browser',
    'word guessing game',
    'party game online',
    'multiplayer party game',
    'social deduction game',
    'word game with friends',
    'free party game',
    'group game online',
    'pass and play game',
    'spy word game',
    'who is the imposter',
    'imposter word game free',
    'imposter game no download',
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
    title: 'Imposter Game - Play Free Online with Friends',
    description:
      'Imposter Game — one player is the imposter. Can you find them? Give clues, vote, and guess the word. Play free with friends, no downloads needed.',
    url: 'https://imposterga.me',
    siteName: 'Imposter Game',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: 'https://imposterga.me/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Imposter Game - Find the Imposter, Guess the Word',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Imposter Game - Play Free Online with Friends',
    description: 'Imposter Game — one player is the imposter. Give clues, vote, and guess the word. Play free with friends!',
    images: ['https://imposterga.me/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
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
      <body className="min-h-screen bg-bg transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {/* Google AdSense */}
          <Script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4975735342482892"
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />

          {/* Floating imposter-themed background emojis */}
          <FloatingEmojis count={14} />

          {/* Update Banner */}
          <UpdateBanner />

          {/* Fixed Top Nav */}
          <nav className="sticky top-0 z-50 px-4 py-3 flex items-center justify-between">
            <PlayCTA />
            <ThemeToggle />
          </nav>

          <main className="relative z-10 pb-16">
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
            theme="light"
            limit={3}
          />

          {/* Fixed Footer - Always Visible */}
          <Footer />
        </ThemeProvider>

        {/* Vercel Web Analytics */}
        <Analytics />
      </body>
    </html>
  );
}
