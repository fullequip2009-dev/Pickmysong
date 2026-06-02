// POST /api/songs/[id]/vote — Votar una canción = pujar por ella en la cola.
// Reescrito sobre Supabase Auth + tabla `queue` (snake_case), reemplazando el
// flujo legacy NextAuth + tabla `votes`. Equivale a "subir votos" de 5Beats,
// que aquí se modela como una puja (bids+1) en la cola del local.
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

const BID_COST = 1; // 1 crédito por voto/puja (mismo coste que /api/queue)

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

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const songId = params.id;

    // 1. Auth vía Supabase (ya no NextAuth).
    const supabase = getServerClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const { venue_id } = body as { venue_id?: string };
    if (!venue_id) {
      return NextResponse.json({ error: 'venue_id required' }, { status: 400 });
    }

    // 2. Comprobar créditos (mismo patrón que /api/queue).
    const { data: creditData } = await supabaseAdmin
      .from('credit_balances')
      .select('balance')
      .eq('user_id', user.id)
      .single();
    const balance = creditData?.balance ?? 0;
    if (balance < BID_COST) {
      return NextResponse.json({ error: 'Créditos insuficientes', balance }, { status: 402 });
    }

    // 3. Descontar crédito.
    const { error: creditError } = await supabaseAdmin.from('credits_log').insert({
      user_id: user.id,
      amount: -BID_COST,
      type: 'bid',
      reference: songId,
    });
    if (creditError) throw creditError;

    // 4. Si la canción ya está en cola sin reproducir, sube su puja; si no, insértala.
    const { data: existing } = await supabaseAdmin
      .from('queue')
      .select('id, bids')
      .eq('venue_id', venue_id)
      .eq('song_id', songId)
      .eq('played', false)
      .maybeSingle();

    let entry;
    if (existing) {
      const { data: updated, error: updateError } = await supabaseAdmin
        .from('queue')
        .update({ bids: existing.bids + 1 })
        .eq('id', existing.id)
        .select()
        .single();
      if (updateError) throw updateError;
      entry = updated;
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
          song_id: songId,
          user_id: user.id,
          bids: 1,
          position: (count ?? 0) + 1,
        })
        .select()
        .single();
      if (insertError) throw insertError;
      entry = inserted;
    }

    // Respuesta compatible con el contrato anterior: { success, votes }.
    return NextResponse.json({ success: true, id: songId, votes: entry?.bids ?? 1 });
  } catch (err) {
    console.error('[/api/songs/[id]/vote] error:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
