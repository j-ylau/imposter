'use client';

import { useState, useEffect } from 'react';
import { Theme } from '@/schema';
import { THEME_LABELS, THEME_EMOJIS } from '@/data/themes';
import { getMostLovedThemes, LovedTheme } from '@/lib/theme-likes';
import { Card, CardBody, CardHeader } from '@/components/UI/Card';
import { motion } from 'framer-motion';
import { logger } from '@/lib/logger';

interface MostLovedThemesProps {
  onThemeSelect: (theme: Theme) => void;
  selectedTheme?: Theme;
}

export function MostLovedThemes({ onThemeSelect, selectedTheme }: MostLovedThemesProps) {
  const [lovedThemes, setLovedThemes] = useState<LovedTheme[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLovedThemes() {
      try {
        const themes = await getMostLovedThemes(5); // Top 5 most loved
        setLovedThemes(themes);
      } catch (error) {
        logger.error('[MostLovedThemes] Failed to fetch:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchLovedThemes();
  }, []);

  // Don't render if no data yet
  if (loading || lovedThemes.length === 0) {
    return null;
  }

  return (
    <Card variant="elevated">
      <CardHeader>
        <div className="flex items-center gap-2">
          <span className="text-2xl">❤️</span>
          <h3 className="text-xl font-bold text-fg transition-colors">
            Most Loved Themes
          </h3>
        </div>
      </CardHeader>
      <CardBody>
        <div className="space-y-2">
          {lovedThemes.map((item, index) => {
            const isSelected = selectedTheme === item.theme;
            const emoji = THEME_EMOJIS[item.theme] || '🎲';
            const label = THEME_LABELS[item.theme] || item.theme;

            // Medal emojis for top 3
            const medals = ['🥇', '🥈', '🥉'];
            const medal = index < 3 ? medals[index] : `${index + 1}.`;

            return (
              <motion.button
                key={item.theme}
                onClick={() => onThemeSelect(item.theme)}
                className={`w-full p-3 rounded-lg border-2 transition-all text-left flex items-center gap-3 ${
                  isSelected
                    ? 'border-primary bg-primary-subtle'
                    : 'border-border hover:border-primary hover:bg-bg-subtle'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                {/* Ranking */}
                <div className="text-lg font-bold w-8 text-center">
                  {medal}
                </div>

                {/* Theme emoji */}
                <span className="text-2xl">{emoji}</span>

                {/* Theme info */}
                <div className="flex-1">
                  <span className="font-medium text-fg block">
                    {label}
                  </span>
                  <span className="text-xs text-fg-muted">
                    {item.count.toLocaleString()} {item.count === 1 ? 'like' : 'likes'}
                  </span>
                </div>

                {/* Heart */}
                <div className="text-xl">❤️</div>
              </motion.button>
            );
          })}
        </div>

        <p className="text-xs text-fg-subtle text-center mt-3 transition-colors">
          Community favorites! Like your favorite themes below.
        </p>
      </CardBody>
    </Card>
  );
}
