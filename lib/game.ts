// ALL game logic in one file

import type { Room, Player, GamePhase, Theme, Vote, GameMode } from '@/schema';
import { THEMES } from '@/data/themes';
import { randomItem, shuffle, generateRoomId, generatePlayerId } from './util';
import { MIN_PLAYERS_TO_START } from './constants';
import {
  InsufficientPlayersError,
  PlayerNotFoundError,
  InvalidGamePhaseError,
  InvalidVoteTargetError,
  PlayerAlreadyExistsError,
  RoomGameInProgressError,
  RoomLockedError,
} from './error';

// Generate a random word from the selected theme
export function generateWord(theme: Theme = 'default'): string {
  const wordList = THEMES[theme] || THEMES.default;
  return randomItem(wordList);
}

// Assign roles to players (one random imposter)
export function assignRoles(players: Player[]): {
  players: Player[];
  imposterId: string;
} {
  if (players.length < MIN_PLAYERS_TO_START) {
    throw new InsufficientPlayersError(players.length, MIN_PLAYERS_TO_START);
  }

  const shuffledPlayers = shuffle(players);
  const imposterIndex = Math.floor(Math.random() * shuffledPlayers.length);
  const imposterId = shuffledPlayers[imposterIndex].id;

  const updatedPlayers = shuffledPlayers.map((player, index) => ({
    ...player,
    isImposter: index === imposterIndex,
  }));

  return {
    players: updatedPlayers,
    imposterId,
  };
}

// Create a new room
export function createRoom(hostName: string, theme: Theme, gameMode: GameMode = 'online'): Room {
  const roomId = generateRoomId();
  const hostId = generatePlayerId();
  const word = generateWord(theme);
  const now = Date.now();

  const host: Player = {
    id: hostId,
    name: hostName.trim(),
    isHost: true,
    isImposter: false,
    joinedAt: now,
  };

  return {
    id: roomId,
    word,
    theme,
    phase: 'lobby',
    gameMode,
    players: [host],
    votes: [],
    imposterId: null,
    createdAt: now,
    hostId,
    locked: false,
    expiresAt: now + 30 * 60 * 1000, // 30 minutes from now
    updatedAt: now,
    currentPlayerIndex: gameMode === 'pass-and-play' ? 0 : undefined,
  };
}

// Add player to room
export function addPlayer(room: Room, playerName: string): Room {
  if (room.phase !== 'lobby') {
    throw new RoomGameInProgressError(room.id);
  }

  if (room.locked) {
    throw new RoomLockedError(room.id);
  }

  const trimmedName = playerName.trim();
  const nameExists = room.players.some((p) => p.name === trimmedName);

  if (nameExists) {
    throw new PlayerAlreadyExistsError(trimmedName);
  }

  const playerId = generatePlayerId();

  const newPlayer: Player = {
    id: playerId,
    name: trimmedName,
    isHost: false,
    isImposter: false,
    joinedAt: Date.now(),
  };

  return {
    ...room,
    players: [...room.players, newPlayer],
  };
}

// Remove player from room
export function removePlayer(room: Room, playerId: string): Room {
  return {
    ...room,
    players: room.players.filter((p) => p.id !== playerId),
  };
}

// Start the game (transition from lobby to role reveal)
export function startGame(room: Room): Room {
  if (room.phase !== 'lobby') {
    throw new InvalidGamePhaseError(room.phase, 'lobby');
  }

  if (room.players.length < MIN_PLAYERS_TO_START) {
    throw new InsufficientPlayersError(room.players.length, MIN_PLAYERS_TO_START);
  }

  const { players, imposterId } = assignRoles(room.players);

  return {
    ...room,
    players,
    imposterId,
    phase: 'role',
    locked: true, // Lock room when game starts
  };
}

// Move to next phase
export function nextPhase(room: Room): Room {
  // Different phase flow for online vs pass-and-play
  const phaseOrder: GamePhase[] =
    room.gameMode === 'pass-and-play'
      ? ['lobby', 'role', 'in-person-round', 'result']
      : ['lobby', 'role', 'vote', 'result'];

  const currentIndex = phaseOrder.indexOf(room.phase);
  const nextPhaseValue = phaseOrder[currentIndex + 1] || room.phase;

  return {
    ...room,
    phase: nextPhaseValue,
  };
}

