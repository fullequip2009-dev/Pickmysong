-- ============================================================
-- Pickmysong — Initial Schema Migration
-- Run in Supabase SQL Editor or via: supabase db push
-- ============================================================

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ─── profiles (extends auth.users) ───────────────────────────
create table public.profiles (
  id          uuid references auth.users(id) on delete cascade primary key,
  handle      text unique not null,
  name        text not null,
  avatar      text default '🎧',
  bio         text,
  plan        text not null default 'free' check (plan in ('free', 'premium')),
  role        text not null default 'user' check (role in ('user', 'venue_owner', 'artist', 'admin')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ─── songs ────────────────────────────────────────────────────
create table public.songs (
  id          uuid primary key default uuid_generate_v4(),
  title       text not null,
  artist      text not null,
  genre       text not null,
  bpm         integer not null default 120,
  votes       integer not null default 0,
  plays       integer not null default 0,
  cover       text not null default '🎵',
  color       text not null default 'from-purple-600 to-pink-600',
  trend       integer not null default 0,
  duration    text,
  release_year integer,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ─── artists ──────────────────────────────────────────────────
create table public.artists (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  handle      text unique not null,
  bio         text not null default '',
  genre       text not null,
  followers   integer not null default 0,
  songs_count integer not null default 0,
  plays       integer not null default 0,
  avatar      text not null default '🎤',
  color       text not null default 'from-purple-600 to-pink-600',
  verified    boolean not null default false,
  trending    boolean not null default false,
  created_at  timestamptz not null default now()
);

-- ─── venues ───────────────────────────────────────────────────
create table public.venues (
  id                uuid primary key default uuid_generate_v4(),
  owner_id          uuid references public.profiles(id),
  name              text not null,
  type              text not null check (type in ('Club', 'Bar', 'Rave', 'Lounge', 'Restaurant', 'Festival')),
  city              text not null,
  address           text not null,
  vibe              text not null,
  capacity          integer not null default 100,
  current_visitors  integer not null default 0,
  rating            numeric(3,1) not null default 0,
  open              boolean not null default false,
  current_song_id   uuid references public.songs(id),
  avatar            text not null default '🏪',
  color             text not null default 'from-purple-900 to-black',
  tags              text[] not null default '{}',
  created_at        timestamptz not null default now()
);

-- ─── playlists ────────────────────────────────────────────────
create table public.playlists (
  id          uuid primary key default uuid_generate_v4(),
  creator_id  uuid references public.profiles(id),
  venue_id    uuid references public.venues(id),
  name        text not null,
  description text not null default '',
  cover       text not null default '🎶',
  color       text not null default 'from-purple-900 to-black',
  tags        text[] not null default '{}',
  likes       integer not null default 0,
  public      boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ─── playlist_songs (join table) ─────────────────────────────
create table public.playlist_songs (
  playlist_id uuid references public.playlists(id) on delete cascade,
  song_id     uuid references public.songs(id) on delete cascade,
  position    integer not null default 0,
  added_at    timestamptz not null default now(),
  primary key (playlist_id, song_id)
);

-- ─── votes ────────────────────────────────────────────────────
create table public.votes (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references public.profiles(id) on delete cascade,
  song_id     uuid references public.songs(id) on delete cascade,
  created_at  timestamptz not null default now(),
  unique(user_id, song_id)
);

-- ─── follows (user follows artist) ───────────────────────────
create table public.follows (
  user_id     uuid references public.profiles(id) on delete cascade,
  artist_id   uuid references public.artists(id) on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (user_id, artist_id)
);

-- ─── playlist_likes ───────────────────────────────────────────
create table public.playlist_likes (
  user_id     uuid references public.profiles(id) on delete cascade,
  playlist_id uuid references public.playlists(id) on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (user_id, playlist_id)
);

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================

alter table public.profiles        enable row level security;
alter table public.songs           enable row level security;
alter table public.artists         enable row level security;
alter table public.venues          enable row level security;
alter table public.playlists       enable row level security;
alter table public.playlist_songs  enable row level security;
alter table public.votes           enable row level security;
alter table public.follows         enable row level security;
alter table public.playlist_likes  enable row level security;

-- profiles: public read, own write
create policy "profiles_read_all"    on public.profiles for select using (true);
create policy "profiles_insert_own"  on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own"  on public.profiles for update using (auth.uid() = id);
create policy "profiles_delete_own"  on public.profiles for delete using (auth.uid() = id);

-- songs: public read, auth insert (admin/venue owner in real app)
create policy "songs_read_all"    on public.songs for select using (true);
create policy "songs_insert_auth" on public.songs for insert with check (auth.role() = 'authenticated');
create policy "songs_update_auth" on public.songs for update using (auth.role() = 'authenticated');

-- artists: public read
create policy "artists_read_all" on public.artists for select using (true);
create policy "artists_write_auth" on public.artists for all using (auth.role() = 'authenticated');

-- venues: public read
create policy "venues_read_all" on public.venues for select using (true);
create policy "venues_write_owner" on public.venues for all using (auth.uid() = owner_id);

-- playlists: public read for public playlists, owner write
create policy "playlists_read_public"  on public.playlists for select using (public = true or auth.uid() = creator_id);
create policy "playlists_insert_auth"  on public.playlists for insert with check (auth.role() = 'authenticated');
create policy "playlists_update_own"   on public.playlists for update using (auth.uid() = creator_id);
create policy "playlists_delete_own"   on public.playlists for delete using (auth.uid() = creator_id);

-- playlist_songs: read if playlist is public
create policy "playlist_songs_read"   on public.playlist_songs for select using (true);
create policy "playlist_songs_write"  on public.playlist_songs for all using (auth.role() = 'authenticated');

-- votes: auth only, own votes
create policy "votes_read_all"    on public.votes for select using (true);
create policy "votes_insert_own"  on public.votes for insert with check (auth.uid() = user_id);
create policy "votes_delete_own"  on public.votes for delete using (auth.uid() = user_id);

-- follows: auth only
create policy "follows_read_all"    on public.follows for select using (true);
create policy "follows_insert_own"  on public.follows for insert with check (auth.uid() = user_id);
create policy "follows_delete_own"  on public.follows for delete using (auth.uid() = user_id);

-- playlist_likes: auth only
create policy "playlist_likes_read_all"    on public.playlist_likes for select using (true);
create policy "playlist_likes_insert_own"  on public.playlist_likes for insert with check (auth.uid() = user_id);
create policy "playlist_likes_delete_own"  on public.playlist_likes for delete using (auth.uid() = user_id);

-- ============================================================
-- Functions & Triggers
-- ============================================================

-- Auto-update updated_at
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger songs_updated_at     before update on public.songs     for each row execute procedure public.handle_updated_at();
create trigger playlists_updated_at before update on public.playlists for each row execute procedure public.handle_updated_at();

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, handle, name, avatar)
  values (
    new.id,
    '@' || lower(replace(coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)), ' ', '')),
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'avatar_url', '🎧')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Vote toggle function (atomic increment/decrement)
create or replace function public.toggle_vote(p_song_id uuid, p_user_id uuid)
returns json language plpgsql security definer as $$
declare
  v_existing_vote uuid;
  v_vote_count integer;
begin
  select id into v_existing_vote
  from public.votes
  where song_id = p_song_id and user_id = p_user_id;

  if v_existing_vote is not null then
    -- Remove vote
    delete from public.votes where id = v_existing_vote;
    update public.songs set votes = votes - 1 where id = p_song_id;
    select votes into v_vote_count from public.songs where id = p_song_id;
    return json_build_object('votes', v_vote_count, 'userVoted', false);
  else
    -- Add vote
    insert into public.votes (user_id, song_id) values (p_user_id, p_song_id);
    update public.songs set votes = votes + 1 where id = p_song_id;
    select votes into v_vote_count from public.songs where id = p_song_id;
    return json_build_object('votes', v_vote_count, 'userVoted', true);
  end if;
end;
$$;

-- ============================================================
-- Indexes for performance
-- ============================================================

create index idx_songs_votes      on public.songs(votes desc);
create index idx_songs_genre      on public.songs(genre);
create index idx_songs_created_at on public.songs(created_at desc);
create index idx_votes_song_id    on public.votes(song_id);
create index idx_votes_user_id    on public.votes(user_id);
create index idx_follows_user_id  on public.follows(user_id);
create index idx_follows_artist_id on public.follows(artist_id);
create index idx_venues_city      on public.venues(city);
create index idx_venues_open      on public.venues(open);
