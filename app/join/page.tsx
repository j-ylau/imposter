'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/UI/Button';
import { Input } from '@/components/UI/Input';
import { Card, CardBody, CardHeader } from '@/components/UI/Card';
import { roomApi } from '@/lib/realtime';
import { addPlayer } from '@/lib/game';
import { isValidPlayerName, isValidRoomId } from '@/lib/util';
import { ROOM_ID_LENGTH } from '@/lib/constants';

export default function JoinPage() {
  const router = useRouter();
  const [playerName, setPlayerName] = useState('');
  const [roomCode, setRoomCode] = useState(Array(ROOM_ID_LENGTH).fill(''));
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleCodeChange = (index: number, value: string) => {
    // Only allow alphanumeric characters
    const sanitized = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (sanitized.length > 1) return; // Prevent pasting multiple characters

    const newCode = [...roomCode];
    newCode[index] = sanitized;
    setRoomCode(newCode);

    // Auto-focus next input
    if (sanitized && index < ROOM_ID_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all digits are filled
    if (newCode.every(digit => digit !== '') && newCode.join('').length === ROOM_ID_LENGTH) {
      handleJoin(newCode.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !roomCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').toUpperCase().replace(/[^A-Z0-9]/g, '');
    const newCode = pastedData.slice(0, ROOM_ID_LENGTH).split('');

    while (newCode.length < ROOM_ID_LENGTH) {
      newCode.push('');
    }

    setRoomCode(newCode);

    // Auto-submit if complete
    if (newCode.every(digit => digit !== '')) {
      handleJoin(newCode.join(''));
    } else {
      // Focus the next empty input
      const nextEmptyIndex = newCode.findIndex(digit => digit === '');
      if (nextEmptyIndex !== -1) {
        inputRefs.current[nextEmptyIndex]?.focus();
      }
    }
  };

  const handleJoin = async (code?: string) => {
    const trimmedName = playerName.trim();
    const trimmedCode = code || roomCode.join('');

    if (!trimmedName) {
      setError('Please enter your name');
      return;
    }

    if (!isValidPlayerName(trimmedName)) {
      setError('Name must be 2-20 characters');
      return;
    }

    if (!isValidRoomId(trimmedCode)) {
      setError('Please enter a complete 6-character room code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const room = await roomApi.getRoom(trimmedCode);

      if (!room) {
        setError('Room not found');
        setLoading(false);
        return;
      }

      if (room.phase !== 'lobby') {
        setError('Game already in progress');
        setLoading(false);
        return;
      }

      const updatedRoom = addPlayer(room, trimmedName);
      await roomApi.updateRoom(updatedRoom);

      const newPlayer = updatedRoom.players[updatedRoom.players.length - 1];

      localStorage.setItem('currentPlayerId', newPlayer.id);
      localStorage.setItem('currentPlayerName', trimmedName);

      router.push(`/room/${trimmedCode}`);
    } catch (err) {
      setError('Failed to join room. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Join Game</h1>
          <p className="text-gray-600">Enter the room code to join</p>
        </div>

        <Card variant="elevated">
          <CardHeader>
            <h2 className="text-xl font-bold text-gray-900">Your Name</h2>
          </CardHeader>
          <CardBody>
            <Input
              type="text"
              placeholder="Enter your name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              maxLength={20}
              autoFocus
            />
          </CardBody>
        </Card>

        <Card variant="elevated">
          <CardHeader>
            <h2 className="text-xl font-bold text-gray-900 text-center">Enter Room Code</h2>
          </CardHeader>
          <CardBody>
            {/* PIN-style code input */}
            <div className="flex justify-center gap-2 mb-4" onPaste={handlePaste}>
              {roomCode.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  type="text"
                  inputMode="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  disabled={loading}
                  className="w-12 h-14 text-center text-2xl font-bold font-mono border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase"
                  autoFocus={index === 0}
                />
              ))}
            </div>
            <p className="text-xs text-gray-500 text-center mb-2">
              Auto-joins when complete
            </p>
            {error && <p className="text-sm text-red-600 text-center">{error}</p>}
            {loading && (
              <div className="flex items-center justify-center gap-2 mt-4">
                <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            )}
          </CardBody>
        </Card>

        <Button
          onClick={() => router.push('/')}
          variant="ghost"
          className="w-full"
        >
          ← Back to Home
        </Button>
      </div>
    </div>
  );
}
