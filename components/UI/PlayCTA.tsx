'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export function PlayCTA(): JSX.Element {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary shadow-lg border-2 border-primary-hover transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95"
      aria-label="Play Imposter"
    >
      <motion.span
        className="text-lg"
        animate={{
          rotate: [0, -10, 10, -10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 3,
        }}
      >
        🕵️
      </motion.span>
      <span className="text-sm font-bold text-primary-fg tracking-wide">
        IMPOSTER
      </span>
    </Link>
  );
}
