-- Remove clues column from rooms table
-- Game flow simplified: lobby -> role -> vote -> results
-- No longer using clue submission phase

alter table public.rooms drop column if exists clues;
