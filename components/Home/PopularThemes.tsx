'use client';

import { useState, useEffect } from 'react';
import { Theme } from '@/schema';
import { THEME_LABELS, THEME_EMOJIS } from '@/data/themes';
import { getPopularThemes, PopularTheme } from '@/lib/theme-stats';
import { Card, CardBody, CardHeader } from '@/components/UI/Card';
import { motion } from 'framer-motion';
import { logger } from '@/lib/logger';

interface PopularThemesProps {
  onThemeSelect: (theme: Theme) => void;
  selectedTheme?: Theme;
}

export function PopularThemes({ onThemeSelect, selectedTheme }: PopularThemesProps) {
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
        <div className="flex items-center gap-2">
          <span className="text-2xl">🔥</span>
          <h3 className="text-xl font-bold text-fg transition-colors">
            Popular Themes Today
          </h3>
        </div>
      </CardHeader>
      <CardBody>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {popularThemes.map((item, index) => {
            const isSelected = selectedTheme === item.theme;
            const emoji = THEME_EMOJIS[item.theme] || '🎲';
            const label = THEME_LABELS[item.theme] || item.theme;

            return (
              <motion.button
                key={item.theme}
                onClick={() => onThemeSelect(item.theme)}
                className={`relative p-3 rounded-lg border-2 transition-all text-left ${
                  isSelected
                    ? 'border-primary bg-primary-subtle'
                    : 'border-border hover:border-primary hover:bg-bg-subtle'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                {/* Ranking badge */}
                <div className="absolute top-1 right-1 w-6 h-6 rounded-full bg-primary text-primary-fg text-xs font-bold flex items-center justify-center">
                  {index + 1}
                </div>

                {/* Theme info */}
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">{emoji}</span>
                  <span className="font-medium text-fg text-sm line-clamp-1">
                    {label}
                  </span>
                </div>

                {/* Usage count */}
                <div className="text-xs text-fg-muted">
                  {item.count} {item.count === 1 ? 'game' : 'games'} today
                </div>
              </motion.button>
            );
          })}
        </div>

        <p className="text-xs text-fg-subtle text-center mt-3 transition-colors">
          Join the trend! These are the most played themes today.
        </p>
      </CardBody>
    </Card>
  );
}
