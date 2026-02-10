'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface SuspenseRevealProps {
  children: ReactNode;
  /** Delay before reveal starts (seconds) */
  delay?: number;
  /** If true, uses the dramatic red imposter style */
  isImposter?: boolean;
}

/**
 * Wraps content in a dramatic reveal animation.
 * - Normal players: smooth scale-up with subtle glow
 * - Imposter: shake + red pulse effect
 */
export function SuspenseReveal({
  children,
  delay = 0.2,
  isImposter = false,
}: SuspenseRevealProps) {
  if (isImposter) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: 1,
          scale: [0.8, 1.05, 0.97, 1.02, 1],
        }}
        transition={{
          delay,
          duration: 0.8,
          ease: 'easeOut',
        }}
      >
        <motion.div
          animate={{
            boxShadow: [
              '0 0 0px rgba(239, 68, 68, 0)',
              '0 0 30px rgba(239, 68, 68, 0.4)',
              '0 0 10px rgba(239, 68, 68, 0.1)',
              '0 0 20px rgba(239, 68, 68, 0.3)',
              '0 0 0px rgba(239, 68, 68, 0)',
            ],
          }}
          transition={{
            duration: 2,
            repeat: 2,
            ease: 'easeInOut',
          }}
          className="rounded-lg"
        >
          {children}
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        delay,
        type: 'spring',
        stiffness: 200,
        damping: 15,
      }}
    >
      {children}
    </motion.div>
  );
}
