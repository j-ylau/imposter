// ALL game logic in one file

import type { Room, Player, GamePhase, Theme, Vote } from '@/schema';
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
export function createRoom(hostName: string, theme: Theme): Room {
  const roomId = generateRoomId();
  const hostId = generatePlayerId();
  const word = generateWord(theme);

  const host: Player = {
    id: hostId,
    name: hostName.trim(),
    isHost: true,
    isImposter: false,
    joinedAt: Date.now(),
  };

  return {
    id: roomId,
    word,
    theme,
    phase: 'lobby',
    players: [host],
    votes: [],
    imposterId: null,
    createdAt: Date.now(),
    hostId,
  };
}

// Add player to room
export function addPlayer(room: Room, playerName: string): Room {
  if (room.phase !== 'lobby') {
    throw new RoomGameInProgressError(room.id);
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
  };
}

// Move to next phase
export function nextPhase(room: Room): Room {
  const phaseOrder: GamePhase[] = ['lobby', 'role', 'vote', 'results'];
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
