import { Metadata } from 'next';
import Link from 'next/link';
import { generatePageSEO, GAME_SCHEMA } from '@/lib/seo';
import { getTranslation } from '@/lib/i18n';
import { en } from '@/lib/i18n/en';

export const metadata: Metadata = generatePageSEO(
  en.about.seo.title,
  en.about.seo.description,
  '/about'
);

export default function AboutPage() {
  const { t } = getTranslation();

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(GAME_SCHEMA) }}
      />

      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🕵️</div>
            <h1 className="text-4xl md:text-5xl font-bold text-fg mb-3">
              {t.about.title}
            </h1>
            <p className="text-lg text-fg-muted">
              {t.about.subtitle}
            </p>
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            {/* What is it */}
            <section className="bg-card rounded-lg p-6 border border-border">
              <h2 className="text-2xl font-bold text-fg mb-4">
                {t.about.whatIsIt.title}
              </h2>
              <div className="space-y-4 text-fg-muted">
                <p>{t.about.whatIsIt.p1}</p>
                <p>{t.about.whatIsIt.p2}</p>
                <p>{t.about.whatIsIt.p3}</p>
              </div>
            </section>

            {/* How it Started */}
            <section className="bg-card rounded-lg p-6 border border-border">
              <h2 className="text-2xl font-bold text-fg mb-4">
                {t.about.whyWeBuilt.title}
              </h2>
              <div className="space-y-4 text-fg-muted">
                <p>{t.about.whyWeBuilt.p1}</p>
                <p>{t.about.whyWeBuilt.p2}</p>
              </div>
            </section>

            {/* Features */}
            <section className="bg-card rounded-lg p-6 border border-border">
              <h2 className="text-2xl font-bold text-fg mb-4">
                {t.about.features.title}
              </h2>
              <ul className="space-y-3 text-fg-muted">
                <li className="flex items-start gap-3">
                  <span className="text-2xl">🎮</span>
                  <div>
                    <strong className="text-fg">{t.about.features.themes.title}</strong>
                    <p>{t.about.features.themes.desc}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl">⚡</span>
                  <div>
                    <strong className="text-fg">{t.about.features.instant.title}</strong>
                    <p>{t.about.features.instant.desc}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl">👥</span>
                  <div>
                    <strong className="text-fg">{t.about.features.players.title}</strong>
                    <p>{t.about.features.players.desc}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl">🌙</span>
                  <div>
                    <strong className="text-fg">{t.about.features.darkMode.title}</strong>
                    <p>{t.about.features.darkMode.desc}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl">💯</span>
                  <div>
                    <strong className="text-fg">{t.about.features.free.title}</strong>
                    <p>{t.about.features.free.desc}</p>
                  </div>
                </li>
              </ul>
            </section>

            {/* Popular Themes */}
            <section className="bg-card rounded-lg p-6 border border-border">
              <h2 className="text-2xl font-bold text-fg mb-4">
                {t.about.popularThemes.title}
              </h2>
              <div className="grid md:grid-cols-3 gap-3">
                <Link
                  href="/theme/pokemon"
                  className="p-4 bg-primary-subtle border-2 border-primary rounded-lg hover:scale-105 transition-transform"
                >
                  <div className="text-3xl mb-2">⚡</div>
                  <div className="font-semibold text-fg">Pokémon</div>
                  <div className="text-sm text-fg-muted">{t.about.popularThemes.pokemon}</div>
                </Link>
                <Link
                  href="/theme/anime"
                  className="p-4 bg-primary-subtle border-2 border-primary rounded-lg hover:scale-105 transition-transform"
                >
                  <div className="text-3xl mb-2">⚔️</div>
                  <div className="font-semibold text-fg">Anime</div>
                  <div className="text-sm text-fg-muted">{t.about.popularThemes.anime}</div>
                </Link>
                <Link
                  href="/theme/video-games"
                  className="p-4 bg-primary-subtle border-2 border-primary rounded-lg hover:scale-105 transition-transform"
                >
                  <div className="text-3xl mb-2">🎮</div>
                  <div className="font-semibold text-fg">Video Games</div>
                  <div className="text-sm text-fg-muted">{t.about.popularThemes.videoGames}</div>
                </Link>
                <Link
                  href="/theme/tiktok"
                  className="p-4 bg-primary-subtle border-2 border-primary rounded-lg hover:scale-105 transition-transform"
                >
                  <div className="text-3xl mb-2">🎵</div>
                  <div className="font-semibold text-fg">TikTok</div>
                  <div className="text-sm text-fg-muted">{t.about.popularThemes.tiktok}</div>
                </Link>
                <Link
                  href="/theme/music"
                  className="p-4 bg-primary-subtle border-2 border-primary rounded-lg hover:scale-105 transition-transform"
                >
                  <div className="text-3xl mb-2">🎤</div>
                  <div className="font-semibold text-fg">Music</div>
                  <div className="text-sm text-fg-muted">{t.about.popularThemes.music}</div>
                </Link>
                <Link
                  href="/theme/fortnite"
                  className="p-4 bg-primary-subtle border-2 border-primary rounded-lg hover:scale-105 transition-transform"
                >
                  <div className="text-3xl mb-2">🪂</div>
                  <div className="font-semibold text-fg">Fortnite</div>
                  <div className="text-sm text-fg-muted">Land, loot, and find the imposter</div>
                </Link>
              </div>
            </section>

            {/* Call to Action */}
            <section className="text-center py-8">
              <h2 className="text-2xl font-bold text-fg mb-4">
                {t.about.cta.title}
              </h2>
              <p className="text-fg-muted mb-6">
                {t.about.cta.subtitle}
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Link
                  href="/"
                  className="bg-primary text-primary-fg px-8 py-3 rounded-lg font-medium hover:bg-primary-hover transition-colors text-lg"
                >
                  {t.about.cta.createRoom}
                </Link>
                <Link
                  href="/how-to-play"
                  className="bg-secondary text-fg px-8 py-3 rounded-lg font-medium hover:bg-secondary-hover transition-colors text-lg"
                >
                  {t.about.cta.howToPlay}
                </Link>
              </div>
            </section>

            {/* Footer Links */}
            <div className="text-center pt-8 border-t border-border">
              <div className="flex gap-6 justify-center flex-wrap text-sm">
                <Link href="/imposter-game" className="text-primary hover:text-primary-hover underline font-medium">
                  Imposter Game
                </Link>
                <Link href="/privacy" className="text-primary hover:text-primary-hover underline">
                  {t.footer.privacy}
                </Link>
                <Link href="/how-to-play" className="text-primary hover:text-primary-hover underline">
                  {t.footer.howToPlay}
                </Link>
                <Link href="/" className="text-primary hover:text-primary-hover underline">
                  {t.common.returnHome}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
