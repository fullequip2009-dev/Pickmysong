// POST /api/queue — Issue #7 + #24: Puja de canción con lógica de cola
// GET /api/queue?venue_id=xxx — Cola actual del local
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

const BID_COST = 1; // 1 crédito por puja
const REPEAT_BLOCK_HOURS = 4;

function getServerClient() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
}

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const venueId = searchParams.get('venue_id');
  if (!venueId) return NextResponse.json({ error: 'venue_id required' }, { status: 400 });
  try {
    const { data, error } = await supabaseAdmin
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
    // Si la cola está vacía, devolver canciones mock para demo
    const queueData = data && data.length > 0 ? data : [
      {
        id: 'mock_1',
        bids: 15,
        position: 1,
        created_at: new Date().toISOString(),
        songs: {
          id: 'song_1',
          title: 'Bohemian Rhapsody',
          artist: 'Queen',
          cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300',
          duration: 354
        },
        profiles: { id: 'user_1', name: 'Demo User', avatar: '' }
      },
      {
        id: 'mock_2',
        bids: 12,
        position: 2,
        created_at: new Date().toISOString(),
        songs: {
          id: 'song_2',
          title: 'Blinding Lights',
          artist: 'The Weeknd',
          cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300',
          duration: 200
        },
        profiles: { id: 'user_2', name: 'Music Lover', avatar: '' }
      },
      {
        id: 'mock_3',
        bids: 8,
        position: 3,
        created_at: new Date().toISOString(),
        songs: {
          id: 'song_3',
          title: 'Hotel California',
          artist: 'Eagles',
          cover: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300',
          duration: 391
        },
        profiles: { id: 'user_3', name: 'Rock Fan', avatar: '' }
      },
      {
        id: 'mock_4',
        bids: 5,
        position: 4,
        created_at: new Date().toISOString(),
        songs: {
          id: 'song_4',
          title: 'Starboy',
          artist: 'The Weeknd',
          cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300',
          duration: 230
        },
        profiles: { id: 'user_4', name: 'Party Starter', avatar: '' }
      }
    ];
    return NextResponse.json({ queue: queueData ?? [] });  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = getServerClient();
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
    const { data: creditData } = await supabaseAdmin
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
    const { data: recent } = await supabaseAdmin
      .from('queue')
      .select('id')
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
    const { data: existing } = await supabaseAdmin
      .from('queue')
      .select('id, bids')
      .eq('venue_id', venue_id)
      .eq('song_id', song_id)
      .eq('played', false)
      .single();
    // 5. Deduct credits atomically
    const { error: creditError } = await supabaseAdmin
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
      const { data: updated, error: updateError } = await supabaseAdmin
        .from('queue')
        .update({ bids: existing.bids + bids })
        .eq('id', existing.id)
        .select()
        .single();
      if (updateError) throw updateError;
      queueEntry = updated;
    } else {
      const { count } = await supabaseAdmin
        .from('queue')
        .select('*', { count: 'exact', head: true })
        .eq('venue_id', venue_id)
        .eq('played', false);
      const { data: inserted, error: insertError } = await supabaseAdmin
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
