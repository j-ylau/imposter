'use client';

import { useState, useEffect, useMemo } from 'react';
import { Theme } from '@/schema';
import { THEME_LABELS, THEME_EMOJIS } from '@/data/themes';
import { getMostLovedThemes, LovedTheme } from '@/lib/theme-likes';
import { Card, CardBody, CardHeader } from '@/components/UI/Card';
import { motion } from 'framer-motion';
import { logger } from '@/lib/logger';
import { useTranslation } from '@/lib/i18n';

interface MostLovedThemesProps {
  onThemeSelect: (theme: Theme) => void;
  selectedTheme?: Theme;
  onBrowseThemes?: () => void;
  // Server-side preload support
  initialData?: LovedTheme[];
}

export function MostLovedThemes({
  onThemeSelect,
  selectedTheme,
  onBrowseThemes,
  initialData
}: MostLovedThemesProps) {
  const { t } = useTranslation();
  const [lovedThemes, setLovedThemes] = useState<LovedTheme[]>(initialData || []);
  const [loading, setLoading] = useState(!initialData);
  const [hasError, setHasError] = useState(false);

  // Generate random fallback themes when no data is available
  const fallbackThemes = useMemo(() => {
    const allThemes = Object.keys(THEME_LABELS) as Theme[];
    const shuffled = [...allThemes].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 5).map((theme) => ({
      theme,
      count: 0,
    }));
  }, []);

  useEffect(() => {
    // Skip client-side fetch if server-side data was provided
    if (initialData) {
      return;
    }

    async function fetchLovedThemes() {
      try {
        const themes = await getMostLovedThemes(5); // Top 5 most loved

        if (!themes || themes.length === 0) {
          setHasError(true);
          return;
        }

        setLovedThemes(themes);
      } catch (error) {
        logger.error('[MostLovedThemes] Failed to fetch:', error);
        setHasError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchLovedThemes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Don't render if still loading
  if (loading) {
    return null;
  }

  // Use fallback themes if no data or error
  const displayThemes = (hasError || lovedThemes.length === 0) ? fallbackThemes : lovedThemes;
  const showingFallback = hasError || lovedThemes.length === 0;

  return (
    <Card variant="elevated">
      <CardHeader>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">{showingFallback ? '🎲' : '❤️'}</span>
            <h3 className="text-xl font-bold text-fg transition-colors">
              {showingFallback ? t.mostLovedThemes.discoverThemes : t.mostLovedThemes.title}
            </h3>
          </div>
          <p className="text-sm text-fg-muted">
            {showingFallback ? t.mostLovedThemes.randomSelection : t.mostLovedThemes.description}
          </p>
        </div>
      </CardHeader>
      <CardBody>
        <div className="space-y-2">
          {displayThemes.map((item, index) => {
            const isSelected = selectedTheme === item.theme;
            const emoji = THEME_EMOJIS[item.theme] || '🎲';
            const label = THEME_LABELS[item.theme] || item.theme;

            // Medal emojis and gradients for top 3
            const medals = ['🥇', '🥈', '🥉'];
            const gradients = [
              'from-yellow-200/20 to-yellow-400/20', // Gold
              'from-gray-200/20 to-gray-400/20',     // Silver
              'from-orange-200/20 to-orange-400/20', // Bronze
            ];
            const medal = index < 3 ? medals[index] : `${index + 1}.`;
            const gradient = index < 3 ? gradients[index] : '';

            return (
              <motion.div
                key={item.theme}
                className={`p-3 rounded-lg border-2 transition-all ${
                  isSelected
                    ? 'border-primary bg-primary-subtle'
                    : 'border-border'
                } ${gradient ? `bg-gradient-to-r ${gradient}` : ''}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="flex items-center gap-3 mb-2">
                  {/* Ranking */}
                  <div className="text-lg font-bold w-8 text-center">
                    {medal}
                  </div>

                  {/* Theme emoji */}
                  <span className="text-2xl">{emoji}</span>

                  {/* Theme info */}
                  <div className="flex-1">
                    <div className="font-medium text-fg">
                      {label}
                    </div>
                    {!showingFallback && (
                      <div className="text-xs text-fg-muted">
                        {item.count.toLocaleString()} {item.count === 1 ? t.mostLovedThemes.like : t.mostLovedThemes.likes}
                      </div>
                    )}
                  </div>

                  {/* Heart */}
                  <div className="text-xl">❤️</div>
                </div>

                {/* Play button */}
                <motion.button
                  onClick={() => onThemeSelect(item.theme)}
                  className="w-full py-1.5 px-3 rounded-md bg-primary text-primary-fg text-xs font-bold hover:bg-primary-hover transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {t.mostLovedThemes.playNow}
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
            {t.mostLovedThemes.browseAll} →
          </button>
        )}
      </CardBody>
    </Card>
  );
}
