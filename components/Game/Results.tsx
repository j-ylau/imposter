'use client';

import { useState, useMemo, useEffect } from 'react';
import { Room, Theme, GameMode } from '@/schema';
import { Button } from '@/components/UI/Button';
import { Card, CardBody, CardHeader } from '@/components/UI/Card';
import { useTranslation } from '@/lib/i18n';
import { THEME_LABELS, THEME_EMOJIS } from '@/data/themes';
import { AdSense } from '@/components/Ads/AdSense';
import { SITE_URL } from '@/lib/constants';
import confetti from 'canvas-confetti';
import { toast } from 'react-toastify';

// Session streak tracking
function getSessionStreak(): number {
  if (typeof window === 'undefined') return 1;
  const raw = sessionStorage.getItem('imposter_round_count');
  return raw ? parseInt(raw, 10) : 0;
}

function incrementStreak(): number {
  if (typeof window === 'undefined') return 1;
  const next = getSessionStreak() + 1;
  sessionStorage.setItem('imposter_round_count', String(next));
  return next;
}

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
  const [roundNumber] = useState(() => incrementStreak());
  const isPassAndPlay = room.gameMode === GameMode.PassAndPlay;
  const imposter = room.players.find((p) => p.id === room.imposterId);

  // Use all available themes (not a hardcoded subset)
  const themes = (Object.keys(THEME_LABELS) as Theme[]).filter(t => t !== room.theme);

  // Build share text
  const shareText = useMemo(() => {
    const imposterName = imposter?.name || 'unknown';
    const outcome = imposterWon ? 'The imposter won!' : 'We caught the imposter!';
    return `${outcome} The word was "${room.word}" and ${imposterName} was the imposter. 🕵️\n\nPlay Imposter Word Game free: ${SITE_URL}`;
  }, [room, imposter, imposterWon]);

  const handleShare = async () => {
    // Try native Web Share API first (works great on mobile)
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'Imposter Word Game',
          text: shareText,
          url: SITE_URL,
        });
        return;
      } catch {
        // User cancelled or API unavailable — fall through to clipboard
      }
    }
    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(shareText);
      toast.success('Copied to clipboard! Share it with friends.');
    } catch {
      toast.error('Could not copy. Try sharing manually!');
    }
  };

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
      {/* Round counter badge */}
      {roundNumber > 1 && (
        <div className="text-center">
          <span className="inline-block px-4 py-1.5 bg-primary-subtle text-primary rounded-full text-sm font-bold">
            Round {roundNumber}
          </span>
        </div>
      )}

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

          {/* Share button - inline under the result */}
          <button
            onClick={handleShare}
            className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-bg-subtle hover:bg-primary-subtle text-fg-muted hover:text-primary rounded-full text-sm font-semibold transition-all border border-border hover:border-primary"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
            Share Result
          </button>
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

      {/* Streak encouragement */}
      {roundNumber >= 3 && (
        <div className="text-center text-sm text-fg-muted">
          You&apos;re on a roll — {roundNumber} rounds this session!
        </div>
      )}

      {/* Ad - Bottom (Auto Ads will fill this area) */}
      <AdSense slot="RESULTS_BOTTOM" format="horizontal" className="mt-6" />
    </div>
  );
}