// Submit a vote
export function submitVote(room: Room, voterId: string, targetId: string): Room {
  if (room.phase !== 'vote') {
    throw new InvalidGamePhaseError(room.phase, 'vote');
  }

  const voter = room.players.find((p) => p.id === voterId);
  if (!voter) {
    throw new PlayerNotFoundError(voterId);
  }

  const target = room.players.find((p) => p.id === targetId);
  if (!target) {
    throw new InvalidVoteTargetError(targetId);
  }

  // Remove existing vote from this voter if any
  const filteredVotes = room.votes.filter((v) => v.voterId !== voterId);

  const newVote: Vote = {
    voterId,
    voterName: voter.name,
    targetId,
    targetName: target.name,
  };

  return {
    ...room,
    votes: [...filteredVotes, newVote],
  };
}

// Check if all players have voted
export function allVotesSubmitted(room: Room): boolean {
  return room.votes.length === room.players.length;
}

// Calculate voting results
export function calculateVoteResults(room: Room): {
  mostVotedPlayerId: string;
  voteCount: number;
  voteCounts: Record<string, number>;
} {
  const voteCounts: Record<string, number> = {};

  // Count votes for each player
  room.votes.forEach((vote) => {
    voteCounts[vote.targetId] = (voteCounts[vote.targetId] || 0) + 1;
  });

  // Find player with most votes
  let mostVotedPlayerId = '';
  let maxVotes = 0;

  Object.entries(voteCounts).forEach(([playerId, count]) => {
    if (count > maxVotes) {
      maxVotes = count;
      mostVotedPlayerId = playerId;
    }
  });

  return {
    mostVotedPlayerId,
    voteCount: maxVotes,
    voteCounts,
  };
}

// Check if imposter won
export function checkImposterWin(room: Room, mostVotedPlayerId: string): boolean {
  // Imposter wins if they weren't voted out
  return mostVotedPlayerId !== room.imposterId;
}

// Reset game for new round (same theme)
export function resetGame(room: Room): Room {
  const word = generateWord(room.theme);

  return {
    ...room,
    word,
    phase: 'lobby',
    votes: [],
    imposterId: null,
    locked: false, // Unlock room on restart
    players: room.players.map((p) => ({ ...p, isImposter: false })),
  };
}

// Reset game with a new theme
export function resetGameWithTheme(room: Room, newTheme: Theme): Room {
  const word = generateWord(newTheme);

  return {
    ...room,
    word,
    theme: newTheme,
    phase: 'lobby',
    votes: [],
    imposterId: null,
    locked: false, // Unlock room on restart
    players: room.players.map((p) => ({ ...p, isImposter: false })),
  };
}

// Get sanitized room state for a specific player
export function getRoomStateForPlayer(room: Room, playerId: string): {
  word?: string;
  isImposter: boolean;
} {
  const player = room.players.find((p) => p.id === playerId);
  const isImposter = player?.isImposter || false;

  return {
    word: isImposter ? undefined : room.word,
    isImposter,
  };
}

// ============================================================================
// Pass & Play Mode - Turn Management
// ============================================================================

// Get current player in pass-and-play mode
export function getCurrentPlayer(room: Room) {
  if (room.gameMode !== 'pass-and-play' || room.currentPlayerIndex === undefined) {
    return null;
  }
  return room.players[room.currentPlayerIndex] || null;
}

// Advance to next player in pass-and-play mode
export function nextPlayer(room: Room): Room {
  if (room.gameMode !== 'pass-and-play' || room.currentPlayerIndex === undefined) {
    return room;
  }

  const nextIndex = (room.currentPlayerIndex + 1) % room.players.length;

  return {
    ...room,
    currentPlayerIndex: nextIndex,
  };
}

// Check if all players have seen their role in pass-and-play
export function allPlayersRevealed(room: Room): boolean {
  if (room.gameMode !== 'pass-and-play' || room.currentPlayerIndex === undefined) {
    return true; // In online mode, roles are revealed simultaneously
  }

  // In pass-and-play, all players have seen roles when we've cycled through everyone
  return room.currentPlayerIndex === 0 && room.phase !== 'lobby';
}

// Reset player index to start
export function resetPlayerIndex(room: Room): Room {
  if (room.gameMode !== 'pass-and-play') {
    return room;
  }

  return {
    ...room,
    currentPlayerIndex: 0,
  };
}
