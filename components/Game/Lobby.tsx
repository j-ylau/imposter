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

  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/join/${room.id}`
    : '';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: t.home.title,
          text: t.lobby.shareMessage,
          url: shareUrl,
        });
      } catch (err) {
        console.error('Share failed:', err);
      }
    }
  };

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
    `${t.lobby.shareMessage} ${shareUrl}`
  )}`;

  const smsUrl = `sms:?&body=${encodeURIComponent(
    `${t.lobby.shareMessage} ${shareUrl}`
  )}`;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Share Section - Most Important */}
      <Card variant="elevated" className="border-4 border-primary-500">
        <CardBody className="text-center space-y-4 py-6">
          <div className="text-4xl mb-2">🎮</div>
          <h2 className="text-2xl font-bold text-gray-900">
            {t.lobby.shareTitle}
          </h2>

          {/* Room Code - Prominent */}
          <div className="bg-primary-50 border-2 border-primary-200 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">{t.common.roomCode}</p>
            <p className="text-3xl font-bold font-mono text-primary-600 tracking-wider">
              {room.id}
            </p>
          </div>

          {/* Divider with OR */}
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-sm text-gray-500 font-medium">or</span>
            </div>
          </div>

          {/* Share Link Display */}
          <div className="bg-gray-100 rounded-lg p-3 font-mono text-sm break-all">
            {shareUrl}
          </div>

          {/* Share Buttons */}
          <div className="grid grid-cols-1 gap-3">
            <Button
              onClick={handleCopyLink}
              size="lg"
              className="w-full"
            >
              {copied ? `✓ ${t.lobby.linkCopied}` : `📋 ${t.lobby.copyLink}`}
            </Button>

            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <Button
                onClick={handleNativeShare}
                variant="secondary"
                size="lg"
                className="w-full"
              >
                📤 {t.lobby.share}
              </Button>
            )}
          </div>
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
