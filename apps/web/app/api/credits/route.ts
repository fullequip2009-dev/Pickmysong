// @ts-nocheck
// GET  /api/credits        — Issue #10: Balance de créditos del usuario
// POST /api/credits        — Simular compra (Stripe webhook en producción)
import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

// Credit packs available for purchase
const CREDIT_PACKS = [
  { id: 'pack_10',  credits: 10,  price: 0.99,  label: '10 créditos' },
  { id: 'pack_50',  credits: 50,  price: 3.99,  label: '50 créditos' },
  { id: 'pack_100', credits: 100, price: 6.99,  label: '100 créditos' },
  { id: 'pack_250', credits: 250, price: 14.99, label: '250 créditos' },
];

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get balance from view
    const { data: balanceData } = await supabase
      .from('credit_balances')
      .select('balance')
      .eq('user_id', user.id)
      .single();

    // Get transaction history
    const { data: history } = await supabase
      .from('credits_log')
      .select('id, amount, type, reference, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50);

    return NextResponse.json({
      balance: balanceData?.balance ?? 0,
      history: history ?? [],
      packs: CREDIT_PACKS,
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  // In production this would be triggered by Stripe webhook after payment
  // For MVP: simulate purchase directly
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { pack_id } = body;
    const pack = CREDIT_PACKS.find(p => p.id === pack_id);
    if (!pack) {
      return NextResponse.json({ error: 'Pack not found' }, { status: 404 });
    }

    // Insert credit log entry
    const { error } = await supabase
      .from('credits_log')
      .insert({
        user_id: user.id,
        amount: pack.credits,
        type: 'purchase',
        reference: pack_id,
      });

    if (error) throw error;

    // Get updated balance
    const { data: balanceData } = await supabase
      .from('credit_balances')
      .select('balance')
      .eq('user_id', user.id)
      .single();

    return NextResponse.json({
      success: true,
      credits_added: pack.credits,
      new_balance: balanceData?.balance ?? pack.credits,
      pack,
    }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
