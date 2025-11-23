'use client';

import { useState, useEffect } from 'react';
import { Room, Theme, GameMode } from '@/schema';
import { Button } from '@/components/UI/Button';
import { Card, CardBody, CardHeader } from '@/components/UI/Card';
import { useTranslation } from '@/lib/i18n';
import { THEME_LABELS, THEME_EMOJIS } from '@/data/themes';
import { AdSense } from '@/components/Ads/AdSense';
import confetti from 'canvas-confetti';

interface ResultsProps {
  room: Room;
  mostVotedPlayerId?: string; // Optional for pass-and-play
  voteCounts?: Record<string, number>; // Optional for pass-and-play
  imposterWon?: boolean; // Optional for pass-and-play
  onPlayAgain: () => void;
  onPlayAgainWithTheme: (theme: Theme) => void;
  onGoHome: () => void;
}

export function Results({
  room,
  mostVotedPlayerId,
  voteCounts,
  imposterWon,
  onPlayAgain,
  onPlayAgainWithTheme,
  onGoHome,
}: ResultsProps) {
  const { t } = useTranslation();
  const [showThemes, setShowThemes] = useState(false);
  const isPassAndPlay = room.gameMode === GameMode.PassAndPlay;
  const mostVotedPlayer = mostVotedPlayerId ? room.players.find((p) => p.id === mostVotedPlayerId) : null;
  const imposter = room.players.find((p) => p.id === room.imposterId);

  const themes: Theme[] = ['default', 'pokemon', 'nba', 'memes', 'movies', 'countries'];

  useEffect(() => {
    // Trigger confetti celebration on mount
    const triggerConfetti = (): void => {
      if (imposterWon) {
        // Imposter victory - dramatic red/orange confetti
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#ef4444', '#f97316', '#dc2626', '#ea580c'],
        });
      } else {
        // Players victory - colorful celebration
        const count = 200;
        const defaults = {
          origin: { y: 0.7 },
        };

        function fire(particleRatio: number, opts: confetti.Options): void {
          confetti({
            ...defaults,
            ...opts,
            particleCount: Math.floor(count * particleRatio),
          });
        }

        fire(0.25, {
          spread: 26,
          startVelocity: 55,
        });

        fire(0.2, {
          spread: 60,
        });

        fire(0.35, {
          spread: 100,
          decay: 0.91,
          scalar: 0.8,
        });

        fire(0.1, {
          spread: 120,
          startVelocity: 25,
          decay: 0.92,
          scalar: 1.2,
        });

        fire(0.1, {
          spread: 120,
          startVelocity: 45,
        });
      }
    };

    // Trigger after a short delay to allow the page to render
    const timer = setTimeout(triggerConfetti, 500);
    return () => clearTimeout(timer);
  }, [imposterWon]);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Ad - Top Banner */}
      <AdSense
        slot="RESULTS_TOP_SLOT"
        format="horizontal"
        className="mb-4"
      />

      {/* Game Result */}
      <Card variant="elevated">
        <CardBody className="text-center py-8">
          <div className="text-6xl mb-4">
            {isPassAndPlay ? '🎉' : imposterWon ? '🕵️' : '🎉'}
          </div>
          {!isPassAndPlay && (
            <h2 className="text-3xl font-bold mb-2">
              {imposterWon ? (
                <span className="text-danger transition-colors">{t.results.imposterWins}</span>
              ) : (
                <span className="text-success transition-colors">{t.results.playersWin}</span>
              )}
            </h2>
          )}
          {isPassAndPlay && (
            <h2 className="text-3xl font-bold mb-2 text-fg transition-colors">
              {t.results.gameOver}
            </h2>
          )}
          <p className="text-xl text-fg mb-4 transition-colors">
            {t.results.secretWord} <strong>{room.word}</strong>
          </p>
          <p className="text-lg text-fg-muted transition-colors">
            {t.results.imposterWas} <strong>{imposter?.name}</strong>
          </p>
        </CardBody>
      </Card>

      {/* Vote Results - Only for online mode */}
      {!isPassAndPlay && voteCounts && (
        <Card variant="elevated">
        <CardHeader>
          <h3 className="text-xl font-bold text-fg transition-colors">{t.results.voteResults}</h3>
        </CardHeader>
        <CardBody className="space-y-2">
          {room.players.map((player) => {
            const voteCount = voteCounts[player.id] || 0;
            const wasVotedOut = player.id === mostVotedPlayerId;
            const wasImposter = player.id === room.imposterId;

            return (
              <div
                key={player.id}
                className={`flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                  wasVotedOut
                    ? 'bg-danger-subtle border-2 border-danger'
                    : 'bg-bg-subtle'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium text-fg">
                    {player.name}
                  </span>
                  {wasImposter && (
                    <span className="px-2 py-0.5 text-xs font-semibold text-imposter-badge-fg bg-imposter-badge rounded transition-colors">
                      {t.results.badges.imposter}
                    </span>
                  )}
                  {wasVotedOut && (
                    <span className="px-2 py-0.5 text-xs font-semibold text-fg-muted bg-bg-subtle border border-border rounded transition-colors">
                      {t.results.badges.votedOut}
                    </span>
                  )}
                </div>
                <span className="text-lg font-bold text-fg transition-colors">
                  {voteCount} {voteCount === 1 ? t.results.voteCount.singular : t.results.voteCount.plural}
                </span>
              </div>
            );
          })}
        </CardBody>
      </Card>
      )}

      {/* Restart Options */}
      <Card variant="elevated">
        <CardBody className="space-y-3">
          <div className="flex items-center gap-3">
            <Button
              onClick={onPlayAgain}
              variant="primary"
              size="lg"
              className="flex-1"
            >
              🎲{' '}
              {isPassAndPlay
                ? t.results.cta.passAndPlay.playAgain
                : t.results.cta.online.playAgain}
            </Button>
            <span className="text-sm font-medium text-fg-subtle px-2">or</span>
            <Button
              onClick={() => setShowThemes(!showThemes)}
              variant="secondary"
              size="lg"
              className="flex-1"
            >
              {showThemes
                ? `✕ ${t.common.close}`
                : `🎨 ${
                    isPassAndPlay
                      ? t.results.cta.passAndPlay.chooseTheme
                      : t.results.cta.online.chooseTheme
                  }`}
            </Button>
          </div>

          {showThemes && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-3 border-t border-border">
              {themes.map((theme) => (
                <button
                  key={theme}
                  onClick={() => onPlayAgainWithTheme(theme)}
                  className="p-3 rounded-lg border-2 border-border hover:border-primary hover:bg-primary-subtle transition-all text-left"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{THEME_EMOJIS[theme]}</span>
                    <span className="font-medium text-fg">
                      {THEME_LABELS[theme]}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}

          <Button
            onClick={onGoHome}
            variant="ghost"
            size="lg"
            className="w-full"
          >
            🏠{' '}
            {isPassAndPlay
              ? t.results.cta.passAndPlay.returnHome
              : t.results.cta.online.returnHome}
          </Button>
        </CardBody>
      </Card>

      {/* Ad - Bottom Banner */}
      <AdSense
        slot="RESULTS_BOTTOM_SLOT"
        format="horizontal"
        className="mt-6"
      />
    </div>
  );
}
