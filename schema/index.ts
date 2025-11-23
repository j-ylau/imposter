// All TypeScript types in one file

export type GameMode = 'online' | 'pass-and-play';

export type GamePhase =
  | 'lobby'
  | 'role'
  | 'vote'
  | 'results';

export type Theme =
  | 'default'
  | 'pokemon'
  | 'nba'
  | 'memes'
  | 'movies'
  | 'countries'
  | 'anime'
  | 'video-games'
  | 'youtube'
  | 'tiktok'
  | 'music'
  | 'tv-shows'
  | 'food'
  | 'brands'
  | 'sports';

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
