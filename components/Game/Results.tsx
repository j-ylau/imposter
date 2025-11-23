import { useState } from 'react';
import { Room, Theme } from '@/schema';
import { Button } from '@/components/UI/Button';
import { Card, CardBody, CardHeader } from '@/components/UI/Card';
import { useTranslation } from '@/lib/i18n';
import { THEME_LABELS, THEME_EMOJIS } from '@/data/themes';

interface ResultsProps {
  room: Room;
  mostVotedPlayerId: string;
  voteCounts: Record<string, number>;
  imposterWon: boolean;
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
  const mostVotedPlayer = room.players.find((p) => p.id === mostVotedPlayerId);
  const imposter = room.players.find((p) => p.id === room.imposterId);

  const themes: Theme[] = ['default', 'pokemon', 'nba', 'memes', 'movies', 'countries'];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Game Result */}
      <Card variant="elevated">
        <CardBody className="text-center py-8">
          <div className="text-6xl mb-4">
            {imposterWon ? '🕵️' : '🎉'}
          </div>
          <h2 className="text-3xl font-bold mb-2">
            {imposterWon ? (
              <span className="text-red-600">{t.results.imposterWins}</span>
            ) : (
              <span className="text-green-600">{t.results.playersWin}</span>
            )}
          </h2>
          <p className="text-xl text-gray-700 mb-4">
            {t.results.secretWord} <strong>{room.word}</strong>
          </p>
          <p className="text-lg text-gray-600">
            {t.results.imposterWas} <strong>{imposter?.name}</strong>
          </p>
        </CardBody>
      </Card>

      {/* Vote Results */}
      <Card variant="elevated">
        <CardHeader>
          <h3 className="text-xl font-bold text-gray-900">{t.results.voteResults}</h3>
        </CardHeader>
        <CardBody className="space-y-2">
          {room.players.map((player) => {
            const voteCount = voteCounts[player.id] || 0;
            const wasVotedOut = player.id === mostVotedPlayerId;
            const wasImposter = player.id === room.imposterId;

            return (
              <div
                key={player.id}
                className={`flex items-center justify-between px-4 py-3 rounded-lg ${
                  wasVotedOut
                    ? 'bg-red-100 border-2 border-red-300'
                    : 'bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">
                    {player.name}
                  </span>
                  {wasImposter && (
                    <span className="px-2 py-0.5 text-xs font-semibold text-red-700 bg-red-200 rounded">
                      {t.results.badges.imposter}
                    </span>
                  )}
                  {wasVotedOut && (
                    <span className="px-2 py-0.5 text-xs font-semibold text-gray-700 bg-gray-300 rounded">
                      {t.results.badges.votedOut}
                    </span>
                  )}
                </div>
                <span className="text-lg font-bold text-gray-700">
                  {voteCount} {voteCount === 1 ? t.results.voteCount.singular : t.results.voteCount.plural}
                </span>
              </div>
            );
          })}
        </CardBody>
      </Card>

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
              🎲 {t.results.restartRandom}
            </Button>
            <span className="text-sm font-medium text-gray-500 px-2">or</span>
            <Button
              onClick={() => setShowThemes(!showThemes)}
              variant="secondary"
              size="lg"
              className="flex-1"
            >
              {showThemes ? `✕ ${t.common.close}` : `🎨 ${t.results.chooseTheme}`}
            </Button>
          </div>

          {showThemes && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-3 border-t">
              {themes.map((theme) => (
                <button
                  key={theme}
                  onClick={() => onPlayAgainWithTheme(theme)}
                  className="p-3 rounded-lg border-2 border-gray-200 hover:border-primary-500 hover:bg-primary-50 transition-all text-left"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{THEME_EMOJIS[theme]}</span>
                    <span className="font-medium text-gray-900">
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
            🏠 {t.results.returnHome}
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}
