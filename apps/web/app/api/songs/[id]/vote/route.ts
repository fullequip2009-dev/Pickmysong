// @ts-nocheck
import { NextResponse } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const songId = params.id;

  let body: any = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  if (!SUPABASE_URL) {
    return NextResponse.json({ error: 'Backend no configurado' }, { status: 503 });
  }

  try {
    const { createServerSupabaseClient } = await import('../../../../../lib/supabase');
    const supabase = await createServerSupabaseClient();

    // Read current vote count
    const { data: song, error: readError } = await supabase
      .from('songs')
      .select('id, votes')
      .eq('id', songId)
      .single();

    if (readError || !song) {
      return NextResponse.json({ error: 'Canción no encontrada' }, { status: 404 });
    }

    const newVotes = (song.votes ?? 0) + 1;

    // Increment the song's vote counter in the database
    const { data: updated, error: updateError } = await supabase
      .from('songs')
      .update({ votes: newVotes })
      .eq('id', songId)
      .select('id, votes')
      .single();

    if (updateError) {
      console.error('[/api/songs/[id]/vote] update error:', updateError);
      return NextResponse.json({ error: 'No se pudo registrar el voto', details: updateError.message }, { status: 500 });
    }

    // Best-effort: log who voted to build community / gamification.
    // Requires an authenticated session; if missing or blocked by RLS, the counter still works.
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const voterId = user?.id ?? body?.userId ?? null;
      if (user?.id) {
        await supabase.from('votes').insert({ userId: user.id, songId });
      }
    } catch (logErr) {
      console.warn('[/api/songs/[id]/vote] could not log individual vote:', logErr);
    }

    return NextResponse.json({ success: true, id: songId, votes: updated?.votes ?? newVotes });
  } catch (err: any) {
    console.error('[/api/songs/[id]/vote] error:', err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
