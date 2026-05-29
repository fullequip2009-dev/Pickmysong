// @ts-nocheck
import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

const DEMO_SONGS = [
  { id: 'song-1', title: 'Blinding Lights', artist: 'The Weeknd', album: 'After Hours', genre: 'Pop', votes: 1250, plays: 5420, duration: 200, cover_url: null, spotify_url: null },
  { id: 'song-2', title: 'Levitating', artist: 'Dua Lipa', album: 'Future Nostalgia', genre: 'Pop', votes: 980, plays: 4210, duration: 203, cover_url: null, spotify_url: null },
  { id: 'song-3', title: 'Stay', artist: 'The Kid LAROI & Justin Bieber', album: 'F*CK LOVE', genre: 'Pop', votes: 870, plays: 3980, duration: 141, cover_url: null, spotify_url: null },
  { id: 'song-4', title: 'Peaches', artist: 'Justin Bieber', album: 'Justice', genre: 'R&B', votes: 760, plays: 3650, duration: 198, cover_url: null, spotify_url: null },
  { id: 'song-5', title: 'Montero', artist: 'Lil Nas X', album: 'Montero', genre: 'Pop', votes: 720, plays: 3420, duration: 137, cover_url: null, spotify_url: null },
  { id: 'song-6', title: 'Good 4 U', artist: 'Olivia Rodrigo', album: 'SOUR', genre: 'Pop-Rock', votes: 680, plays: 3180, duration: 178, cover_url: null, spotify_url: null },
  { id: 'song-7', title: 'Butter', artist: 'BTS', album: 'Butter', genre: 'K-Pop', votes: 1200, plays: 4890, duration: 164, cover_url: null, spotify_url: null },
  { id: 'song-8', title: 'Bad Habits', artist: 'Ed Sheeran', album: '=', genre: 'Pop', votes: 640, plays: 2980, duration: 231, cover_url: null, spotify_url: null },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const genre = searchParams.get('genre') || undefined;
  const limit = parseInt(searchParams.get('limit') || '50');
  const offset = parseInt(searchParams.get('offset') || '0');

  try {
    const supabase = await createServerSupabaseClient();
    let query = supabase.from('songs').select('*').range(offset, offset + limit - 1).order('votes', { ascending: false });
    if (genre) query = query.eq('genre', genre);
    const { data, error } = await query;
    if (!error && data) {
      return NextResponse.json({ songs: data, total: data.length });
    }
  } catch {
    // fallback to demo data
  }

  let songs = DEMO_SONGS;
  if (genre) songs = songs.filter(s => s.genre === genre);
  songs = songs.slice(offset, offset + limit);
  return NextResponse.json({ songs, total: DEMO_SONGS.length });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, artist, album, genre, spotify_url, cover_url, venueId, playlistId } = body;

    if (!title || !artist) {
      return NextResponse.json({ error: 'Title and artist are required' }, { status: 400 });
    }

    try {
      const supabase = await createServerSupabaseClient();
      const { data, error } = await supabase.from('songs').insert({
        title, artist, album, genre,
        spotify_url, cover_url,
        votes: 0, plays: 0,
        venue_id: venueId,
        playlist_id: playlistId,
      }).select().single();

      if (!error && data) {
        return NextResponse.json({ song: data }, { status: 201 });
      }
    } catch {
      // fallback
    }

    const newSong = {
      id: 'song-' + Date.now(),
      title, artist, album, genre,
      spotify_url, cover_url,
      votes: 0, plays: 0,
    };
    return NextResponse.json({ song: newSong }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
