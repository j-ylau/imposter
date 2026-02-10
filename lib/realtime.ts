// ALL realtime multiplayer logic in one file

import { useEffect, useState } from 'react';
import { supabase } from './supabase';
import type { Room, Player, Vote, Theme, GamePhase, GameMode } from '@/schema';
import {
  AppError,
  RoomNotFoundError,
  RoomCreationFailedError,
  RoomUpdateFailedError,
  DatabaseReadError,
  DatabaseWriteError,
  handleError,
} from './error';
import { logger } from './logger';

// Room API - CRUD operations using Supabase
export const roomApi = {
  // Create a new room
  async createRoom(room: Room): Promise<Room> {
    const { data, error } = await supabase
      .from('rooms')
      .insert({
        id: room.id,
        word: room.word,
        theme: room.theme,
        phase: room.phase,
        game_mode: room.gameMode,
        players: room.players,
        votes: room.votes,
        imposter_id: room.imposterId,
        host_id: room.hostId,
        locked: room.locked,
        created_at: new Date(room.createdAt).toISOString(),
        current_player_index: room.currentPlayerIndex,
      })
      .select()
      .single();

    if (error) {
      throw new RoomCreationFailedError(error.message);
    }

    if (!data) {
      throw new RoomCreationFailedError('No data returned from database');
    }

    return mapDbToRoom(data);
  },

  // Get room by ID
  async getRoom(roomId: string): Promise<Room> {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('id', roomId)
      .single();

    if (error) {
      // PGRST116 = no rows returned by Supabase
      if (error.code === 'PGRST116') {
        throw new RoomNotFoundError(roomId);
      }
      throw new DatabaseReadError('getRoom', error.message);
    }

    if (!data) {
      throw new RoomNotFoundError(roomId);
    }

    return mapDbToRoom(data);
  },

  // Update room
  async updateRoom(room: Room): Promise<Room> {
    const { data, error } = await supabase
      .from('rooms')
      .update({
        word: room.word,
        theme: room.theme,
        phase: room.phase,
        game_mode: room.gameMode,
        players: room.players,
        votes: room.votes,
        imposter_id: room.imposterId,
        host_id: room.hostId,
        locked: room.locked,
        current_player_index: room.currentPlayerIndex,
      })
      .eq('id', room.id)
      .select()
      .single();

    if (error) {
      throw new RoomUpdateFailedError(room.id, error.message);
    }

    if (!data) {
      throw new RoomUpdateFailedError(room.id, 'No data returned from database');
    }

    return mapDbToRoom(data);
  },

  // Delete room
  async deleteRoom(roomId: string): Promise<void> {
    const { error } = await supabase
      .from('rooms')
      .delete()
      .eq('id', roomId);

    if (error) {
      throw new DatabaseWriteError('deleteRoom', error.message);
    }
  },

  // Start game with race condition protection
  async startGameAtomic(roomId: string, players: Player[], imposterId: string): Promise<boolean> {
    const { data, error } = await supabase.rpc('start_game_atomic', {
      p_room_id: roomId,
      p_players: players,
      p_imposter_id: imposterId,
    });

    if (error) {
      throw new RoomUpdateFailedError(roomId, error.message);
    }

    return data === true;
  },
};

interface DbRoom {
  id: string;
  word: string | null;
  theme: string;
  phase: string;
  game_mode: string;
  players: Player[];
  votes: Vote[];
  imposter_id: string | null;
  host_id: string;
  locked: boolean;
  created_at: string;
  expires_at: string;
  updated_at: string;
  current_player_index: number | null;
}

// Map database row to Room type
function mapDbToRoom(data: DbRoom): Room {
  return {
    id: data.id,
    word: data.word ?? '',
    theme: data.theme as Theme,
    phase: data.phase as GamePhase,
    gameMode: (data.game_mode || 'online') as GameMode,
    players: data.players || [],
    votes: data.votes || [],
    imposterId: data.imposter_id,
    hostId: data.host_id,
    locked: data.locked || false,
    createdAt: new Date(data.created_at).getTime(),
    expiresAt: new Date(data.expires_at).getTime(),
    updatedAt: new Date(data.updated_at).getTime(),
    currentPlayerIndex: data.current_player_index ?? undefined,
  };
}

