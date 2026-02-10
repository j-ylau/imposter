'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getBaseUrl } from '@/lib/util';
import { useTranslation } from '@/lib/i18n';
import { ContactModal } from '@/components/Contact/ContactModal';

export function Footer() {
  const { t } = useTranslation();
  const baseUrl = getBaseUrl();
  const displayUrl = baseUrl.replace(/^https?:\/\//, ''); // Remove protocol for display
  const [showContact, setShowContact] = useState(false);

  return (
    <>
      <footer className="fixed bottom-0 left-0 right-0 py-3 bg-card/80 backdrop-blur-sm border-t border-border transition-colors z-40">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-2">
            <p className="text-xs text-fg-muted">
              {t.footer.madeWith}{' '}
              <a
                href={baseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary hover:text-primary-hover underline"
              >
                {displayUrl}
              </a>
            </p>
            <div className="flex gap-4 text-xs">
              <Link href="/imposter-game" className="text-fg-muted hover:text-primary transition-colors font-medium">
                Imposter Game
              </Link>
              <Link href="/about" className="text-fg-muted hover:text-primary transition-colors">
                {t.footer.about}
              </Link>
              <Link href="/how-to-play" className="text-fg-muted hover:text-primary transition-colors">
                {t.footer.howToPlay}
              </Link>
              <Link href="/privacy" className="text-fg-muted hover:text-primary transition-colors">
                {t.footer.privacy}
              </Link>
              <button
                onClick={() => setShowContact(true)}
                className="text-fg-muted hover:text-primary transition-colors"
              >
                {t.footer.contact}
              </button>
            </div>
          </div>
        </div>
      </footer>

      <ContactModal isOpen={showContact} onClose={() => setShowContact(false)} />
    </>
  );
}
