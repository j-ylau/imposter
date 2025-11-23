-- Add race condition handling for game start
-- This prevents multiple simultaneous "start game" requests from causing issues

-- Create function to start game with race condition protection
create or replace function public.start_game_atomic(
  p_room_id text,
  p_players jsonb,
  p_imposter_id text
)
returns boolean as $$
declare
  v_rows_affected int;
begin
  -- Only update if room is still in lobby phase and not locked
  update public.rooms
  set
    phase = 'role',
    locked = true,
    players = p_players,
    imposter_id = p_imposter_id
  where
    id = p_room_id
    and phase = 'lobby'
    and locked = false;

  get diagnostics v_rows_affected = row_count;

  -- Return true if update was successful
  return v_rows_affected = 1;
end;
$$ language plpgsql security definer;
