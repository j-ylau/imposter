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
  nextPlayer,
  allPlayersRevealed,
} from '@/lib/game';
import type { Theme } from '@/schema';
import { GamePhase, GameMode } from '@/schema';
import { Lobby } from '@/components/Game/Lobby';
import { RoleReveal } from '@/components/Game/RoleReveal';
import { InPersonRound } from '@/components/Game/InPersonRound';
import { Vote } from '@/components/Game/Vote';
import { Results } from '@/components/Game/Results';
import { useThrottle } from '@/lib/hooks/useThrottle';
import { logger } from '@/lib/logger';

export default function RoomPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = params.roomId as string;

  const [currentPlayerId, setCurrentPlayerId] = useState<string>('');
  const { room, loading, error } = useRoom(roomId, currentPlayerId);
  const [playerState, setPlayerState] = useState<{
    word?: string;
    isImposter: boolean;
  }>({ isImposter: false });
  const [voteResults, setVoteResults] = useState<{
    mostVotedPlayerId: string;
    voteCount: number;
    voteCounts: Record<string, number>;
  } | null>(null);

  // Rate limiting for game actions
  const throttle = useThrottle(2000); // 2 second cooldown between actions

  // Load player ID from localStorage
  useEffect(() => {
    const playerId = localStorage.getItem('currentPlayerId') || '';
    setCurrentPlayerId(playerId);
  }, []);

  // Update player state when room changes
  useEffect(() => {
    if (!room) return;

    // In pass-and-play mode, get state for current player by index
    if (room.gameMode === 'pass-and-play' && room.currentPlayerIndex !== undefined) {
      const currentPlayer = room.players[room.currentPlayerIndex];
      if (currentPlayer) {
        const state = getRoomStateForPlayer(room, currentPlayer.id);
        setPlayerState(state);
      }
    } else if (currentPlayerId) {
      // Online mode: use stored player ID
      const state = getRoomStateForPlayer(room, currentPlayerId);
      setPlayerState(state);
    }
  }, [room, currentPlayerId]);

  // Auto-calculate results when all votes submitted
  useEffect(() => {
    if (room && room.phase === GamePhase.Vote && allVotesSubmitted(room)) {
      setTimeout(async () => {
        const results = calculateVoteResults(room);
        setVoteResults(results);
        const updated = nextPhase(room);
        await roomApi.updateRoom(updated);
      }, 1000);
    }
  }, [room]);

  const handleStartGame = throttle(async () => {
    if (!room) return;

    // Use atomic start to prevent race conditions
    const updated = startGame(room);
    const success = await roomApi.startGameAtomic(
      room.id,
      updated.players,
      updated.imposterId!
    );

    if (!success) {
      logger.warn('[handleStartGame] Game already started by another player');
      // Refresh room state to get latest data
      const latestRoom = await roomApi.getRoom(room.id);
      // Room will be updated via realtime subscription
    }
  });

  const handleContinue = throttle(async () => {
    if (!room) return;

    // In pass-and-play mode, advance to next player until all have seen roles
    if (room.gameMode === GameMode.PassAndPlay && room.phase === GamePhase.Role) {
      // Advance to next player
      let updated = nextPlayer(room);

      // If all players have now seen their role, move to in-person-round phase
      if (allPlayersRevealed(updated)) {
        updated = nextPhase(updated);
      }

      await roomApi.updateRoom(updated);
    } else {
      // Online mode: just advance phase
      const updated = nextPhase(room);
      await roomApi.updateRoom(updated);
    }
  });

  const handleVote = throttle(async (targetId: string) => {
    if (!room) return;
    const updated = submitVote(room, currentPlayerId, targetId);
    await roomApi.updateRoom(updated);
  });

  const handlePlayAgain = throttle(async () => {
    if (!room) return;
    const updated = resetGame(room);
    await roomApi.updateRoom(updated);
    setVoteResults(null);
  });

  const handlePlayAgainWithTheme = throttle(async (theme: Theme) => {
    if (!room) return;
    const updated = resetGameWithTheme(room, theme);
    await roomApi.updateRoom(updated);
    setVoteResults(null);
  });

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
      {room.phase === GamePhase.Lobby && (
        <Lobby
          room={room}
          currentPlayerId={currentPlayerId}
          onStartGame={handleStartGame}
        />
      )}

      {room.phase === GamePhase.Role && (
        <RoleReveal
          room={room}
          isImposter={playerState.isImposter}
          word={playerState.word}
          onContinue={handleContinue}
        />
      )}

      {room.phase === GamePhase.InPersonRound && (
        <InPersonRound room={room} onRevealImposter={handleContinue} />
      )}

      {room.phase === GamePhase.Vote && (
        <Vote
          room={room}
          currentPlayerId={currentPlayerId}
          onVote={handleVote}
        />
      )}

      {room.phase === GamePhase.Result && (
        <Results
          room={room}
          mostVotedPlayerId={voteResults?.mostVotedPlayerId}
          voteCounts={voteResults?.voteCounts}
          imposterWon={
            voteResults ? checkImposterWin(room, voteResults.mostVotedPlayerId) : undefined
          }
          onPlayAgain={handlePlayAgain}
          onPlayAgainWithTheme={handlePlayAgainWithTheme}
          onGoHome={handleGoHome}
        />
      )}
    </div>
  );
}
