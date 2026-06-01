// @ts-nocheck
// POST /api/promo-codes/redeem — Issue #11: Canje de código promocional
import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { code } = body;
    if (!code) return NextResponse.json({ error: 'code required' }, { status: 400 });

    // Find the promo code
    const { data: promoCode, error: codeError } = await supabase
      .from('promo_codes')
      .select('*')
      .eq('code', code.trim().toUpperCase())
      .eq('active', true)
      .single();

    if (codeError || !promoCode) {
      return NextResponse.json({ error: 'Código no válido o expirado' }, { status: 404 });
    }

    // Check expiry
    if (promoCode.expires_at && new Date(promoCode.expires_at) < new Date()) {
      return NextResponse.json({ error: 'Código expirado' }, { status: 410 });
    }

    // Check max uses
    if (promoCode.uses >= promoCode.max_uses) {
      return NextResponse.json({ error: 'Código ya agotado' }, { status: 409 });
    }

    // Check if user already redeemed
    const { data: existing } = await supabase
      .from('promo_redemptions')
      .select('id')
      .eq('user_id', user.id)
      .eq('code_id', promoCode.id)
      .single();

    if (existing) {
      return NextResponse.json({ error: 'Ya canjeaste este código' }, { status: 409 });
    }

    // Record redemption
    const { error: redeemError } = await supabase
      .from('promo_redemptions')
      .insert({ user_id: user.id, code_id: promoCode.id });

    if (redeemError) throw redeemError;

    // Increment uses count
    await supabase
      .from('promo_codes')
      .update({ uses: promoCode.uses + 1 })
      .eq('id', promoCode.id);

    // Deactivate if max uses reached
    if (promoCode.uses + 1 >= promoCode.max_uses) {
      await supabase
        .from('promo_codes')
        .update({ active: false })
        .eq('id', promoCode.id);
    }

    // Add credits to user
    const { error: creditError } = await supabase
      .from('credits_log')
      .insert({
        user_id: user.id,
        amount: promoCode.credits,
        type: 'promo_code',
        reference: promoCode.code,
      });

    if (creditError) throw creditError;

    // Get new balance
    const { data: balanceData } = await supabase
      .from('credit_balances')
      .select('balance')
      .eq('user_id', user.id)
      .single();

    return NextResponse.json({
      success: true,
      credits_earned: promoCode.credits,
      new_balance: balanceData?.balance ?? promoCode.credits,
      sponsor: promoCode.sponsor_id ? { id: promoCode.sponsor_id } : null,
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
