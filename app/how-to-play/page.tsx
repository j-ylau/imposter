import { Metadata } from 'next';
import Link from 'next/link';
import { generatePageSEO, GAME_SCHEMA } from '@/lib/seo';
import { getTranslation } from '@/lib/i18n';
import { en } from '@/lib/i18n/en';

export const metadata: Metadata = generatePageSEO(
  en.howToPlayPage.seo.title,
  en.howToPlayPage.seo.description,
  '/how-to-play'
);

export default function HowToPlayPage() {
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
            <div className="text-6xl mb-4">🎮</div>
            <h1 className="text-4xl md:text-5xl font-bold text-fg mb-3">
              {t.howToPlayPage.title}
            </h1>
            <p className="text-lg text-fg-muted">
              {t.howToPlayPage.subtitle}
            </p>
          </div>

          {/* Quick Start */}
          <div className="bg-primary-subtle border-2 border-primary rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-fg mb-4">
              {t.howToPlayPage.quickStart.title}
            </h2>
            <ol className="space-y-2 text-fg-muted">
              {t.howToPlayPage.quickStart.steps.map((step, index) => (
                <li key={index}>
                  <strong className="text-fg">{index + 1}.</strong> {step}
                </li>
              ))}
            </ol>
          </div>

          {/* Detailed Rules */}
          <div className="space-y-6">
            <section className="bg-card rounded-lg p-6 border border-border">
              <h2 className="text-2xl font-bold text-fg mb-4">
                {t.howToPlayPage.completeRules.title}
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-fg mb-3 flex items-center gap-2">
                    <span>1️⃣</span> {t.howToPlayPage.completeRules.setup.title}
                  </h3>
                  <ul className="space-y-2 text-fg-muted list-disc list-inside ml-6">
                    {t.howToPlayPage.completeRules.setup.items.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-fg mb-3 flex items-center gap-2">
                    <span>2️⃣</span> {t.howToPlayPage.completeRules.roleAssignment.title}
                  </h3>
                  <ul className="space-y-2 text-fg-muted list-disc list-inside ml-6">
                    {t.howToPlayPage.completeRules.roleAssignment.items.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-fg mb-3 flex items-center gap-2">
                    <span>3️⃣</span> {t.howToPlayPage.completeRules.clueRound.title}
                  </h3>
                  <ul className="space-y-2 text-fg-muted list-disc list-inside ml-6">
                    {t.howToPlayPage.completeRules.clueRound.items.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-fg mb-3 flex items-center gap-2">
                    <span>4️⃣</span> {t.howToPlayPage.completeRules.discussion.title}
                  </h3>
                  <ul className="space-y-2 text-fg-muted list-disc list-inside ml-6">
                    {t.howToPlayPage.completeRules.discussion.items.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-fg mb-3 flex items-center gap-2">
                    <span>5️⃣</span> {t.howToPlayPage.completeRules.voting.title}
                  </h3>
                  <ul className="space-y-2 text-fg-muted list-disc list-inside ml-6">
                    {t.howToPlayPage.completeRules.voting.items.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-fg mb-3 flex items-center gap-2">
                    <span>6️⃣</span> {t.howToPlayPage.completeRules.lastChance.title}
                  </h3>
                  <ul className="space-y-2 text-fg-muted list-disc list-inside ml-6">
                    {t.howToPlayPage.completeRules.lastChance.items.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* Winning Conditions */}
            <section className="bg-card rounded-lg p-6 border border-border">
              <h2 className="text-2xl font-bold text-fg mb-4">
                {t.howToPlayPage.winning.title}
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-success/10 border-2 border-success rounded-lg p-4">
                  <h3 className="font-bold text-success text-lg mb-2">
                    {t.howToPlayPage.winning.players.title}
                  </h3>
                  <ul className="space-y-2 text-fg-muted text-sm">
                    {t.howToPlayPage.winning.players.items.map((item, index) => (
                      <li key={index}>✓ {item}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-danger/10 border-2 border-danger rounded-lg p-4">
                  <h3 className="font-bold text-danger text-lg mb-2">
                    {t.howToPlayPage.winning.imposter.title}
                  </h3>
                  <ul className="space-y-2 text-fg-muted text-sm">
                    {t.howToPlayPage.winning.imposter.items.map((item, index) => (
                      <li key={index}>✓ {item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* Pro Tips */}
            <section className="bg-card rounded-lg p-6 border border-border">
              <h2 className="text-2xl font-bold text-fg mb-4">
                {t.howToPlayPage.proTips.title}
              </h2>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-fg mb-2">{t.howToPlayPage.proTips.forPlayers.title}</h3>
                  <ul className="space-y-2 text-fg-muted list-disc list-inside ml-4 text-sm">
                    {t.howToPlayPage.proTips.forPlayers.items.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-fg mb-2">{t.howToPlayPage.proTips.forImposter.title}</h3>
                  <ul className="space-y-2 text-fg-muted list-disc list-inside ml-4 text-sm">
                    {t.howToPlayPage.proTips.forImposter.items.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-fg mb-2">{t.howToPlayPage.proTips.general.title}</h3>
                  <ul className="space-y-2 text-fg-muted list-disc list-inside ml-4 text-sm">
                    {t.howToPlayPage.proTips.general.items.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* Example Game */}
            <section className="bg-card rounded-lg p-6 border border-border">
              <h2 className="text-2xl font-bold text-fg mb-4">
                {t.howToPlayPage.example.title}
              </h2>
              <div className="space-y-4 text-sm">
                <div className="bg-bg-subtle rounded-lg p-4">
                  <p className="text-fg mb-2"><strong>{t.howToPlayPage.example.secretWord}</strong> <span className="text-success">PIZZA</span></p>
                  <p className="text-fg mb-2"><strong>{t.howToPlayPage.example.imposter}</strong> <span className="text-danger">Mike</span></p>
                  <p className="text-fg-muted">{t.howToPlayPage.example.players}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex gap-3 items-start">
                    <div className="font-semibold text-fg min-w-[80px]">Sarah:</div>
                    <div className="text-fg-muted">{t.howToPlayPage.example.clue1}</div>
                  </div>
                  <div className="flex gap-3 items-start">
                    <div className="font-semibold text-fg min-w-[80px]">Alex:</div>
                    <div className="text-fg-muted">{t.howToPlayPage.example.clue2}</div>
                  </div>
                  <div className="flex gap-3 items-start">
                    <div className="font-semibold text-danger min-w-[80px]">Mike:</div>
                    <div className="text-fg-muted">{t.howToPlayPage.example.clue3}</div>
                  </div>
                </div>

                <div className="bg-primary-subtle border-l-4 border-primary p-4 rounded">
                  <p className="text-fg"><strong>Result:</strong> {t.howToPlayPage.example.result}</p>
                </div>
              </div>
            </section>

            {/* Call to Action */}
            <section className="text-center py-8 bg-primary-subtle rounded-lg">
              <h2 className="text-2xl font-bold text-fg mb-4">
                {t.howToPlayPage.cta.title}
              </h2>
              <p className="text-fg-muted mb-6">
                {t.howToPlayPage.cta.subtitle}
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Link
                  href="/"
                  className="bg-primary text-primary-fg px-8 py-3 rounded-lg font-medium hover:bg-primary-hover transition-colors text-lg"
                >
                  {t.howToPlayPage.cta.createRoom}
                </Link>
                <Link
                  href="/about"
                  className="bg-secondary text-fg px-8 py-3 rounded-lg font-medium hover:bg-secondary-hover transition-colors text-lg"
                >
                  {t.howToPlayPage.cta.learnMore}
                </Link>
              </div>
            </section>

            {/* Theme Links */}
            <section className="bg-card rounded-lg p-6 border border-border">
              <h2 className="text-2xl font-bold text-fg mb-4 text-center">
                {t.howToPlayPage.exploreThemes}
              </h2>
              <div className="flex gap-3 justify-center flex-wrap text-sm">
                <Link href="/theme/pokemon" className="text-primary hover:text-primary-hover underline">
                  Pokémon
                </Link>
                <Link href="/theme/anime" className="text-primary hover:text-primary-hover underline">
                  Anime
                </Link>
                <Link href="/theme/video-games" className="text-primary hover:text-primary-hover underline">
                  Video Games
                </Link>
                <Link href="/theme/music" className="text-primary hover:text-primary-hover underline">
                  Music
                </Link>
                <Link href="/theme/tiktok" className="text-primary hover:text-primary-hover underline">
                  TikTok
                </Link>
                <Link href="/theme/food" className="text-primary hover:text-primary-hover underline">
                  Food
                </Link>
              </div>
            </section>
          </div>

          {/* Footer Links */}
          <div className="text-center mt-8 pt-8 border-t border-border">
            <div className="flex gap-6 justify-center flex-wrap">
              <Link href="/" className="text-primary hover:text-primary-hover underline">
                {t.common.home}
              </Link>
              <Link href="/about" className="text-primary hover:text-primary-hover underline">
                {t.footer.about}
              </Link>
              <Link href="/privacy" className="text-primary hover:text-primary-hover underline">
                {t.footer.privacy}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
