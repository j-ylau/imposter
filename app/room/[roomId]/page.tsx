'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useRoom, roomApi } from '@/lib/realtime';
import {
  startGame,
  nextPhase,
  submitVote,
  calculateVoteResults,
  checkImposterWin,
  resetGame,
  resetGameWithTheme,
  getRoomStateForPlayer,
  allVotesSubmitted,
} from '@/lib/game';
import type { Theme } from '@/schema';
import { Lobby } from '@/components/Game/Lobby';
import { RoleReveal } from '@/components/Game/RoleReveal';
import { Vote } from '@/components/Game/Vote';
import { Results } from '@/components/Game/Results';

export default function RoomPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = params.roomId as string;

  const { room, loading, error } = useRoom(roomId);
  const [currentPlayerId, setCurrentPlayerId] = useState<string>('');
  const [playerState, setPlayerState] = useState<{
    word?: string;
    isImposter: boolean;
  }>({ isImposter: false });
  const [voteResults, setVoteResults] = useState<{
    mostVotedPlayerId: string;
    voteCount: number;
    voteCounts: Record<string, number>;
  } | null>(null);

  // Load player ID from localStorage
  useEffect(() => {
    const playerId = localStorage.getItem('currentPlayerId') || '';
    setCurrentPlayerId(playerId);
  }, []);

  // Update player state when room changes
  useEffect(() => {
    if (room && currentPlayerId) {
      const state = getRoomStateForPlayer(room, currentPlayerId);
      setPlayerState(state);
    }
  }, [room, currentPlayerId]);

  // Auto-calculate results when all votes submitted
  useEffect(() => {
    if (room && room.phase === 'vote' && allVotesSubmitted(room)) {
      setTimeout(async () => {
        const results = calculateVoteResults(room);
        setVoteResults(results);
        const updated = nextPhase(room);
        await roomApi.updateRoom(updated);
      }, 1000);
    }
  }, [room]);

  const handleStartGame = async () => {
    if (!room) return;
    const updated = startGame(room);
    await roomApi.updateRoom(updated);
  };

  const handleContinue = async () => {
    if (!room) return;
    const updated = nextPhase(room);
    await roomApi.updateRoom(updated);
  };

  const handleVote = async (targetId: string) => {
    if (!room) return;
    const updated = submitVote(room, currentPlayerId, targetId);
    await roomApi.updateRoom(updated);
  };

  const handlePlayAgain = async () => {
    if (!room) return;
    const updated = resetGame(room);
    await roomApi.updateRoom(updated);
    setVoteResults(null);
  };

  const handlePlayAgainWithTheme = async (theme: Theme) => {
    if (!room) return;
    const updated = resetGameWithTheme(room, theme);
    await roomApi.updateRoom(updated);
    setVoteResults(null);
  };

  const handleGoHome = () => {
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading...</p>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-red-600">{error?.message || 'Room not found'}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 py-8">
      {room.phase === 'lobby' && (
        <Lobby
          room={room}
          currentPlayerId={currentPlayerId}
          onStartGame={handleStartGame}
        />
      )}

      {room.phase === 'role' && (
        <RoleReveal
          room={room}
          isImposter={playerState.isImposter}
          word={playerState.word}
          onContinue={handleContinue}
        />
      )}

      {room.phase === 'vote' && (
        <Vote
          room={room}
          currentPlayerId={currentPlayerId}
          onVote={handleVote}
        />
      )}

      {room.phase === 'results' && voteResults && (
        <Results
          room={room}
          mostVotedPlayerId={voteResults.mostVotedPlayerId}
          voteCounts={voteResults.voteCounts}
          imposterWon={checkImposterWin(room, voteResults.mostVotedPlayerId)}
          onPlayAgain={handlePlayAgain}
          onPlayAgainWithTheme={handlePlayAgainWithTheme}
          onGoHome={handleGoHome}
        />
      )}
    </div>
  );
}
