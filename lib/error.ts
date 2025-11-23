/**
 * Error system - Fail-fast philosophy with strict typing
 * No fallbacks, no optionals - errors must be handled explicitly
 */

import { PLAYER_NAME_MIN_LENGTH, PLAYER_NAME_MAX_LENGTH } from './constants';

// Error codes for strict error identification
export enum ErrorCode {
  // Room errors
  ROOM_NOT_FOUND = 'ROOM_NOT_FOUND',
  ROOM_CREATION_FAILED = 'ROOM_CREATION_FAILED',
  ROOM_UPDATE_FAILED = 'ROOM_UPDATE_FAILED',
  ROOM_FULL = 'ROOM_FULL',
  ROOM_GAME_IN_PROGRESS = 'ROOM_GAME_IN_PROGRESS',
  ROOM_LOCKED = 'ROOM_LOCKED',
  ROOM_EXPIRED = 'ROOM_EXPIRED',

  // Player errors
  INVALID_PLAYER_NAME = 'INVALID_PLAYER_NAME',
  PLAYER_NOT_FOUND = 'PLAYER_NOT_FOUND',
  PLAYER_ALREADY_EXISTS = 'PLAYER_ALREADY_EXISTS',
  NOT_HOST = 'NOT_HOST',

  // Game errors
  INVALID_GAME_PHASE = 'INVALID_GAME_PHASE',
  INSUFFICIENT_PLAYERS = 'INSUFFICIENT_PLAYERS',
  INVALID_VOTE_TARGET = 'INVALID_VOTE_TARGET',

  // Database errors
  DB_READ_FAILED = 'DB_READ_FAILED',
  DB_WRITE_FAILED = 'DB_WRITE_FAILED',
  DB_CONNECTION_FAILED = 'DB_CONNECTION_FAILED',

  // Validation errors
  VALIDATION_FAILED = 'VALIDATION_FAILED',

  // Unknown errors
  UNKNOWN = 'UNKNOWN',
}

// Base error class
export class AppError extends Error {
  readonly code: ErrorCode;
  readonly timestamp: Date;

  constructor(code: ErrorCode, message: string) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.timestamp = new Date();

    // Maintains proper stack trace for where error was thrown
    Object.setPrototypeOf(this, AppError.prototype);
  }

  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      timestamp: this.timestamp.toISOString(),
    };
  }
}

// Room errors
export class RoomNotFoundError extends AppError {
  readonly roomId: string;

  constructor(roomId: string) {
    super(ErrorCode.ROOM_NOT_FOUND, `Room not found: ${roomId}`);
    this.name = 'RoomNotFoundError';
    this.roomId = roomId;
    Object.setPrototypeOf(this, RoomNotFoundError.prototype);
  }
}

export class RoomCreationFailedError extends AppError {
  readonly reason: string;

  constructor(reason: string) {
    super(ErrorCode.ROOM_CREATION_FAILED, `Failed to create room: ${reason}`);
    this.name = 'RoomCreationFailedError';
    this.reason = reason;
    Object.setPrototypeOf(this, RoomCreationFailedError.prototype);
  }
}

export class RoomUpdateFailedError extends AppError {
  readonly roomId: string;
  readonly reason: string;

  constructor(roomId: string, reason: string) {
    super(ErrorCode.ROOM_UPDATE_FAILED, `Failed to update room ${roomId}: ${reason}`);
    this.name = 'RoomUpdateFailedError';
    this.roomId = roomId;
    this.reason = reason;
    Object.setPrototypeOf(this, RoomUpdateFailedError.prototype);
  }
}

export class RoomFullError extends AppError {
  readonly roomId: string;
  readonly maxPlayers: number;

  constructor(roomId: string, maxPlayers: number) {
    super(ErrorCode.ROOM_FULL, `Room ${roomId} is full (max: ${maxPlayers} players)`);
    this.name = 'RoomFullError';
    this.roomId = roomId;
    this.maxPlayers = maxPlayers;
    Object.setPrototypeOf(this, RoomFullError.prototype);
  }
}

export class RoomGameInProgressError extends AppError {
  readonly roomId: string;

  constructor(roomId: string) {
    super(ErrorCode.ROOM_GAME_IN_PROGRESS, `Cannot join room ${roomId}: game already in progress`);
    this.name = 'RoomGameInProgressError';
    this.roomId = roomId;
    Object.setPrototypeOf(this, RoomGameInProgressError.prototype);
  }
}

export class RoomLockedError extends AppError {
  readonly roomId: string;

