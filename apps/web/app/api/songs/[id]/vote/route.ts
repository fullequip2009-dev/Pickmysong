// @ts-nocheck
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const songId = params.id;

  if (!SUPABASE_URL) {
    return NextResponse.json({ error: 'Backend no configurado' }, { status: 503 });
  }

  try {
    const { createServerSupabaseClient } = await import('../../../../../lib/supabase');
    const supabase = await createServerSupabaseClient();

    // Read the song (need current votes + venueId for the vote record)
    const { data: song, error: readError } = await supabase
      .from('songs')
      .select('id, votes, venueId')
      .eq('id', songId)
      .single();

    if (readError || !song) {
      return NextResponse.json({ error: 'Canción no encontrada' }, { status: 404 });
    }

    // Resolve the authenticated user (NextAuth session exposes email; map it to users.id)
    let voter = null;
    try {
      const session = await getServerSession(authOptions);
      const email = session?.user?.email;
      if (email) {
        const { data: dbUser } = await supabase
          .from('users')
          .select('id, name, avatar')
          .eq('email', email)
          .single();
        if (dbUser) voter = dbUser;
      }
    } catch (sessErr) {
      console.warn('[/api/songs/[id]/vote] session lookup failed:', sessErr);
    }

    // Record the individual vote for community / gamification.
    // The UNIQUE(userId, songId, venueId) constraint prevents duplicate votes.
    let alreadyVoted = false;
    if (voter) {
      const voteId = 'vote_' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
      const { error: insertError } = await supabase
        .from('votes')
        .insert({
          id: voteId,
          userId: voter.id,
          songId,
          venueId: song.venueId,
          createdAt: new Date().toISOString(),
        });
      if (insertError) {
        // 23505 = unique_violation => the user already voted this song here
        if (insertError.code === '23505') {
          alreadyVoted = true;
        } else {
          console.warn('[/api/songs/[id]/vote] vote insert error:', insertError);
        }
      }
    }

    // Do not double-count if the same user is re-voting the same song.
    if (alreadyVoted) {
      return NextResponse.json({
        success: true,
        id: songId,
        votes: song.votes ?? 0,
        alreadyVoted: true,
      });
    }

    const newVotes = (song.votes ?? 0) + 1;
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

    return NextResponse.json({
      success: true,
      id: songId,
      votes: updated?.votes ?? newVotes,
      voter: voter ? { id: voter.id, name: voter.name, avatar: voter.avatar ?? null } : null,
    });
  } catch (err: any) {
    console.error('[/api/songs/[id]/vote] error:', err);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
