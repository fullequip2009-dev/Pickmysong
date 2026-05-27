import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { getSongs, createSong } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const genre = searchParams.get('genre') || undefined;
  const limit = parseInt(searchParams.get('limit') || '50');
  const offset = parseInt(searchParams.get('offset') || '0');

  try {
    // Try Supabase first
    const supabase = await createServerSupabaseClient();
    let query = supabase
      .from('songs')
      .select('*')
      .order('votes', { ascending: false })
      .range(offset, offset + limit - 1);

    if (genre && genre !== 'Todos') {
      query = query.ilike('genre', `%${genre}%`);
    }

    const { data, error, count } = await query;

    if (!error && data) {
      // Map DB columns to app types
      const songs = data.map((s) => ({
        id: s.id,
        title: s.title,
        artist: s.artist,
        genre: s.genre,
        bpm: s.bpm,
        votes: s.votes,
        plays: s.plays,
        cover: s.cover,
        color: s.color,
        trend: s.trend,
        duration: s.duration,
        createdAt: s.created_at,
        updatedAt: s.updated_at,
      }));
      return NextResponse.json({ data: songs, total: count ?? songs.length });
    }
  } catch {
    // Fall through to mock DB
  }

  // Fallback: in-memory mock DB
  const result = getSongs({ genre, limit, offset });
  return NextResponse.json(result);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Try Supabase first
    try {
      const supabase = await createServerSupabaseClient();
      const { data, error } = await supabase
        .from('songs')
        .insert({
          title: body.title,
          artist: body.artist,
          genre: body.genre || 'Electronic',
          bpm: body.bpm || 120,
          cover: body.cover || '🎵',
          color: body.color || 'from-purple-600 to-pink-600',
        })
        .select()
        .single();

      if (!error && data) {
        return NextResponse.json(data, { status: 201 });
      }
    } catch {
      // Fall through to mock DB
    }

    // Fallback: in-memory mock DB
    const song = createSong(body);
    return NextResponse.json(song, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
