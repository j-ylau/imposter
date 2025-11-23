import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import './theme.css';
import { SITE_URL } from '@/lib/constants';
import { ThemeProvider } from '@/components/Providers/ThemeProvider';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Imposter Word Game',
    description: 'Multiplayer word guessing party game. Play free online.',
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
      <body className="min-h-screen bg-gradient-to-br from-[var(--color-bg-start)] to-[var(--color-bg-end)] transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {/* Google AdSense */}
          <Script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4975735342482892"
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />

          <main className="pb-16">
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
          <footer className="fixed bottom-0 left-0 right-0 py-3 text-center bg-card/80 backdrop-blur-sm border-t border-border transition-colors">
            <p className="text-xs text-fg-muted">
              Made with ❤️ — Play with your friends at{' '}
              <a
                href={`https://${SITE_URL}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary hover:text-primary-hover underline"
              >
                {SITE_URL}
              </a>
            </p>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
