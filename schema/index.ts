// All TypeScript types in one file

// Auto-generated Theme type from manifest
import type { Theme } from './theme-types';
export type { Theme };

// Enums for game logic (DRY, type-safe)
export enum GameMode {
  Online = 'online',
  PassAndPlay = 'pass-and-play',
}

export enum GamePhase {
  Lobby = 'lobby',
  Role = 'role',
  InPersonRound = 'in-person-round', // For pass-and-play: IRL discussion phase
  Vote = 'vote', // For online mode: digital voting
  Result = 'result',
}

export interface Player {
  id: string;
  name: string;
  isHost: boolean;
  isImposter: boolean;
  joinedAt: number;
}

export interface Vote {
  voterId: string;
  voterName: string;
  targetId: string;
  targetName: string;
}

export interface Room {
  id: string;
  word: string;
  theme: Theme;
  phase: GamePhase;
  gameMode: GameMode;
  players: Player[];
  votes: Vote[];
  imposterId: string | null;
  createdAt: number;
  hostId: string;
  locked: boolean;
  expiresAt: number;
  updatedAt: number;
  currentPlayerIndex?: number; // For pass-and-play mode: tracks whose turn it is
}

export interface CreateRoomParams {
  hostName: string;
  theme: Theme;
  gameMode?: GameMode;
}

export interface JoinRoomParams {
  roomId: string;
  playerName: string;
}

// Client-side room state (sanitized for non-imposters)
export interface RoomState extends Omit<Room, 'word' | 'imposterId'> {
  word?: string; // Only visible to non-imposters
  currentPlayerId?: string;
  isImposter: boolean;
}
