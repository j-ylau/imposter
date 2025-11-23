// All TypeScript types in one file

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
  | 'countries';

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
  players: Player[];
  votes: Vote[];
  imposterId: string | null;
  createdAt: number;
  hostId: string;
}

export interface CreateRoomParams {
  hostName: string;
  theme: Theme;
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
