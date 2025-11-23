'use client';

import { useState } from 'react';
import { Room } from '@/schema';
import { Button } from '@/components/UI/Button';
import { Card, CardBody, CardHeader } from '@/components/UI/Card';
import { THEME_LABELS, THEME_EMOJIS } from '@/data/themes';
import { useTranslation } from '@/lib/i18n';

interface LobbyProps {
  room: Room;
  currentPlayerId: string;
  onStartGame: () => void;
}

export function Lobby({ room, currentPlayerId, onStartGame }: LobbyProps) {
  const { t, format } = useTranslation();
  const isHost = room.hostId === currentPlayerId;
  const canStart = room.players.length >= 3;
  const [copied, setCopied] = useState(false);

  const joinUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/join`
    : '';

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(room.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Share Section - Most Important */}
      <Card variant="elevated" className="border-4 border-primary-500">
        <CardBody className="text-center space-y-4 py-6">
          <div className="text-4xl mb-2">🎮</div>
          <h2 className="text-2xl font-bold text-gray-900">
            {t.lobby.inviteFriends}
          </h2>

          {/* Instructions */}
          <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4 text-left">
            <p className="text-sm text-gray-700 mb-3">
              {t.lobby.tellFriends}
            </p>
            <ol className="text-sm text-gray-800 space-y-2 ml-4 list-decimal">
              <li>
                {t.lobby.step1} <span className="font-mono font-bold bg-primary-100 px-2 py-0.5 rounded text-primary-700">{joinUrl}</span>
              </li>
              <li>
                {t.lobby.step2}
              </li>
            </ol>
          </div>

          {/* Room Code - Prominent */}
          <div className="bg-primary-50 border-2 border-primary-200 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">{t.common.roomCode}</p>
            <p className="text-3xl font-bold font-mono text-primary-600 tracking-wider">
              {room.id}
            </p>
          </div>

          {/* Copy Code Button */}
          <Button
            onClick={handleCopyCode}
            size="lg"
            className="w-full"
          >
            {copied ? `✓ ${t.lobby.codeCopied}` : `📋 ${t.lobby.copyCode}`}
          </Button>
        </CardBody>
      </Card>

      {/* Theme */}
      <div className="relative">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-400 via-primary-600 to-primary-400 rounded-lg opacity-75 blur animate-pulse"></div>
        <Card variant="elevated" className="relative">
          <CardBody className="text-center py-4">
            <p className="text-2xl mb-1">{THEME_EMOJIS[room.theme]}</p>
            <p className="text-lg font-bold text-gray-800">
              {THEME_LABELS[room.theme]}
            </p>
          </CardBody>
        </Card>
      </div>

      {/* Players List */}
      <Card variant="elevated">
        <CardHeader>
          <h3 className="text-xl font-bold text-gray-900">
            {t.lobby.players} ({room.players.length})
          </h3>
        </CardHeader>
        <CardBody>
          <div className="space-y-2">
            {room.players.map((player) => (
              <div
                key={player.id}
                className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg"
              >
                <span className="font-medium text-gray-900">
                  {player.name}
                </span>
                {player.isHost && (
                  <span className="px-2 py-1 text-xs font-semibold text-primary-700 bg-primary-100 rounded">
                    {t.common.host}
                  </span>
                )}
              </div>
            ))}
          </div>

          {room.players.length < 3 && (
            <p className="text-center text-sm text-gray-600 mt-4">
              {format(t.lobby.waitingForPlayers, { count: 3 - room.players.length, plural: 3 - room.players.length > 1 ? 's' : '' })}
            </p>
          )}
        </CardBody>
      </Card>

      {/* Start Game Button */}
      {isHost && (
        <Card variant="elevated">
          <CardBody>
            <Button
              onClick={onStartGame}
              disabled={!canStart}
              className="w-full"
              size="lg"
            >
              {canStart ? t.lobby.startGame : format(t.lobby.needMorePlayers, { count: 3 - room.players.length })}
            </Button>
          </CardBody>
        </Card>
      )}

      {!isHost && (
        <Card variant="bordered">
          <CardBody>
            <p className="text-center text-gray-600">
              {t.lobby.waitingForHost}
            </p>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
