-- Create rooms table
create table if not exists public.rooms (
  id text primary key,
  word text not null,
  theme text not null,
  phase text not null,
  players jsonb not null default '[]'::jsonb,
  clues jsonb not null default '[]'::jsonb,
  votes jsonb not null default '[]'::jsonb,
  imposter_id text,
  host_id text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Create index for faster lookups
create index if not exists rooms_created_at_idx on public.rooms(created_at);

-- Enable Row Level Security
alter table public.rooms enable row level security;

-- Allow anyone to read rooms (public game)
create policy "Anyone can read rooms"
  on public.rooms
  for select
  using (true);

-- Allow anyone to insert rooms (create game)
create policy "Anyone can create rooms"
  on public.rooms
  for insert
  with check (true);

-- Allow anyone to update rooms (join game, submit clues, etc)
create policy "Anyone can update rooms"
  on public.rooms
  for update
  using (true);

-- Allow anyone to delete old rooms (cleanup)
create policy "Anyone can delete rooms"
  on public.rooms
  for delete
  using (true);

-- Create function to update updated_at timestamp
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create trigger to auto-update updated_at
create trigger update_rooms_updated_at
  before update on public.rooms
  for each row
  execute function public.update_updated_at_column();

-- Enable realtime for the rooms table
alter publication supabase_realtime add table public.rooms;
