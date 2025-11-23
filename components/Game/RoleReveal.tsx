'use client';

import { useState } from 'react';
import { Room } from '@/schema';
import { Button } from '@/components/UI/Button';
import { Card, CardBody, CardHeader } from '@/components/UI/Card';
import { useTranslation } from '@/lib/i18n';
import { AdSense } from '@/components/Ads/AdSense';
import { PlayerTransition } from './PlayerTransition';
import { getCurrentPlayer } from '@/lib/game';

interface RoleRevealProps {
  room: Room;
  isImposter: boolean;
  word?: string;
  onContinue: () => void;
}

export function RoleReveal({ room, isImposter, word, onContinue }: RoleRevealProps) {
  const { t } = useTranslation();
  const [showTransition, setShowTransition] = useState(room.gameMode === 'pass-and-play');

  const isPassAndPlay = room.gameMode === 'pass-and-play';
  const currentPlayer = getCurrentPlayer(room);
  const buttonText = isPassAndPlay ? t.roleReveal.nextPlayer : t.roleReveal.continueButton;

  // Show transition screen in pass-and-play mode
  if (isPassAndPlay && showTransition && currentPlayer) {
    return (
      <PlayerTransition
        playerName={currentPlayer.name}
        onReady={() => setShowTransition(false)}
      />
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card variant="elevated">
        <CardHeader>
          <h2 className="text-2xl font-bold text-center text-fg transition-colors">
            {t.roleReveal.title}
          </h2>
        </CardHeader>
        <CardBody className="space-y-6">
          {isImposter ? (
            <>
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🕵️</div>
                <h3 className="text-3xl font-bold text-danger mb-2 transition-colors">
                  {t.roleReveal.imposter.title}
                </h3>
                <p className="text-fg-muted transition-colors">
                  {t.roleReveal.imposter.subtitle}
                </p>
              </div>
              <div className="bg-danger-subtle border-2 border-danger rounded-lg p-4 transition-colors">
                <h4 className="font-bold text-danger-fg mb-2 transition-colors">{t.common.yourGoal}</h4>
                <ul className="text-sm text-danger-fg space-y-1">
                  {t.roleReveal.imposter.goals.map((goal, index) => (
                    <li key={index}>• {goal}</li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <>
              <div className="text-center py-8">
                <div className="text-6xl mb-4">👥</div>
                <h3 className="text-3xl font-bold text-primary mb-2 transition-colors">
                  {t.roleReveal.player.title}
                </h3>
                <p className="text-fg-muted mb-4 transition-colors">
                  {t.roleReveal.player.subtitle}
                </p>
                <div className="text-5xl font-bold text-fg bg-primary-subtle border-4 border-primary rounded-lg py-6 px-8 inline-block transition-colors">
                  {word}
                </div>
              </div>
              <div className="bg-primary-subtle border-2 border-primary rounded-lg p-4 transition-colors">
                <h4 className="font-bold text-primary mb-2 transition-colors">{t.common.yourGoal}</h4>
                <ul className="text-sm text-primary space-y-1">
                  {t.roleReveal.player.goals.map((goal, index) => (
                    <li key={index}>• {goal}</li>
                  ))}
                </ul>
              </div>
            </>
          )}

          {/* Ad - In-between Rounds */}
          <AdSense
            slot="INTERSTITIAL_SLOT"
            format="auto"
            className="my-4"
          />

          <Button
            onClick={() => {
              if (isPassAndPlay) {
                setShowTransition(true);
              }
              onContinue();
            }}
            className="w-full"
            size="lg"
          >
            {buttonText}
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}
