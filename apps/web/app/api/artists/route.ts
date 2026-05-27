import { NextRequest, NextResponse } from 'next/server';
import { getArtists } from '../../../lib/db';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const genre = searchParams.get('genre') || undefined;
  const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
  const search = searchParams.get('search') || undefined;

  if (SUPABASE_URL) {
    try {
      const { createServerSupabaseClient } = await import('../../../lib/supabase');
      const supabase = await createServerSupabaseClient();

      let query = supabase
        .from('artists')
        .select('*')
        .order('followers', { ascending: false });

      if (genre) query = query.eq('genre', genre);
      if (search) query = query.ilike('name', `%${search}%`);
      if (limit) query = query.limit(limit);

      const { data, error } = await query;
      if (error) throw error;

      return NextResponse.json({ artists: data ?? [], total: data?.length ?? 0 });
    } catch (err) {
      console.error('[/api/artists] Supabase error, falling back:', err);
    }
  }

  // Fallback: in-memory mock DB
  let artists = getArtists({ genre, limit });
  if (search) {
    artists = artists.filter(a =>
      a.name.toLowerCase().includes(search.toLowerCase())
    );
  }
  return NextResponse.json({ artists, total: artists.length });
}
