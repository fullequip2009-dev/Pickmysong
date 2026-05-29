// @ts-nocheck
import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

const DEMO_SONGS = [
  { id: 'song-1', title: 'Blinding Lights', artist: 'The Weeknd', album: 'After Hours', genre: 'Pop', votes: 234, plays: 1820, duration: 200, cover_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300' },
  { id: 'song-2', title: 'Levitating', artist: 'Dua Lipa', album: 'Future Nostalgia', genre: 'Pop', votes: 198, plays: 1540, duration: 203, cover_url: 'https://images.unsplash.com/photo-1571266752821-e2ceec3e9a92?w=300' },
  { id: 'song-3', title: 'Stay', artist: 'The Kid LAROI & Justin Bieber', album: 'F*CK LOVE 3', genre: 'Hip-Hop', votes: 187, plays: 1320, duration: 141, cover_url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300' },
  { id: 'song-4', title: 'Peaches', artist: 'Justin Bieber', album: 'Justice', genre: 'R&B', votes: 156, plays: 1150, duration: 198, cover_url: 'https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=300' },
  { id: 'song-5', title: 'Montero', artist: 'Lil Nas X', album: 'Montero', genre: 'Pop', votes: 143, plays: 980, duration: 137, cover_url: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=300' },
  { id: 'song-6', title: 'Good 4 U', artist: 'Olivia Rodrigo', album: 'SOUR', genre: 'Pop-Rock', votes: 132, plays: 920, duration: 178, cover_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300' },
  { id: 'song-7', title: 'Butter', artist: 'BTS', album: 'Butter', genre: 'K-Pop', votes: 120, plays: 850, duration: 164, cover_url: 'https://images.unsplash.com/photo-1571266752821-e2ceec3e9a92?w=300' },
  { id: 'song-8', title: 'Bad Habits', artist: 'Ed Sheeran', album: '=', genre: 'Pop', votes: 110, plays: 780, duration: 231, cover_url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300' },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const genre = searchParams.get('genre') || undefined;
  const limit = parseInt(searchParams.get('limit') || '50');
  const offset = parseInt(searchParams.get('offset') || '0');

  try {
    const supabase = await createServerSupabaseClient();
    let query = supabase
      .from('songs')
      .select('*')
      .order('votes', { ascending: false })
      .range(offset, offset + limit - 1);

    if (genre && genre !== 'Todos') {
      query = query.ilike('genre', `%${genre}%`);
    }

    const { data, error } = await query;

    if (error) throw error;
    if (data && data.length > 0) {
