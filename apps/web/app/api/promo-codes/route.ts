// @ts-nocheck
// POST /api/promo-codes/redeem — Issue #11 + #16: Canje de códigos promocionales
// GET  /api/promo-codes      — Admin: listar códigos
// POST /api/promo-codes      — Admin: crear código
import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { data, error } = await supabase
      .from('promo_codes')
      .select('*, sponsors ( name, logo )')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json({ codes: data ?? [] });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin' && profile?.role !== 'venue_owner') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { code, credits, max_uses = 1, expires_at, sponsor_id } = body;

    if (!code || !credits) {
      return NextResponse.json({ error: 'code and credits required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('promo_codes')
      .insert({ code: code.toUpperCase(), credits, max_uses, expires_at, sponsor_id, created_by: user.id })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, promo_code: data }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
