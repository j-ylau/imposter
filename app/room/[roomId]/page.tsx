'use client';

import { useEffect, useState, useRef } from 'react';
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
  resetAndStartGame,
  resetAndStartGameWithTheme,
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

  const [currentPlayerId] = useState<string>(() =>
    typeof window !== 'undefined' ? localStorage.getItem('currentPlayerId') || '' : ''
  );
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

  // Guard against double-firing the auto-advance
  const hasAdvancedToResults = useRef(false);

  // Rate limiting for game actions
  const throttle = useThrottle(2000);

  // Update player state when room changes
  useEffect(() => {
    if (!room) return;

    // In pass-and-play mode, get state for current player by index
    if (room.gameMode === 'pass-and-play' && room.currentPlayerIndex !== undefined) {
      const currentPlayer = room.players[room.currentPlayerIndex];
      if (currentPlayer) {
        const state = getRoomStateForPlayer(room, currentPlayer.id);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPlayerState(state);
      }
    } else if (currentPlayerId) {
      // Online mode: use stored player ID
      const state = getRoomStateForPlayer(room, currentPlayerId);
      setPlayerState(state);
    }
  }, [room, currentPlayerId]);

  // Auto-calculate results when all votes submitted (with race condition guard)
  useEffect(() => {
    if (room && room.phase === GamePhase.Vote && allVotesSubmitted(room) && !hasAdvancedToResults.current) {
      hasAdvancedToResults.current = true;
      const timer = setTimeout(async () => {
        try {
          const results = calculateVoteResults(room);
          setVoteResults(results);
          const updated = nextPhase(room);
          await roomApi.updateRoom(updated);
        } catch (err) {
          logger.error('[auto-advance] Failed to advance to results:', err);
          hasAdvancedToResults.current = false;
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [room]);

  // Recompute vote results when entering Result phase without them
  // (handles page refresh during results)
  useEffect(() => {
    if (room && room.phase === GamePhase.Result && !voteResults && room.votes.length > 0) {
      const results = calculateVoteResults(room);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVoteResults(results);
    }
  }, [room, voteResults]);

  // Reset the advance guard when game resets
  useEffect(() => {
    if (room && room.phase === GamePhase.Lobby) {
      hasAdvancedToResults.current = false;
    }
  }, [room]);

  const handleStartGame = throttle(async () => {
    if (!room) return;

    const updated = startGame(room);
    const success = await roomApi.startGameAtomic(
      room.id,
      updated.players,
      updated.imposterId!
    );

    if (!success) {
      logger.warn('[handleStartGame] Game already started by another player');
      await roomApi.getRoom(room.id);
    }
  });

  const handleContinue = throttle(async () => {
    if (!room) return;

    if (room.gameMode === GameMode.PassAndPlay && room.phase === GamePhase.Role) {
      let updated = nextPlayer(room);

      if (allPlayersRevealed(updated)) {
        updated = nextPhase(updated);
      }

      await roomApi.updateRoom(updated);
    } else {
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

    // For pass-and-play: reset AND auto-start so players don't get stuck in lobby
    if (room.gameMode === GameMode.PassAndPlay) {
      const updated = resetAndStartGame(room);
      await roomApi.updateRoom(updated);
    } else {
      const updated = resetGame(room);
      await roomApi.updateRoom(updated);
    }
    setVoteResults(null);
  });

  const handlePlayAgainWithTheme = throttle(async (theme: Theme) => {
    if (!room) return;

    // For pass-and-play: reset AND auto-start
    if (room.gameMode === GameMode.PassAndPlay) {
      const updated = resetAndStartGameWithTheme(room, theme);
      await roomApi.updateRoom(updated);
    } else {
      const updated = resetGameWithTheme(room, theme);
      await roomApi.updateRoom(updated);
    }
    setVoteResults(null);
  });

  const handleGoHome = () => {
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-pulse">🕵️</div>
          <p className="text-lg text-fg-muted">Loading game...</p>
        </div>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="text-5xl mb-2">😵</div>
          <h2 className="text-2xl font-bold text-fg">Room Not Found</h2>
          <p className="text-fg-muted">{error?.message || 'This game room doesn\'t exist or has expired.'}</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-primary text-primary-fg rounded-lg font-medium hover:bg-primary-hover transition-colors"
          >
            Create New Game
          </button>
        </div>
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
