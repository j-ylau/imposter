'use client';

import { useTheme } from 'next-themes';
import { useSyncExternalStore } from 'react';
import { motion } from 'framer-motion';

function subscribe() {
  return () => {};
}

function getSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}

export function ThemeToggle(): JSX.Element {
  const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const { theme, setTheme } = useTheme();

  if (!mounted) {
    return (
      <div className="w-14 h-7 rounded-full bg-bg-subtle" />
    );
  }

  const isDark = theme === 'dark';

  return (
    <motion.button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="relative w-14 h-7 rounded-full bg-bg-subtle p-1 transition-colors duration-300 shadow-inner border border-border"
      whileTap={{ scale: 0.95 }}
      aria-label="Toggle theme"
    >
      <motion.div
        className="w-5 h-5 rounded-full bg-card shadow-md flex items-center justify-center border border-border"
        animate={{
          x: isDark ? 24 : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 30,
        }}
      >
        <span className="text-xs">
          {isDark ? '🌙' : '☀️'}
        </span>
      </motion.div>
    </motion.button>
  );
}