  constructor(roomId: string) {
    super(ErrorCode.ROOM_LOCKED, `Room ${roomId} is locked: game has started`);
    this.name = 'RoomLockedError';
    this.roomId = roomId;
    Object.setPrototypeOf(this, RoomLockedError.prototype);
  }
}

export class RoomExpiredError extends AppError {
  readonly roomId: string;
  readonly expiresAt: number;

  constructor(roomId: string, expiresAt: number) {
    super(ErrorCode.ROOM_EXPIRED, `Room ${roomId} has expired`);
    this.name = 'RoomExpiredError';
    this.roomId = roomId;
    this.expiresAt = expiresAt;
    Object.setPrototypeOf(this, RoomExpiredError.prototype);
  }
}

// Player errors
export class InvalidPlayerNameError extends AppError {
  readonly playerName: string;
  readonly minLength: number;
  readonly maxLength: number;

  constructor(playerName: string) {
    super(
      ErrorCode.INVALID_PLAYER_NAME,
      `Invalid player name "${playerName}": must be ${PLAYER_NAME_MIN_LENGTH}-${PLAYER_NAME_MAX_LENGTH} characters`
    );
    this.name = 'InvalidPlayerNameError';
    this.playerName = playerName;
    this.minLength = PLAYER_NAME_MIN_LENGTH;
    this.maxLength = PLAYER_NAME_MAX_LENGTH;
    Object.setPrototypeOf(this, InvalidPlayerNameError.prototype);
  }
}

export class PlayerNotFoundError extends AppError {
  readonly playerId: string;

  constructor(playerId: string) {
    super(ErrorCode.PLAYER_NOT_FOUND, `Player not found: ${playerId}`);
    this.name = 'PlayerNotFoundError';
    this.playerId = playerId;
    Object.setPrototypeOf(this, PlayerNotFoundError.prototype);
  }
}

export class PlayerAlreadyExistsError extends AppError {
  readonly playerName: string;

  constructor(playerName: string) {
    super(ErrorCode.PLAYER_ALREADY_EXISTS, `Player "${playerName}" already exists in this room`);
    this.name = 'PlayerAlreadyExistsError';
    this.playerName = playerName;
    Object.setPrototypeOf(this, PlayerAlreadyExistsError.prototype);
  }
}

export class NotHostError extends AppError {
  readonly playerId: string;

  constructor(playerId: string) {
    super(ErrorCode.NOT_HOST, `Player ${playerId} is not the host`);
    this.name = 'NotHostError';
    this.playerId = playerId;
    Object.setPrototypeOf(this, NotHostError.prototype);
  }
}

// Game errors
export class InvalidGamePhaseError extends AppError {
  readonly currentPhase: string;
  readonly expectedPhase: string;

  constructor(currentPhase: string, expectedPhase: string) {
    super(
      ErrorCode.INVALID_GAME_PHASE,
      `Invalid game phase: expected ${expectedPhase}, got ${currentPhase}`
    );
    this.name = 'InvalidGamePhaseError';
    this.currentPhase = currentPhase;
    this.expectedPhase = expectedPhase;
    Object.setPrototypeOf(this, InvalidGamePhaseError.prototype);
  }
}

export class InsufficientPlayersError extends AppError {
  readonly currentCount: number;
  readonly requiredCount: number;

  constructor(currentCount: number, requiredCount: number) {
    super(
      ErrorCode.INSUFFICIENT_PLAYERS,
      `Insufficient players: need ${requiredCount}, have ${currentCount}`
    );
    this.name = 'InsufficientPlayersError';
    this.currentCount = currentCount;
    this.requiredCount = requiredCount;
    Object.setPrototypeOf(this, InsufficientPlayersError.prototype);
  }
}

export class InvalidVoteTargetError extends AppError {
  readonly targetId: string;

  constructor(targetId: string) {
    super(ErrorCode.INVALID_VOTE_TARGET, `Invalid vote target: ${targetId}`);
    this.name = 'InvalidVoteTargetError';
    this.targetId = targetId;
    Object.setPrototypeOf(this, InvalidVoteTargetError.prototype);
  }
}

// Database errors
export class DatabaseReadError extends AppError {
  readonly operation: string;
  readonly reason: string;

  constructor(operation: string, reason: string) {
    super(ErrorCode.DB_READ_FAILED, `Database read failed for ${operation}: ${reason}`);
    this.name = 'DatabaseReadError';
    this.operation = operation;
    this.reason = reason;
    Object.setPrototypeOf(this, DatabaseReadError.prototype);
  }
}

export class DatabaseWriteError extends AppError {
  readonly operation: string;
  readonly reason: string;