// Hook to subscribe to room updates with presence tracking
export function useRoom(roomId: string, currentPlayerId?: string) {
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AppError | null>(null);

  useEffect(() => {
    if (!roomId) return;

    // Load initial room data
    const loadRoom = async (): Promise<void> => {
      try {
        const roomData = await roomApi.getRoom(roomId);
        setRoom(roomData);
        setError(null);
      } catch (err) {
        setError(handleError(err));
        logger.error('[useRoom] Failed to load room:', err);
      } finally {
        setLoading(false);
      }
    };

    loadRoom();

    // Subscribe to realtime updates with presence tracking
    const channel = supabase
      .channel(`room:${roomId}`, {
        config: {
          broadcast: { self: true },
          presence: { key: currentPlayerId || 'anonymous' },
        },
      })
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'rooms',
          filter: `id=eq.${roomId}`,
        },
        (payload) => {
          logger.debug('[useRoom] Realtime update received:', payload.eventType);
          if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
            setRoom(mapDbToRoom(payload.new as DbRoom));
          } else if (payload.eventType === 'DELETE') {
            setRoom(null);
          }
        }
      )
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        logger.debug('[useRoom] Presence sync:', state);
      })
      .on('presence', { event: 'join' }, ({ key }) => {
        logger.debug('[useRoom] Player joined presence:', key);
      })
      .on('presence', { event: 'leave' }, async ({ key }) => {
        logger.debug('[useRoom] Player left presence:', key);

        // Auto-remove player who disconnected (unless they're just refreshing)
        if (room && key && key !== 'anonymous') {
          const playerExists = room.players.some(p => p.id === key);

          if (playerExists) {
            logger.debug('[useRoom] Auto-removing disconnected player:', key);

            // Wait a bit to allow for quick reconnections (e.g., page refresh)
            setTimeout(async () => {
              try {
                // Check if player is still absent
                const currentState = channel.presenceState();
                const stillDisconnected = !Object.keys(currentState).includes(key);

                if (stillDisconnected && room) {
                  // Get latest room state
                  const latestRoom = await roomApi.getRoom(roomId);

                  // Check if player is still in the room
                  const playerStillExists = latestRoom.players.some(p => p.id === key);

                  if (playerStillExists) {
                    // Remove player from room
                    const updatedRoom = {
                      ...latestRoom,
                      players: latestRoom.players.filter(p => p.id !== key),
                    };

                    // If the disconnected player was the host, reassign host
                    if (latestRoom.hostId === key && updatedRoom.players.length > 0) {
                      const newHost = updatedRoom.players[0];
                      updatedRoom.hostId = newHost.id;
                      updatedRoom.players = updatedRoom.players.map(p =>
                        p.id === newHost.id ? { ...p, isHost: true } : p
                      );
                      logger.debug('[useRoom] Reassigned host to:', newHost.name);
                    }

                    await roomApi.updateRoom(updatedRoom);
                  }
                }
              } catch (err) {
                logger.error('[useRoom] Failed to auto-remove player:', err);
              }
            }, 5000); // 5 second grace period for reconnection
          }
        }
      })
      .subscribe((status, err) => {
        logger.debug('[useRoom] Subscription status:', status);
        if (err) {
          logger.error('[useRoom] Subscription error:', err);
        }

        // Track presence for current player
        if (status === 'SUBSCRIBED' && currentPlayerId) {
          channel.track({
            online_at: new Date().toISOString(),
            player_id: currentPlayerId,
          });
        }
      });

    return () => {
      logger.debug('[useRoom] Unsubscribing from channel');
      if (currentPlayerId) {
        channel.untrack();
      }
      channel.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, currentPlayerId]);

  return {
    room,
    loading,
    error,
  };
}
