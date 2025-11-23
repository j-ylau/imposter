// ALL realtime multiplayer logic in one file

import { useEffect, useState, useCallback } from 'react';
import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from './supabase';
import type { Room } from '@/schema';
import {
  AppError,
  RoomNotFoundError,
  RoomCreationFailedError,
  RoomUpdateFailedError,
  DatabaseReadError,
  DatabaseWriteError,
  handleError,
} from './error';

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
        players: room.players,
        clues: room.clues,
        votes: room.votes,
        imposter_id: room.imposterId,
        host_id: room.hostId,
        created_at: new Date(room.createdAt).toISOString(),
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
        players: room.players,
        clues: room.clues,
        votes: room.votes,
        imposter_id: room.imposterId,
        host_id: room.hostId,
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
};

// Map database row to Room type
function mapDbToRoom(data: any): Room {
  return {
    id: data.id,
    word: data.word,
    theme: data.theme,
    phase: data.phase,
    players: data.players || [],
    clues: data.clues || [],
    votes: data.votes || [],
    imposterId: data.imposter_id,
    hostId: data.host_id,
    createdAt: new Date(data.created_at).getTime(),
  };
}

// Hook to subscribe to room updates
export function useRoom(roomId: string) {
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AppError | null>(null);

  useEffect(() => {
    if (!roomId) return;

    let channel: RealtimeChannel;

    // Load initial room data
    const loadRoom = async () => {
      try {
        const roomData = await roomApi.getRoom(roomId);
        setRoom(roomData);
        setError(null);
      } catch (err) {
        setError(handleError(err));
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadRoom();

    // Subscribe to realtime updates
    channel = supabase
      .channel(`room:${roomId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'rooms',
          filter: `id=eq.${roomId}`,
        },
        (payload) => {
          if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
            setRoom(mapDbToRoom(payload.new));
          } else if (payload.eventType === 'DELETE') {
            setRoom(null);
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [roomId]);

  return {
    room,
    loading,
    error,
  };
}
