import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Theme } from '@/schema';
import { THEME_LABELS, THEME_DESCRIPTIONS, THEME_EMOJIS, THEMES, THEME_AUDIENCES } from '@/data/themes';
import { generateThemeSEO, generateThemeSchema } from '@/lib/seo';
import { getTranslation } from '@/lib/i18n';

interface ThemePageProps {
  params: {
    slug: string;
  };
}

// Deterministic shuffle based on seed string
function deterministicShuffle<T>(array: T[], seed: string): T[] {
  const arr = [...array];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit integer
  }

  for (let i = arr.length - 1; i > 0; i--) {
    hash = (hash * 9301 + 49297) % 233280; // Simple LCG
    const j = Math.floor((hash / 233280) * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Generate metadata for each theme page
export async function generateMetadata({ params }: ThemePageProps): Promise<Metadata> {
  const theme = params.slug as Theme;

  // Check if theme exists
  if (!THEMES[theme]) {
    return {
      title: 'Theme Not Found',
      description: 'The requested theme could not be found.',
    };
  }

  return generateThemeSEO(theme);
}

// Generate static paths for all themes
export async function generateStaticParams() {
  const themes = Object.keys(THEMES) as Theme[];
  return themes.map((theme) => ({
    slug: theme,
  }));
}

export default function ThemePage({ params }: ThemePageProps) {
  const theme = params.slug as Theme;
  const { t, format } = getTranslation();

  // Validate theme
  if (!THEMES[theme]) {
    notFound();
  }

  const label = THEME_LABELS[theme];
  const description = THEME_DESCRIPTIONS[theme];
  const emoji = THEME_EMOJIS[theme];
  const words = THEMES[theme];
  const schema = generateThemeSchema(theme);

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">{emoji}</div>
            <h1 className="text-4xl md:text-5xl font-bold text-fg mb-3">
              {label}
            </h1>
            <p className="text-lg text-fg-muted mb-6">{description}</p>

            {/* CTA Buttons */}
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                href={`/?theme=${theme}`}
                className="bg-primary text-primary-fg px-6 py-3 rounded-lg font-medium hover:bg-primary-hover transition-colors"
              >
                {format(t.themePage.playWith, { theme: label })}
              </Link>
              <Link
                href="/"
                className="bg-secondary text-fg px-6 py-3 rounded-lg font-medium hover:bg-secondary-hover transition-colors"
              >
                {t.themePage.backToHome}
              </Link>
            </div>
          </div>

          {/* SEO Content Section */}
          <div className="bg-card rounded-lg p-6 mb-8 border border-border">
            <h2 className="text-2xl font-bold text-fg mb-4">
              {format(t.themePage.about.title, { theme: label })}
            </h2>
            <div className="space-y-4 text-fg-muted">
              <p>
                {format(t.themePage.about.p1, { theme: label.toLowerCase() })}
              </p>
              <p>
                {format(t.themePage.about.p2, { theme: label.toLowerCase() })}
              </p>
              <h3 className="text-xl font-semibold text-fg mt-6 mb-3">
                {format(t.themePage.about.howToPlay, { theme: label })}
              </h3>
              <ul className="list-disc list-inside space-y-2">
                {t.themePage.about.howToPlayItems.map((item, index) => (
                  <li key={index}>{format(item, { theme: label.toLowerCase() })}</li>
                ))}
              </ul>
              <h3 className="text-xl font-semibold text-fg mt-6 mb-3">
                {format(t.themePage.about.whyChoose, { theme: label })}
              </h3>
              <p>
                {format(t.themePage.about.whyChooseContent, { theme: label.toLowerCase(), count: words.length })}
              </p>
            </div>
          </div>

          {/* Word Preview */}
          <div className="bg-card rounded-lg p-6 border border-border">
            <h2 className="text-2xl font-bold text-fg mb-4">
              {format(t.themePage.exampleWords.title, { count: words.length })}
            </h2>
            <div className="flex flex-wrap gap-2">
              {words.slice(0, 20).map((word, index) => (
                <span
                  key={index}
                  className="bg-primary-subtle text-primary px-3 py-1 rounded-full text-sm"
                >
                  {word}
                </span>
              ))}
              {words.length > 20 && (
                <span className="text-fg-muted italic px-3 py-1">
                  {format(t.themePage.exampleWords.andMore, { count: words.length - 20 })}
                </span>
              )}
            </div>
          </div>

          {/* FAQ Section - rich text content for SEO and Auto Ads */}
          <div className="bg-card rounded-lg p-6 mt-8 border border-border">
            <h2 className="text-2xl font-bold text-fg mb-4">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4 text-fg-muted">
              <div>
                <h3 className="font-semibold text-fg mb-1">How many players do I need for the {label} theme?</h3>
                <p>You need at least 3 players and can play with up to 12. The {label.toLowerCase()} theme works great with any group size — more players means more suspects and more fun!</p>
              </div>
              <div>
                <h3 className="font-semibold text-fg mb-1">Can I play {label} Imposter on my phone?</h3>
                <p>Yes! Imposter Word Game is fully mobile-friendly. You can play online with each person on their own device, or use Pass &amp; Play mode to share a single phone. No app download needed.</p>
              </div>
              <div>
                <h3 className="font-semibold text-fg mb-1">Who is the {label} theme best for?</h3>
                <p>The {label.toLowerCase()} theme is perfect for {THEME_AUDIENCES[theme]?.toLowerCase() || 'everyone'}. It has {words.length} carefully curated words that fans will recognize and enjoy debating over.</p>
              </div>
              <div>
                <h3 className="font-semibold text-fg mb-1">Is Imposter Word Game free?</h3>
                <p>Completely free! No downloads, no sign-ups, no paywalls. Create a room, share the code, and start playing in seconds.</p>
              </div>
            </div>
          </div>

          {/* Related Themes - dynamic cross-links */}
          <div className="mt-8">
            <h2 className="text-xl font-bold text-fg text-center mb-4">
              {t.themePage.exploreMore}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {deterministicShuffle(
                (Object.keys(THEMES) as Theme[]).filter((t) => t !== theme),
                theme
              )
                .slice(0, 8)
                .map((relatedTheme) => (
                  <Link
                    key={relatedTheme}
                    href={`/theme/${relatedTheme}`}
                    className="flex items-center gap-2 p-3 rounded-lg border border-border hover:border-primary hover:bg-primary-subtle transition-all"
                  >
                    <span className="text-xl">{THEME_EMOJIS[relatedTheme]}</span>
                    <span className="font-medium text-fg text-sm">{THEME_LABELS[relatedTheme]}</span>
                  </Link>
                ))}
            </div>
            <div className="text-center mt-4">
              <Link href="/how-to-play" className="text-primary hover:text-primary-hover font-medium text-sm underline transition-colors">
                {t.footer.howToPlay}
              </Link>
              <span className="text-fg-subtle mx-2">·</span>
              <Link href="/about" className="text-primary hover:text-primary-hover font-medium text-sm underline transition-colors">
                {t.footer.about}
              </Link>
              <span className="text-fg-subtle mx-2">·</span>
              <Link href="/" className="text-primary hover:text-primary-hover font-medium text-sm underline transition-colors">
                All Themes
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
