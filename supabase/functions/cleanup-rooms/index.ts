// Deno edge function to clean up inactive/expired rooms
// Runs every 10 minutes via cron

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

Deno.serve(async (req) => {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Delete rooms that meet ANY of these conditions:
    // 1. Expired (expires_at < now)
    // 2. No players (players array is empty)
    // 3. Game ended over 10 minutes ago (phase = 'results' AND updated_at < now - 10 minutes)

    const { data: expiredRooms, error: expiredError } = await supabase
      .from('rooms')
      .delete()
      .lt('expires_at', new Date().toISOString())
      .select('id');

    if (expiredError) {
      console.error('Error deleting expired rooms:', expiredError);
    }

    // Delete rooms with no players
    const { data: allRooms } = await supabase
      .from('rooms')
      .select('id, players');

    if (allRooms) {
      const emptyRoomIds = allRooms
        .filter((room: any) => !room.players || room.players.length === 0)
        .map((room: any) => room.id);

      if (emptyRoomIds.length > 0) {
        const { error: emptyError } = await supabase
          .from('rooms')
          .delete()
          .in('id', emptyRoomIds);

        if (emptyError) {
          console.error('Error deleting empty rooms:', emptyError);
        }
      }
    }

    // Delete old completed games (results phase for > 10 minutes)
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    const { data: oldGames, error: oldError } = await supabase
      .from('rooms')
      .delete()
      .eq('phase', 'results')
      .lt('updated_at', tenMinutesAgo)
      .select('id');

    if (oldError) {
      console.error('Error deleting old games:', oldError);
    }

    const totalDeleted =
      (expiredRooms?.length || 0) +
      (allRooms?.filter((r: any) => !r.players || r.players.length === 0).length || 0) +
      (oldGames?.length || 0);

    console.log(`Cleanup complete. Deleted ${totalDeleted} rooms.`);

    return new Response(
      JSON.stringify({
        success: true,
        deleted: totalDeleted,
        expired: expiredRooms?.length || 0,
        empty: allRooms?.filter((r: any) => !r.players || r.players.length === 0).length || 0,
        oldGames: oldGames?.length || 0,
      }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Cleanup error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
