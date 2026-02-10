'use client';

import { useEffect, useState, memo } from 'react';
import { motion } from 'framer-motion';

// Imposter-themed emojis for the background
const EMOJIS = ['🕵️', '❓', '👀', '🔍', '🤫', '💬', '🎭', '🤔'];

interface FloatingItem {
  id: number;
  emoji: string;
  x: number; // % from left
  delay: number; // seconds
  duration: number; // seconds
  size: number; // rem
  startY: number; // starting position
}

function generateItems(count: number): FloatingItem[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    emoji: EMOJIS[i % EMOJIS.length],
    x: Math.random() * 100,
    delay: Math.random() * 8,
    duration: 12 + Math.random() * 10, // 12-22 seconds
    size: 1.2 + Math.random() * 1.2, // 1.2-2.4rem
    startY: Math.random() * 100,
  }));
}

function FloatingEmojisInner({ count = 12 }: { count?: number }) {
  const [items, setItems] = useState<FloatingItem[]>([]);

  useEffect(() => {
    setItems(generateItems(count));
  }, [count]);

  if (items.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {items.map((item) => (
        <motion.div
          key={item.id}
          className="absolute select-none opacity-[0.06]"
          style={{
            left: `${item.x}%`,
            top: `${item.startY}%`,
            fontSize: `${item.size}rem`,
          }}
          animate={{
            y: [0, -30, 10, -20, 0],
            x: [0, 15, -10, 5, 0],
            rotate: [0, 10, -10, 5, 0],
          }}
          transition={{
            duration: item.duration,
            delay: item.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {item.emoji}
        </motion.div>
      ))}
    </div>
  );
}

export const FloatingEmojis = memo(FloatingEmojisInner);
