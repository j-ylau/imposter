-- Grant permissions for atomic game start function
grant execute on function public.start_game_atomic(text, jsonb, text) to authenticated, anon;
