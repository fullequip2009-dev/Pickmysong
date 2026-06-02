// POST /api/queue/puja — Issue #7: Pujar por canción existente en la cola
// Incrementa bids de un queue_item existente y descuenta 1 crédito al usuario
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const BID_COST = 1; // 1 crédito por puja

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

export async function POST(request: Request) {
  try {
    const supabase = getServerClient();

    // 1. Auth check — si no hay sesion, permitir puja anonima limitada
    const { data: { user } } = await supabase.auth.getUser();

    const body = await request.json();
    const { venue_id, queue_item_id } = body;

    if (!venue_id || !queue_item_id) {
      return NextResponse.json(
        { error: 'venue_id and queue_item_id required' },
        { status: 400 }
      );
    }

    // 2. Fetch the queue item to verify it exists and belongs to venue
    const { data: queueItem, error: fetchError } = await supabaseAdmin
      .from('queue')
      .select('id, bids, song_id, played, venue_id')
      .eq('id', queue_item_id)
      .eq('venue_id', venue_id)
      .eq('played', false)
      .single();

    if (fetchError || !queueItem) {
      return NextResponse.json(
        { error: 'Queue item not found or already played' },
        { status: 404 }
      );
    }

    // 3. If authenticated, check and deduct credits
    if (user) {
      const { data: creditData } = await supabaseAdmin
        .from('credit_balances')
        .select('balance')
        .eq('user_id', user.id)
        .single();

      const balance = creditData?.balance ?? 0;
      if (balance < BID_COST) {
        return NextResponse.json(
          { error: 'Creditos insuficientes', balance },
          { status: 402 }
        );
      }

      // Deduct credits via log
      const { error: creditError } = await supabaseAdmin
        .from('credits_log')
        .insert({
          user_id: user.id,
          amount: -BID_COST,
          type: 'bid',
          reference: queueItem.song_id,
        });

      if (creditError) throw creditError;
    }

    // 4. Increment bids on the queue item
    const { data: updated, error: updateError } = await supabaseAdmin
      .from('queue')
      .update({ bids: queueItem.bids + 1 })
      .eq('id', queue_item_id)
      .select('id, bids, position')
      .single();

    if (updateError) throw updateError;

    return NextResponse.json(
      {
        success: true,
        queue_item: updated,
        credits_spent: user ? BID_COST : 0,
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
