'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export function PlayCTA(): JSX.Element {
  return (
    <Link href="/">
      <motion.button
        className="group relative px-4 py-2 rounded-full bg-gradient-to-r from-primary to-primary-hover shadow-lg border-2 border-primary transition-all duration-300 hover:shadow-xl"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Play Imposter"
      >
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
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
            PLAY IMPOSTER
          </span>
        </motion.div>

        {/* Animated shine effect */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20"
          animate={{
            x: ['-100%', '200%'],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatDelay: 2,
          }}
        />
      </motion.button>
    </Link>
  );
}
