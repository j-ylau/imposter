'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/UI/Button';
import { Input } from '@/components/UI/Input';
import { Card, CardBody, CardHeader } from '@/components/UI/Card';
import { useRoom, roomApi } from '@/lib/realtime';
import { addPlayer, startGame } from '@/lib/game';
import { useTranslation } from '@/lib/i18n';
import { PageTransition } from '@/components/Animations/PageTransition';
import { toast } from 'react-toastify';
import { handleError, getErrorTranslationKey } from '@/lib/error';
import { MIN_PLAYERS_TO_START } from '@/lib/constants';

export default function SetupPage() {
  const router = useRouter();
  const params = useParams();
  const roomId = params?.roomId as string;
  const { t, format } = useTranslation();

  const { room, loading: roomLoading } = useRoom(roomId);
  const [playerName, setPlayerName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect to room page when game starts
  useEffect(() => {
    if (room && room.phase !== 'lobby') {
      router.push(`/room/${roomId}`);
    }
  }, [room, roomId, router]);

  const handleAddPlayer = async () => {
    if (!room) return;

    try {
      setError('');
      const updatedRoom = addPlayer(room, playerName);
      await roomApi.updateRoom(updatedRoom);
      setPlayerName('');
      toast.success(`${playerName} added!`);
    } catch (err) {
      const appError = handleError(err);
      const errorKey = getErrorTranslationKey(appError.code);

      // Use specific error messages for setup page if available
      if (appError.code === 'PLAYER_ALREADY_EXISTS') {
        toast.error(t.setup.errors.duplicateName);
      } else {
        toast.error(t.errors[errorKey]);
      }
    }
  };

  const handleStartGame = async () => {
    if (!room) return;

    setLoading(true);
    try {
      const updatedRoom = startGame(room);
      await roomApi.updateRoom(updatedRoom);
      // Room subscription will handle redirect when phase changes
    } catch (err) {
      const appError = handleError(err);
      const errorKey = getErrorTranslationKey(appError.code);
      toast.error(t.errors[errorKey]);
      setLoading(false);
    }
  };

  const handleRemovePlayer = async (playerId: string) => {
    if (!room) return;

    const updatedRoom = {
      ...room,
      players: room.players.filter((p) => p.id !== playerId),
    };
    await roomApi.updateRoom(updatedRoom);
  };

  if (roomLoading || !room) {
    return (
      <PageTransition>
        <div className="min-h-screen flex items-center justify-center p-4">
          <p className="text-fg-muted">{t.common.waiting}</p>
        </div>
      </PageTransition>
    );
  }

  const canStart = room.players.length >= MIN_PLAYERS_TO_START;

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-2xl w-full space-y-6">
          {/* Header */}
          <div className="text-center">
            <div className="text-6xl mb-4">📱</div>
            <h1 className="text-4xl md:text-5xl font-bold text-fg mb-2">
              {t.setup.title}
            </h1>
            <p className="text-fg-muted mb-3">
              {t.setup.subtitle}
            </p>
            <p className="text-sm text-fg-muted">
              {format(t.setup.playerCount, { count: room.players.length })}
            </p>
          </div>

          {/* Add Player */}
          <Card variant="elevated">
            <CardBody className="space-y-3">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder={t.setup.playerNamePlaceholder}
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddPlayer()}
                  error={error}
                  maxLength={20}
                  autoFocus
                  className="flex-1"
                />
                <Button
                  onClick={handleAddPlayer}
                  disabled={!playerName.trim()}
                  variant="primary"
                >
                  {t.common.add}
                </Button>
              </div>
            </CardBody>
          </Card>

          {/* Players List */}
          <Card variant="elevated">
            <CardHeader>
              <h2 className="text-xl font-bold text-fg">{t.setup.players}</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-2">
                {room.players.map((player) => (
                  <div
                    key={player.id}
                    className="flex items-center justify-between p-3 bg-bg-subtle rounded-lg"
                  >
                    <div>
                      <span className="font-medium text-fg">{player.name}</span>
                      {player.isHost && (
                        <span className="ml-2 text-xs px-2 py-0.5 bg-primary text-primary-fg rounded">
                          {t.common.host}
                        </span>
                      )}
                    </div>
                    {!player.isHost && (
                      <button
                        onClick={() => handleRemovePlayer(player.id)}
                        className="text-danger hover:text-danger-hover text-sm"
                      >
                        {t.common.remove}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Start Game Button */}
          <Card variant="elevated">
            <CardBody>
              {!canStart && (
                <p className="text-center text-fg-muted text-sm mb-3">
                  {format(t.setup.minPlayersWarning, { min: MIN_PLAYERS_TO_START })}
                </p>
              )}
              <Button
                onClick={handleStartGame}
                disabled={!canStart || loading}
                variant="primary"
                size="lg"
                className="w-full"
              >
                {t.setup.startGame}
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}
