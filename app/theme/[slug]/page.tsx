import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Theme } from '@/schema';
import { THEME_LABELS, THEME_DESCRIPTIONS, THEME_EMOJIS, THEMES } from '@/data/themes';
import { generateThemeSEO, generateThemeSchema } from '@/lib/seo';
import { getTranslation } from '@/lib/i18n';

interface ThemePageProps {
  params: {
    slug: string;
  };
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

          {/* Internal Links */}
          <div className="mt-8 text-center">
            <p className="text-fg-muted mb-4">
              {t.themePage.exploreMore}
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
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
              <Link href="/how-to-play" className="text-primary hover:text-primary-hover underline">
                {t.footer.howToPlay}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
