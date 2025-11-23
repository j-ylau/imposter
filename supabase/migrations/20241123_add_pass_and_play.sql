-- Migration: Add Pass & Play Mode Support
-- Created: 2024-11-23
-- Description: Adds game_mode and current_player_index columns to support pass-and-play gameplay

-- Add game_mode column with default 'online' for existing rooms
ALTER TABLE rooms
ADD COLUMN IF NOT EXISTS game_mode TEXT NOT NULL DEFAULT 'online'
CHECK (game_mode IN ('online', 'pass-and-play'));

-- Add current_player_index column (nullable, only used in pass-and-play mode)
ALTER TABLE rooms
ADD COLUMN IF NOT EXISTS current_player_index INTEGER;

-- Add index for faster queries by game mode
CREATE INDEX IF NOT EXISTS idx_rooms_game_mode ON rooms(game_mode);

-- Add comment for documentation
COMMENT ON COLUMN rooms.game_mode IS 'Game mode: online (multi-device) or pass-and-play (single device)';
COMMENT ON COLUMN rooms.current_player_index IS 'Index of current player in pass-and-play mode (0-based)';
