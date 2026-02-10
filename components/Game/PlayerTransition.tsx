'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/UI/Button';
import { Card, CardBody } from '@/components/UI/Card';
import { useTranslation } from '@/lib/i18n';

interface PlayerTransitionProps {
  playerName: string;
  playerNumber?: number;
  totalPlayers?: number;
  onReady: () => void;
}

export function PlayerTransition({ playerName, playerNumber, totalPlayers, onReady }: PlayerTransitionProps) {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-bg">
      <Card variant="elevated" className="max-w-md w-full">
        <CardBody className="space-y-6 text-center">
          {/* Player Progress Indicator */}
          {playerNumber && totalPlayers && (
            <div className="flex justify-center gap-2 mb-2">
              {Array.from({ length: totalPlayers }, (_, i) => (
                <div
                  key={i}
                  className={`h-2 rounded-full transition-all ${
                    i < playerNumber
                      ? 'w-8 bg-primary'
                      : i === playerNumber - 1
                      ? 'w-12 bg-primary'
                      : 'w-8 bg-bg-subtle'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Player Number Badge */}
          {playerNumber && totalPlayers && (
            <div className="inline-block bg-primary text-primary-fg px-4 py-2 rounded-full font-bold text-sm">
              {playerNumber} of {totalPlayers}
            </div>
          )}

          {/* Warning Icon */}
          <motion.div
            className="text-8xl"
            animate={{
              scale: [1, 1.15, 1],
              rotate: [0, -5, 5, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            🔒
          </motion.div>

          {/* Instructions */}
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-danger">
              {t.playerTransition.dontPeek}
            </h2>
            <p className="text-xl text-fg">
              {t.playerTransition.passTo}
            </p>
            <motion.p
              className="text-4xl font-bold text-primary mt-4"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
            >
              {playerName}
            </motion.p>
          </motion.div>

          {/* Ready Button */}
          <div className="pt-6">
            <Button
              onClick={onReady}
              variant="primary"
              size="lg"
              className="w-full text-xl py-6"
            >
              {t.playerTransition.ready} {t.playerTransition.tapToReveal}
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
