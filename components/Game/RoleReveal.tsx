'use client';

import { useState, useEffect, useRef } from 'react';
import { Room } from '@/schema';
import { Button } from '@/components/UI/Button';
import { Card, CardBody, CardHeader } from '@/components/UI/Card';
import { useTranslation } from '@/lib/i18n';
import { AdSense } from '@/components/Ads/AdSense';
import { PlayerTransition } from './PlayerTransition';
import { SuspenseReveal } from '@/components/Animations/SuspenseReveal';
import { getCurrentPlayer } from '@/lib/game';

interface RoleRevealProps {
  room: Room;
  isImposter: boolean;
  word?: string;
  onContinue: () => void;
}

export function RoleReveal({ room, isImposter, word, onContinue }: RoleRevealProps) {
  const { t } = useTranslation();
  const [showTransition, setShowTransition] = useState(false);
  const prevPlayerIndexRef = useRef<number | undefined>(undefined);
  const isInitialMount = useRef(true);

  const isPassAndPlay = room.gameMode === 'pass-and-play';
  const currentPlayer = getCurrentPlayer(room);

  // Detect when currentPlayerIndex changes and show transition screen
  useEffect(() => {
    if (!isPassAndPlay || room.currentPlayerIndex === undefined) return;

    // On initial mount, just record the current index without showing transition
    if (isInitialMount.current) {
      prevPlayerIndexRef.current = room.currentPlayerIndex;
      isInitialMount.current = false;
      return;
    }

    // When player index changes, show transition screen
    if (prevPlayerIndexRef.current !== room.currentPlayerIndex) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowTransition(true);
      prevPlayerIndexRef.current = room.currentPlayerIndex;
    }
  }, [room.currentPlayerIndex, isPassAndPlay]);

  // Calculate player progress for pass-and-play
  const playerNumber = isPassAndPlay && room.currentPlayerIndex !== undefined
    ? room.currentPlayerIndex + 1
    : undefined;
  const totalPlayers = isPassAndPlay ? room.players.length : undefined;

  // Get next player name for button text
  const nextPlayerIndex = room.currentPlayerIndex !== undefined
    ? (room.currentPlayerIndex + 1) % room.players.length
    : undefined;
  const nextPlayerName = nextPlayerIndex !== undefined && room.players[nextPlayerIndex]
    ? room.players[nextPlayerIndex].name
    : undefined;

  // Dynamic button text
  const buttonText = isPassAndPlay && nextPlayerName
    ? `${t.roleReveal.passToNext} ${nextPlayerName}`
    : isPassAndPlay
    ? t.roleReveal.nextPlayer
    : t.roleReveal.continueButton;

  // Show transition screen in pass-and-play mode
  if (isPassAndPlay && showTransition && currentPlayer) {
    return (
      <PlayerTransition
        playerName={currentPlayer.name}
        playerNumber={playerNumber}
        totalPlayers={totalPlayers}
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
            <SuspenseReveal isImposter delay={0.3}>
              <div className="text-center py-8">
                <div className="text-7xl mb-4">🕵️</div>
                <h3 className="text-3xl font-bold text-danger mb-2 transition-colors">
                  {t.roleReveal.imposter.title}
                </h3>
                <p className="text-fg-muted transition-colors">
                  {t.roleReveal.imposter.subtitle}
                </p>
              </div>
              <div className="bg-danger-subtle border-2 border-danger rounded-lg p-4 transition-colors imposter-glow">
                <h4 className="font-bold text-danger-fg mb-2 transition-colors">{t.common.yourGoal}</h4>
                <ul className="text-sm text-danger-fg space-y-1">
                  {t.roleReveal.imposter.goals.map((goal, index) => (
                    <li key={index}>• {goal}</li>
                  ))}
                </ul>
              </div>
            </SuspenseReveal>
          ) : (
            <SuspenseReveal delay={0.2}>
              <div className="text-center py-8">
                <div className="text-7xl mb-4">👥</div>
                <h3 className="text-3xl font-bold text-primary mb-2 transition-colors">
                  {t.roleReveal.player.title}
                </h3>
                <p className="text-fg-muted mb-4 transition-colors">
                  {t.roleReveal.player.subtitle}
                </p>
                <div className="text-5xl font-bold text-fg bg-primary-subtle border-4 border-primary rounded-xl py-6 px-8 inline-block transition-colors shadow-lg">
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
            </SuspenseReveal>
          )}

          {/* Ad - In-between Rounds */}
          <AdSense
            slot="INTERSTITIAL_SLOT"
            format="auto"
            className="my-4"
          />

          <Button
            onClick={onContinue}
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
