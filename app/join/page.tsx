'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/UI/Button';
import { Input } from '@/components/UI/Input';
import { Card, CardBody, CardHeader } from '@/components/UI/Card';
import { roomApi } from '@/lib/realtime';
import { addPlayer } from '@/lib/game';
import { isValidPlayerName, isValidRoomId } from '@/lib/util';

export default function JoinPage() {
  const router = useRouter();
  const [playerName, setPlayerName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleJoin = async () => {
    const trimmedName = playerName.trim();
    const trimmedCode = roomCode.trim().toUpperCase();

    if (!isValidPlayerName(trimmedName)) {
      setError('Name must be 2-20 characters');
      return;
    }

    if (!isValidRoomId(trimmedCode)) {
      setError('Room code must be 6 characters');
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

      // Store player info in localStorage
      localStorage.setItem('currentPlayerId', newPlayer.id);
      localStorage.setItem('currentPlayerName', trimmedName);

      // Navigate to room
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
            <h2 className="text-xl font-bold text-gray-900">Room Code</h2>
          </CardHeader>
          <CardBody>
            <Input
              type="text"
              placeholder="6-character code"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              maxLength={6}
              className="text-center text-2xl font-mono tracking-widest"
            />
            {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
          </CardBody>
        </Card>

        <Card variant="elevated">
          <CardBody className="space-y-4">
            <Button
              onClick={handleJoin}
              disabled={loading || !playerName.trim() || !roomCode.trim()}
              className="w-full"
              size="lg"
            >
              {loading ? 'Joining...' : 'Join Room'}
            </Button>
            <Button
              onClick={() => router.push('/')}
              variant="ghost"
              className="w-full"
            >
              Back to Home
            </Button>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
