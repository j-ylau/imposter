'use client';

import { useState, useEffect } from 'react';
import { Theme } from '@/schema';
import { THEME_LABELS, THEME_EMOJIS } from '@/data/themes';
import { getPopularThemes, PopularTheme } from '@/lib/theme-stats';
import { Card, CardBody, CardHeader } from '@/components/UI/Card';
import { motion } from 'framer-motion';
import { logger } from '@/lib/logger';
import { useTranslation } from '@/lib/i18n';

interface PopularThemesProps {
  onThemeSelect: (theme: Theme) => void;
  selectedTheme?: Theme;
  onBrowseThemes?: () => void;
}

export function PopularThemes({ onThemeSelect, selectedTheme, onBrowseThemes }: PopularThemesProps) {
  const { t } = useTranslation();
  const [popularThemes, setPopularThemes] = useState<PopularTheme[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPopularThemes() {
      try {
        const themes = await getPopularThemes(6); // Top 6 themes
        setPopularThemes(themes);
      } catch (error) {
        logger.error('[PopularThemes] Failed to fetch:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPopularThemes();
  }, []);

  // Don't render if no data yet
  if (loading || popularThemes.length === 0) {
    return null;
  }

  return (
    <Card variant="elevated">
      <CardHeader>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">🔥</span>
            <h3 className="text-xl font-bold text-fg transition-colors">
              {t.popularThemesToday.title}
            </h3>
          </div>
          <p className="text-sm text-fg-muted">{t.popularThemesToday.description}</p>
        </div>
      </CardHeader>
      <CardBody>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {popularThemes.map((item, index) => {
            const isSelected = selectedTheme === item.theme;
            const emoji = THEME_EMOJIS[item.theme] || '🎲';
            const label = THEME_LABELS[item.theme] || item.theme;

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

                {/* Theme info */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{emoji}</span>
                  <div className="flex-1">
                    <div className="font-medium text-fg text-sm line-clamp-1">
                      {label}
                    </div>
                    <div className="text-xs text-fg-muted">
                      {item.count} {item.count === 1 ? t.popularThemesToday.play : t.popularThemesToday.plays}
                    </div>
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
