'use client';

import { useState, useEffect } from 'react';
import { Theme } from '@/schema';
import { THEME_LABELS, THEME_EMOJIS } from '@/data/themes';
import { getPopularThemes, getMostPopularThemes, PopularTheme } from '@/lib/theme-stats';
import { getThemeLikeCount } from '@/lib/theme-likes';
import { getTrendingThemes } from '@/lib/trending';
import { Card, CardBody, CardHeader } from '@/components/UI/Card';
import { motion } from 'framer-motion';
import { logger } from '@/lib/logger';
import { useTranslation } from '@/lib/i18n';

interface PopularThemesProps {
  onThemeSelect: (theme: Theme) => void;
  selectedTheme?: Theme;
  onBrowseThemes?: () => void;
  // Server-side preload support
  initialData?: PopularTheme[];
  initialLikeCounts?: Record<string, number>;
  initialTrending?: Set<string>;
}

export function PopularThemes({
  onThemeSelect,
  selectedTheme,
  onBrowseThemes,
  initialData,
  initialLikeCounts,
  initialTrending
}: PopularThemesProps) {
  const { t } = useTranslation();
  const [popularThemes, setPopularThemes] = useState<PopularTheme[]>(initialData || []);
  const [fallbackThemes, setFallbackThemes] = useState<PopularTheme[]>([]);
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>(initialLikeCounts || {});
  const [trendingSet, setTrendingSet] = useState<Set<string>>(initialTrending || new Set());
  const [loading, setLoading] = useState(!initialData);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Skip client-side fetch if server-side data was provided
    if (initialData) {
      return;
    }

    async function fetchPopularThemes() {
      try {
        const themes = await getPopularThemes(6); // Top 6 themes

        if (!themes || themes.length === 0) {
          // No play data yet - fetch most popular by combined score
          logger.log('[PopularThemes] No play data, fetching by combined popularity');
          const mostPopular = await getMostPopularThemes(6);
          setFallbackThemes(mostPopular);
          setHasError(true);
          return;
        }

        setPopularThemes(themes);

        // Fetch like counts and trending status
        const counts: Record<string, number> = {};
        await Promise.all(
          themes.map(async (item) => {
            counts[item.theme] = await getThemeLikeCount(item.theme);
          })
        );
        setLikeCounts(counts);

        // Fetch trending themes
        const trending = await getTrendingThemes();
        setTrendingSet(new Set(trending.map(t => t.theme)));
      } catch (error) {
        logger.error('[PopularThemes] Failed to fetch:', error);
        // On error, try to fetch most popular by combined score
        try {
          const mostPopular = await getMostPopularThemes(6);
          setFallbackThemes(mostPopular);
        } catch (fallbackError) {
          logger.error('[PopularThemes] Fallback also failed:', fallbackError);
        }
        setHasError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchPopularThemes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Don't render if still loading
  if (loading) {
    return null;
  }

  // Use fallback themes if no data or error
  const displayThemes = (hasError || popularThemes.length === 0) ? fallbackThemes : popularThemes;
  const showingFallback = hasError || popularThemes.length === 0;

  return (
    <Card variant="elevated">
      <CardHeader>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">{showingFallback ? '🎲' : '🔥'}</span>
            <h3 className="text-xl font-bold text-fg transition-colors">
              {showingFallback ? t.popularThemesToday.discoverThemes : t.popularThemesToday.title}
            </h3>
          </div>
          <p className="text-sm text-fg-muted">
            {showingFallback ? t.popularThemesToday.randomSelection : t.popularThemesToday.description}
          </p>
        </div>
      </CardHeader>
      <CardBody>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {displayThemes.map((item, index) => {
            const isSelected = selectedTheme === item.theme;
            const emoji = THEME_EMOJIS[item.theme] || '🎲';
            const label = THEME_LABELS[item.theme] || item.theme;
            const isTrending = trendingSet.has(item.theme);

            return (
              <motion.div
                key={item.theme}
                className={`relative p-3 rounded-lg border-2 transition-all ${
                  isSelected
                    ? 'border-primary bg-primary-subtle'
                    : 'border-border'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                {/* Ranking badge */}
                <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary text-primary-fg text-xs font-bold flex items-center justify-center">
                  {index + 1}
                </div>

                {/* Trending badge */}
                {isTrending && (
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-gradient-to-r from-orange-400 to-red-500 text-white text-[10px] font-bold flex items-center gap-1">
                    <span>⬆️</span>
                    <span>TRENDING</span>
                  </div>
                )}

                {/* Theme info */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{emoji}</span>
                  <div className="flex-1">
                    <div className="font-medium text-fg text-sm line-clamp-1">
                      {label}
                    </div>
                    {!showingFallback && (
                      <div className="flex gap-2 text-xs text-fg-muted">
                        <span>🔥 {item.count} {item.count === 1 ? t.popularThemesToday.play : t.popularThemesToday.plays}</span>
                        <span>❤️ {likeCounts[item.theme] || 0}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Play button */}
                <motion.button
                  onClick={() => onThemeSelect(item.theme)}
                  className="w-full py-1.5 px-3 rounded-md bg-primary text-primary-fg text-xs font-bold hover:bg-primary-hover transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {t.popularThemesToday.playNow}
                </motion.button>
              </motion.div>
            );
          })}
        </div>

        {onBrowseThemes && (
          <button
            onClick={onBrowseThemes}
            className="mt-3 w-full py-2 text-xs text-primary hover:text-primary-hover font-medium transition-colors"
          >
            {t.popularThemesToday.browseAll} →
          </button>
        )}
      </CardBody>
    </Card>
  );
}
