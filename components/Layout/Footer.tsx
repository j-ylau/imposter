'use client';

import Link from 'next/link';
import { SITE_URL } from '@/lib/constants';
import { useTranslation } from '@/lib/i18n';

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="fixed bottom-0 left-0 right-0 py-3 bg-card/80 backdrop-blur-sm border-t border-border transition-colors">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-xs text-fg-muted">
            {t.footer.madeWith}{' '}
            <a
              href={`https://${SITE_URL}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary hover:text-primary-hover underline"
            >
              {SITE_URL}
            </a>
          </p>
          <div className="flex gap-4 text-xs">
            <Link href="/about" className="text-fg-muted hover:text-primary transition-colors">
              {t.footer.about}
            </Link>
            <Link href="/how-to-play" className="text-fg-muted hover:text-primary transition-colors">
              {t.footer.howToPlay}
            </Link>
            <Link href="/privacy" className="text-fg-muted hover:text-primary transition-colors">
              {t.footer.privacy}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
