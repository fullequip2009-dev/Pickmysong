// @ts-nocheck
// POST /api/queue  — Issue #7 + #24: Puja de canción con lógica de cola
// GET  /api/queue?venue_id=xxx — Cola actual del local
import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

const BID_COST = 1; // 1 crédito por puja
const REPEAT_BLOCK_HOURS = 4;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const venueId = searchParams.get('venue_id');
  if (!venueId) return NextResponse.json({ error: 'venue_id required' }, { status: 400 });

  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('queue')
      .select(`
        id, bids, position, created_at,
        songs ( id, title, artist, cover, duration ),
        profiles ( id, name, avatar )
      `)
      .eq('venue_id', venueId)
      .eq('played', false)
      .order('bids', { ascending: false })
      .order('created_at', { ascending: true })
      .limit(50);

    if (error) throw error;
    return NextResponse.json({ queue: data ?? [] });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();

    // 1. Auth check
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { venue_id, song_id, bids = 1 } = body;
    if (!venue_id || !song_id) {
      return NextResponse.json({ error: 'venue_id and song_id required' }, { status: 400 });
    }
    if (bids < 1) {
      return NextResponse.json({ error: 'bids must be >= 1' }, { status: 400 });
    }

    const totalCost = bids * BID_COST;

    // 2. Check user credits
    const { data: creditData } = await supabase
      .from('credit_balances')
      .select('balance')
      .eq('user_id', user.id)
      .single();

    const balance = creditData?.balance ?? 0;
    if (balance < totalCost) {
      return NextResponse.json(
        { error: 'Créditos insuficientes', balance },
        { status: 402 }
      );
    }

    // 3. Check 4h repeat block: same song at same venue
    const blockCutoff = new Date(Date.now() - REPEAT_BLOCK_HOURS * 60 * 60 * 1000).toISOString();
    const { data: recent } = await supabase
      .from('queue')
      .select('id, played_at, created_at')
      .eq('venue_id', venue_id)
      .eq('song_id', song_id)
      .eq('played', true)
      .gte('played_at', blockCutoff)
      .limit(1);

    if (recent && recent.length > 0) {
      return NextResponse.json(
        { error: `Esta canción ya se tocó hace menos de ${REPEAT_BLOCK_HOURS} horas` },
        { status: 409 }
      );
    }

    // 4. Check if song already in unplayed queue — increase bids instead
    const { data: existing } = await supabase
      .from('queue')
      .select('id, bids')
      .eq('venue_id', venue_id)
      .eq('song_id', song_id)
      .eq('played', false)
      .single();

    // 5. Deduct credits atomically
    const { error: creditError } = await supabase
      .from('credits_log')
      .insert({
        user_id: user.id,
        amount: -totalCost,
        type: 'bid',
        reference: song_id,
      });

    if (creditError) throw creditError;

    let queueEntry;

    if (existing) {
      // Increment bids on existing entry
      const { data: updated, error: updateError } = await supabase
        .from('queue')
        .update({ bids: existing.bids + bids })
        .eq('id', existing.id)
        .select()
        .single();

      if (updateError) throw updateError;
      queueEntry = updated;
    } else {
      // Get next position
      const { count } = await supabase
        .from('queue')
        .select('*', { count: 'exact', head: true })
        .eq('venue_id', venue_id)
        .eq('played', false);

      const { data: inserted, error: insertError } = await supabase
        .from('queue')
        .insert({
          venue_id,
          song_id,
          user_id: user.id,
          bids,
          position: (count ?? 0) + 1,
        })
        .select()
        .single();

      if (insertError) throw insertError;
      queueEntry = inserted;
    }

    return NextResponse.json({ success: true, entry: queueEntry, credits_spent: totalCost }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
