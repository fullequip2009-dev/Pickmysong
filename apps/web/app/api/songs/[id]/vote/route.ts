// @ts-nocheck
import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { voteSong } from '@/lib/db';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const songId = params.id;

  try {
    const body = await request.json().catch(() => ({}));
    const userId: string = body.userId || 'guest-' + Math.random().toString(36).slice(2, 9);

    // Try Supabase RPC (atomic toggle_vote function)
    try {
      const supabase = await createServerSupabaseClient();

      const { data, error } = await supabase.rpc('toggle_vote', {
        p_song_id: songId,
        p_user_id: userId,
      });

      if (!error && data) {
        return NextResponse.json(data);
      }
    } catch {
      // Fall through to mock DB
    }

    // Fallback: in-memory mock DB
    const result = voteSong(songId, userId);
    if (!result) {
      return NextResponse.json({ error: 'Canción no encontrada' }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
