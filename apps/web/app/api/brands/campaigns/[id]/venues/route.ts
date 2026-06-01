import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET /api/brands/campaigns/[id]/venues - Listar locales asociados a una campaña
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { data, error } = await supabaseAdmin
      .from('campaign_venues')
      .select('venue_id, venues(*)')
      .eq('campaign_id', params.id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ venues: data || [] });
  } catch (error) {
    console.error('GET campaign venues error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// POST /api/brands/campaigns/[id]/venues - Asociar un local a una campaña
export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { venue_id } = body;

    if (!venue_id) {
      return NextResponse.json({ error: 'venue_id required' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('campaign_venues')
      .insert({
        campaign_id: params.id,
        venue_id,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ venue: data });
  } catch (error) {
    console.error('POST campaign venue error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// DELETE /api/brands/campaigns/[id]/venues - Quitar un local de una campaña
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { venue_id } = body;

    if (!venue_id) {
      return NextResponse.json({ error: 'venue_id required' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('campaign_venues')
      .delete()
      .eq('campaign_id', params.id)
      .eq('venue_id', venue_id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE campaign venue error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
