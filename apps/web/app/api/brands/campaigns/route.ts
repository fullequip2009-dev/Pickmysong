import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET /api/brands/campaigns?brand_id=xxx - List campaigns for a brand
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const brandId = searchParams.get('brand_id');

    let query = supabaseAdmin
      .from('brand_campaigns')
      .select('*, brands(name, logo_url)')
      .order('created_at', { ascending: false });

    if (brandId) query = query.eq('brand_id', brandId);

    const { data, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ campaigns: data || [] });
  } catch (error) {
    console.error('GET campaigns error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// POST /api/brands/campaigns - Create a new campaign (Brand Beat)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { brand_id, name, description, budget_credits, start_date, end_date, target_venues, promo_codes } = body;

    if (!brand_id || !name || !budget_credits) {
      return NextResponse.json({ error: 'brand_id, name and budget_credits required' }, { status: 400 });
    }

    const { data: campaign, error: campaignErr } = await supabaseAdmin
      .from('brand_campaigns')
      .insert({
        brand_id,
        name,
        description,
        budget_credits,
        spent_credits: 0,
        start_date,
        end_date,
        target_venues: target_venues || [],
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (campaignErr) return NextResponse.json({ error: campaignErr.message }, { status: 500 });

    // If promo codes are defined, create them
    if (promo_codes && promo_codes.length > 0 && campaign) {
      const codes = promo_codes.map((code: { code: string; discount_credits?: number; max_uses?: number; expires_at?: string }) => ({
        campaign_id: campaign.id,
        brand_id,
        code: code.code,
        discount_credits: code.discount_credits || 0,
        max_uses: code.max_uses || 100,
        used_count: 0,
        expires_at: code.expires_at || end_date,
        created_at: new Date().toISOString(),
      }));
      await supabaseAdmin.from('promo_codes').insert(codes);
    }

    return NextResponse.json({ campaign }, { status: 201 });
  } catch (error) {
    console.error('POST campaigns error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// PATCH /api/brands/campaigns - Update campaign status
export async function PATCH(request: Request) {
  try {
    const { campaign_id, status, budget_credits, end_date } = await request.json();

    if (!campaign_id) return NextResponse.json({ error: 'campaign_id required' }, { status: 400 });

    const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };

    if (status) updateData.status = status;
    if (budget_credits !== undefined) updateData.budget_credits = budget_credits;
    if (end_date) updateData.end_date = end_date;

    const { data, error } = await supabaseAdmin
      .from('brand_campaigns')
      .update(updateData)
      .eq('id', campaign_id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ campaign: data });
  } catch (error) {
    console.error('PATCH campaigns error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
