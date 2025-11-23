'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/UI/Button';
import { Input } from '@/components/UI/Input';
import { Card, CardBody, CardHeader } from '@/components/UI/Card';
import { roomApi } from '@/lib/realtime';
import { addPlayer } from '@/lib/game';
import { isValidPlayerName, generatePlayerId } from '@/lib/util';
import { useTranslation } from '@/lib/i18n';

export default function QuickJoinPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useTranslation();
  const roomId = (params.roomId as string).toUpperCase();

  const [playerName, setPlayerName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [roomExists, setRoomExists] = useState<boolean | null>(null);

  // Check if room exists
  useEffect(() => {
    const checkRoom = async () => {
      const room = await roomApi.getRoom(roomId);
      setRoomExists(!!room);
      if (!room) {
        setError(t.join.errors.roomNotFound);
      } else if (room.phase !== 'lobby') {
        setError(t.join.errors.gameInProgress);
      }
    };
    checkRoom();
  }, [roomId, t]);

  const handleJoin = async () => {
    const trimmedName = playerName.trim();

    if (!trimmedName) {
      // Generate random name if empty
      const randomNames = ['Player', 'Gamer', 'Pro', 'Legend', 'Star', 'Ace', 'Hero'];
      const randomName = `${randomNames[Math.floor(Math.random() * randomNames.length)]}${Math.floor(Math.random() * 1000)}`;
      setPlayerName(randomName);
      await joinRoom(randomName);
      return;
    }

    if (!isValidPlayerName(trimmedName)) {
      setError(t.join.errors.invalidName);
      return;
    }

    await joinRoom(trimmedName);
  };

  const joinRoom = async (name: string) => {
    setLoading(true);
    setError('');

    try {
      const room = await roomApi.getRoom(roomId);

      if (!room) {
        setError(t.join.errors.roomNotFound);
        setLoading(false);
        return;
      }

      if (room.phase !== 'lobby') {
        setError(t.join.errors.gameInProgress);
        setLoading(false);
        return;
      }

      const updatedRoom = addPlayer(room, name);
      await roomApi.updateRoom(updatedRoom);

      const newPlayer = updatedRoom.players[updatedRoom.players.length - 1];

      localStorage.setItem('currentPlayerId', newPlayer.id);
      localStorage.setItem('currentPlayerName', name);

      router.push(`/room/${roomId}`);
    } catch (err) {
      setError(t.join.errors.joinFailed);
      setLoading(false);
    }
  };

  if (roomExists === false) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card variant="elevated" className="max-w-md w-full">
          <CardBody className="text-center py-8">
            <div className="text-6xl mb-4">😕</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {t.join.notFound.title}
            </h1>
            <p className="text-gray-600 mb-6">
              {t.join.notFound.message}
            </p>
            <Button onClick={() => router.push('/')} className="w-full">
              {t.join.notFound.createNew}
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <div className="text-6xl mb-4">🎮</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {t.join.title}
          </h1>
          <p className="text-gray-600">{t.join.subtitle}</p>
        </div>

        <Card variant="elevated">
          <CardBody className="space-y-4">
            <Input
              type="text"
              placeholder={t.join.namePlaceholder}
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
              maxLength={20}
              autoFocus
            />
            {error && <p className="text-sm text-red-600">{error}</p>}

            <Button
              onClick={handleJoin}
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {loading ? t.join.joining : t.join.joinButton}
            </Button>
          </CardBody>
        </Card>

        <p className="text-center text-sm text-gray-500">
          {t.common.roomCode} <span className="font-mono font-bold">{roomId}</span>
        </p>
      </div>
    </div>
  );
}
