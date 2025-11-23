'use client';

import { Button } from '@/components/UI/Button';
import { Card, CardBody } from '@/components/UI/Card';
import { useTranslation } from '@/lib/i18n';

interface PlayerTransitionProps {
  playerName: string;
  onReady: () => void;
}

export function PlayerTransition({ playerName, onReady }: PlayerTransitionProps) {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-bg-start to-bg-end">
      <Card variant="elevated" className="max-w-md w-full">
        <CardBody className="space-y-6 text-center">
          {/* Warning Icon */}
          <div className="text-8xl animate-pulse">🔒</div>

          {/* Instructions */}
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-danger">
              {t.playerTransition.dontPeek}
            </h2>
            <p className="text-xl text-fg">
              {t.playerTransition.passTo}
            </p>
            <p className="text-4xl font-bold text-primary mt-4">
              {playerName}
            </p>
          </div>

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
