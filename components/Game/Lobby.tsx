'use client';

import { useState } from 'react';
import { Room } from '@/schema';
import { Button } from '@/components/UI/Button';
import { Card, CardBody, CardHeader } from '@/components/UI/Card';
import { THEME_LABELS, THEME_EMOJIS } from '@/data/themes';
import { useTranslation } from '@/lib/i18n';
import { AdSense } from '@/components/Ads/AdSense';
import { logger } from '@/lib/logger';
import { toast } from 'react-toastify';

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

  const handleCopyCode = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(room.id);
      // Haptic feedback
      if ('vibrate' in navigator) {
        navigator.vibrate(10);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success(t.lobby.success.codeCopiedToast);
    } catch (err) {
      logger.error('Failed to copy:', err);
      toast.error(t.lobby.errors.copyFailed);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Share Section - Most Important */}
      <Card variant="elevated" className="border-4 border-primary">
        <CardBody className="text-center space-y-4 py-6">
          <div className="text-4xl mb-2">🎮</div>
          <h2 className="text-2xl font-bold text-fg transition-colors">
            {t.lobby.inviteFriends}
          </h2>

          {/* Instructions */}
          <div className="bg-bg-subtle border-2 border-border rounded-lg p-4 text-left transition-colors">
            <p className="text-sm text-fg mb-3">
              {t.lobby.tellFriends}
            </p>
            <ol className="text-sm text-fg space-y-2 ml-4 list-decimal">
              <li>
                {t.lobby.step1} <span className="font-mono font-bold bg-primary-subtle px-2 py-0.5 rounded text-primary">{joinUrl}</span>
              </li>
              <li>
                {t.lobby.step2}
              </li>
            </ol>
          </div>

          {/* Room Code - Prominent */}
          <div className="bg-primary-subtle border-2 border-primary rounded-lg p-4 transition-colors">
            <p className="text-sm text-fg-muted mb-1">{t.common.roomCode}</p>
            <p className="text-3xl font-bold font-mono text-primary tracking-wider">
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

          {/* Room Expiration Notice */}
          {room.expiresAt && (
            <p className="text-xs text-fg-subtle mt-2 transition-colors">
              Room expires in {Math.max(0, Math.round((room.expiresAt - Date.now()) / 60000))} minutes
            </p>
          )}
        </CardBody>
      </Card>

      {/* Theme */}
      <div className="relative">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary via-primary-hover to-primary rounded-lg opacity-75 blur animate-pulse"></div>
        <Card variant="elevated" className="relative">
          <CardBody className="text-center py-4">
            <p className="text-2xl mb-1">{THEME_EMOJIS[room.theme]}</p>
            <p className="text-lg font-bold text-fg transition-colors">
              {THEME_LABELS[room.theme]}
            </p>
          </CardBody>
        </Card>
      </div>

      {/* Players List */}
      <Card variant="elevated">
        <CardHeader>
          <h3 className="text-xl font-bold text-fg transition-colors">
            {t.lobby.players} ({room.players.length})
          </h3>
        </CardHeader>
        <CardBody>
          <div className="space-y-2">
            {room.players.map((player) => (
              <div
                key={player.id}
                className="flex items-center justify-between px-4 py-3 bg-bg-subtle rounded-lg transition-colors"
              >
                <span className="font-medium text-fg">
                  {player.name}
                </span>
                {player.isHost && (
                  <span className="px-2 py-1 text-xs font-semibold text-host-badge-fg bg-host-badge rounded transition-colors">
                    {t.common.host}
                  </span>
                )}
              </div>
            ))}
          </div>

          {room.players.length < 3 && (
            <p className="text-center text-sm text-fg-muted mt-4 transition-colors">
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
            <p className="text-center text-fg-muted transition-colors">
              {t.lobby.waitingForHost}
            </p>
          </CardBody>
        </Card>
      )}

      {/* Ad - Bottom Banner */}
      <AdSense
        slot="LOBBY_BOTTOM_SLOT"
        format="horizontal"
        className="mt-6"
      />
    </div>
  );
}
