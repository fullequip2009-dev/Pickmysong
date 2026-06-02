-- ============================================================
--  Motor de reproducción (equivale a PlaySpotifySongsJob + cola viva de 5Beats)
--  Añade el concepto "playing" a la cola, estado online/device al venue,
--  la vista ordenada y las RPC atómicas advance_queue / current_playing.
-- ============================================================

-- spotify_id en songs: necesario para reproducir en Spotify (equivale a song.spoti_id de 5Beats).
-- La tabla base no lo traía; lo añadimos aquí para alimentar la vista y la RPC de avance.
alter table public.songs
  add column if not exists spotify_id text;

-- Estado "sonando ahora" en la cola (equivale a playlist_song.playing de 5Beats)
alter table public.queue
  add column if not exists playing boolean not null default false,
  add column if not exists started_at timestamptz;

create index if not exists idx_queue_playing on public.queue (venue_id, playing);

-- Estado online/dispositivo del venue (equivale a venue.online + spoti_device_id de 5Beats)
alter table public.venues
  add column if not exists online boolean not null default false,
  add column if not exists spotify_device_id text;

-- Vista ordenada (equivale al scope :ordered de 5Beats)
create or replace view public.venue_queue_ordered as
select
  q.id, q.venue_id, q.song_id, q.user_id, q.bids, q.position,
  q.playing, q.played, q.played_at, q.started_at, q.created_at,
  s.title, s.artist, s.cover, s.duration, s.spotify_id
from public.queue q
join public.songs s on s.id = q.song_id
where q.played = false
order by q.playing desc, q.bids desc, q.created_at asc, q.position asc;

-- RPC atómica para avanzar la cola (equivale a PlaySpotifySongsJob#perform).
-- Marca la actual como played, elige la siguiente más pujada y la pone playing.
-- Devuelve la fila que debe sonar (o null si la cola está vacía).
create or replace function public.advance_queue(p_venue_id uuid)
returns public.queue
language plpgsql security definer as $$
declare
  v_next public.queue;
begin
  -- 1) la que sonaba -> played (equivale a current_song.update(playing:false, played:true))
  update public.queue
     set playing = false, played = true, played_at = now()
   where venue_id = p_venue_id and playing = true;

  -- 2) la siguiente más pujada que no se ha tocado (equivale a playlist.songs.ordered.first)
  select q.* into v_next
  from public.queue q
  where q.venue_id = p_venue_id and q.played = false and q.playing = false
  order by q.bids desc, q.created_at asc, q.position asc
  limit 1;

  if v_next.id is null then
    return null;  -- cola vacía
  end if;

  -- 3) marcarla como sonando (equivale a next_song.update(playing:true))
  update public.queue
     set playing = true, started_at = now()
   where id = v_next.id
   returning * into v_next;

  return v_next;
end; $$;

-- RPC para "now playing" persistente (equivale a venue.current_song de 5Beats)
create or replace function public.current_playing(p_venue_id uuid)
returns public.venue_queue_ordered
language sql stable as $$
  select * from public.venue_queue_ordered
  where venue_id = p_venue_id and playing = true limit 1;
$$;

-- Realtime en venues para reflejar online/device en las pantallas
alter publication supabase_realtime add table public.venues;
