/* eslint-disable react/no-unescaped-entities */
import { Metadata } from 'next';
import Link from 'next/link';
import { generatePageSEO } from '@/lib/seo';
import { getTranslation } from '@/lib/i18n';
import { en } from '@/lib/i18n/en';

export const metadata: Metadata = generatePageSEO(
  en.privacy.seo.title,
  en.privacy.seo.description,
  '/privacy'
);

export default function PrivacyPage() {
  const { t } = getTranslation();

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-fg mb-3">
            {t.privacy.title}
          </h1>
          <p className="text-fg-muted">
            {t.privacy.lastUpdated}
          </p>
        </div>

        {/* Content */}
        <div className="bg-card rounded-lg p-8 border border-border space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-fg mb-3">
              {t.privacy.intro.title}
            </h2>
            <p className="text-fg-muted">
              {t.privacy.intro.content}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-fg mb-3">
              {t.privacy.infoCollect.title}
            </h2>
            <div className="space-y-3 text-fg-muted">
              <div>
                <h3 className="font-semibold text-fg mb-2">{t.privacy.infoCollect.playerNames.title}</h3>
                <p>{t.privacy.infoCollect.playerNames.content}</p>
              </div>
              <div>
                <h3 className="font-semibold text-fg mb-2">{t.privacy.infoCollect.gameData.title}</h3>
                <p>{t.privacy.infoCollect.gameData.content}</p>
              </div>
              <div>
                <h3 className="font-semibold text-fg mb-2">{t.privacy.infoCollect.analytics.title}</h3>
                <p>{t.privacy.infoCollect.analytics.content}</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-fg mb-3">
              {t.privacy.howWeUse.title}
            </h2>
            <ul className="list-disc list-inside space-y-2 text-fg-muted">
              {t.privacy.howWeUse.items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-fg mb-3">
              {t.privacy.dataSecurity.title}
            </h2>
            <p className="text-fg-muted mb-3">
              {t.privacy.dataSecurity.intro}
            </p>
            <ul className="list-disc list-inside space-y-2 text-fg-muted">
              {t.privacy.dataSecurity.items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-fg mb-3">
              {t.privacy.thirdParty.title}
            </h2>
            <div className="space-y-3 text-fg-muted">
              <div>
                <h3 className="font-semibold text-fg mb-2">{t.privacy.thirdParty.googleAdsense.title}</h3>
                <p>
                  {t.privacy.thirdParty.googleAdsense.content}{' '}
                  <a
                    href="https://www.google.com/settings/ads"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary-hover underline"
                  >
                    {t.privacy.thirdParty.googleAdsense.linkText}
                  </a>.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-fg mb-2">{t.privacy.thirdParty.supabase.title}</h3>
                <p>
                  {t.privacy.thirdParty.supabase.content}{' '}
                  <a
                    href="https://supabase.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary-hover underline"
                  >
                    {t.privacy.thirdParty.supabase.linkText}
                  </a>.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-fg mb-3">
              {t.privacy.cookies.title}
            </h2>
            <p className="text-fg-muted">
              {t.privacy.cookies.content}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-fg mb-3">
              {t.privacy.childrenPrivacy.title}
            </h2>
            <p className="text-fg-muted">
              {t.privacy.childrenPrivacy.content}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-fg mb-3">
              {t.privacy.yourRights.title}
            </h2>
            <p className="text-fg-muted mb-3">
              {t.privacy.yourRights.intro}
            </p>
            <ul className="list-disc list-inside space-y-2 text-fg-muted">
              {t.privacy.yourRights.items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-fg mb-3">
              {t.privacy.changes.title}
            </h2>
            <p className="text-fg-muted">
              {t.privacy.changes.content}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-fg mb-3">
              {t.privacy.contact.title}
            </h2>
            <p className="text-fg-muted">
              {t.privacy.contact.content}{' '}
              <a
                href="https://imposterga.me"
                className="text-primary hover:text-primary-hover underline"
              >
                imposterga.me
              </a>.
            </p>
          </section>
        </div>

        {/* Footer Links */}
        <div className="text-center mt-8">
          <div className="flex gap-6 justify-center flex-wrap">
            <Link href="/" className="text-primary hover:text-primary-hover underline">
              {t.common.home}
            </Link>
            <Link href="/about" className="text-primary hover:text-primary-hover underline">
              {t.footer.about}
            </Link>
            <Link href="/how-to-play" className="text-primary hover:text-primary-hover underline">
              {t.footer.howToPlay}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
