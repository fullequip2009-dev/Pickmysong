import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET /api/brands - List all brands (admin) or current brand profile
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const brandId = searchParams.get('brand_id');

    if (brandId) {
      const { data, error } = await supabaseAdmin
        .from('brands')
        .select('*')
        .eq('id', brandId)
        .single();
      if (error) return NextResponse.json({ error: error.message }, { status: 404 });
      return NextResponse.json({ brand: data });
    }

    const { data, error } = await supabaseAdmin
      .from('brands')
      .select('id, name, logo_url, website, description, created_at')
      .order('created_at', { ascending: false });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ brands: data || [] });
  } catch (error) {
    console.error('GET brands error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// POST /api/brands - Create or update brand profile
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, name, logo_url, website, description, contact_email, user_id } = body;
    if (!name || !contact_email) {
      return NextResponse.json({ error: 'name and contact_email required' }, { status: 400 });
    }
    const upsertData: Record<string, unknown> = {
      name,
      logo_url,
      website,
      description,
      contact_email,
      user_id,
      updated_at: new Date().toISOString(),
    };
    if (id) upsertData.id = id;
    const { data, error } = await supabaseAdmin
      .from('brands')
      .upsert(upsertData, { onConflict: 'id' })
      .select()
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ brand: data });
  } catch (error) {
    console.error('POST brands error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