  constructor(operation: string, reason: string) {
    super(ErrorCode.DB_WRITE_FAILED, `Database write failed for ${operation}: ${reason}`);
    this.name = 'DatabaseWriteError';
    this.operation = operation;
    this.reason = reason;
    Object.setPrototypeOf(this, DatabaseWriteError.prototype);
  }
}

export class DatabaseConnectionError extends AppError {
  readonly reason: string;

  constructor(reason: string) {
    super(ErrorCode.DB_CONNECTION_FAILED, `Database connection failed: ${reason}`);
    this.name = 'DatabaseConnectionError';
    this.reason = reason;
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }
}

// Validation errors
export class ValidationError extends AppError {
  readonly field: string;
  readonly value: unknown;
  readonly constraint: string;

  constructor(field: string, value: unknown, constraint: string) {
    super(
      ErrorCode.VALIDATION_FAILED,
      `Validation failed for field "${field}": ${constraint}`
    );
    this.name = 'ValidationError';
    this.field = field;
    this.value = value;
    this.constraint = constraint;
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

// Error type guards
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

export function isRoomError(error: unknown): error is RoomNotFoundError | RoomCreationFailedError | RoomUpdateFailedError | RoomFullError | RoomGameInProgressError | RoomLockedError | RoomExpiredError {
  return error instanceof RoomNotFoundError ||
         error instanceof RoomCreationFailedError ||
         error instanceof RoomUpdateFailedError ||
         error instanceof RoomFullError ||
         error instanceof RoomGameInProgressError ||
         error instanceof RoomLockedError ||
         error instanceof RoomExpiredError;
}

export function isPlayerError(error: unknown): error is InvalidPlayerNameError | PlayerNotFoundError | PlayerAlreadyExistsError | NotHostError {
  return error instanceof InvalidPlayerNameError ||
         error instanceof PlayerNotFoundError ||
         error instanceof PlayerAlreadyExistsError ||
         error instanceof NotHostError;
}

export function isGameError(error: unknown): error is InvalidGamePhaseError | InsufficientPlayersError | InvalidVoteTargetError {
  return error instanceof InvalidGamePhaseError ||
         error instanceof InsufficientPlayersError ||
         error instanceof InvalidVoteTargetError;
}

export function isDatabaseError(error: unknown): error is DatabaseReadError | DatabaseWriteError | DatabaseConnectionError {
  return error instanceof DatabaseReadError ||
         error instanceof DatabaseWriteError ||
         error instanceof DatabaseConnectionError;
}

// Error handler utility
export function handleError(error: unknown): AppError {
  if (isAppError(error)) {
    return error;
  }

  if (error instanceof Error) {
    return new AppError(ErrorCode.UNKNOWN, error.message);
  }

  return new AppError(ErrorCode.UNKNOWN, 'An unknown error occurred');
}

// Get user-friendly error message from error code
export function getErrorMessage(code: ErrorCode): string {
  switch (code) {
    case ErrorCode.ROOM_NOT_FOUND:
      return 'Room not found';
    case ErrorCode.ROOM_CREATION_FAILED:
      return 'Failed to create room';
    case ErrorCode.ROOM_UPDATE_FAILED:
      return 'Failed to update room';
    case ErrorCode.ROOM_FULL:
      return 'Room is full';
    case ErrorCode.ROOM_GAME_IN_PROGRESS:
      return 'Game already in progress';
    case ErrorCode.ROOM_LOCKED:
      return 'Room is locked: game has started';
    case ErrorCode.ROOM_EXPIRED:
      return 'Room has expired';
    case ErrorCode.INVALID_PLAYER_NAME:
      return 'Invalid player name';
    case ErrorCode.PLAYER_NOT_FOUND:
      return 'Player not found';
    case ErrorCode.PLAYER_ALREADY_EXISTS:
      return 'Player already exists';
    case ErrorCode.NOT_HOST:
      return 'Only the host can perform this action';
    case ErrorCode.INVALID_GAME_PHASE:
      return 'Invalid game phase';
    case ErrorCode.INSUFFICIENT_PLAYERS:
      return 'Not enough players';
    case ErrorCode.INVALID_VOTE_TARGET:
      return 'Invalid vote target';
    case ErrorCode.DB_READ_FAILED:
      return 'Failed to read from database';
    case ErrorCode.DB_WRITE_FAILED:
      return 'Failed to write to database';
    case ErrorCode.DB_CONNECTION_FAILED:
      return 'Database connection failed';
    case ErrorCode.VALIDATION_FAILED:
      return 'Validation failed';
    case ErrorCode.UNKNOWN:
    default:
      return 'An unexpected error occurred';
  }
}
