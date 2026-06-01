import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

// Superadmin middleware check
async function requireSuperadmin(supabase: any) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
  return profile?.role === 'superadmin';
}

// GET /api/admin?resource=users|venues|sponsors
export async function GET(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    if (!(await requireSuperadmin(supabase))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const resource = searchParams.get('resource') || 'users';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;

    if (resource === 'users') {
      const { data, error, count } = await supabase
        .from('profiles')
        .select('id, email, display_name, role, credits, created_at', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ users: data || [], total: count });
    }

    if (resource === 'venues') {
      const { data, error, count } = await supabase
        .from('venues')
        .select('id, name, city, address, owner_id, plan, is_active, created_at', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ venues: data || [], total: count });
    }

    if (resource === 'sponsors') {
      const { data, error, count } = await supabase
        .from('sponsors')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ sponsors: data || [], total: count });
    }

    if (resource === 'stats') {
      const [usersRes, venuesRes, creditsRes, checkinsRes] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('venues').select('id', { count: 'exact', head: true }),
        supabase.from('credit_transactions').select('amount').gte('amount', 0),
        supabase.from('checkins').select('id', { count: 'exact', head: true }),
      ]);

      const totalCreditsSpent = (creditsRes.data || []).reduce((sum: number, t: any) => sum + (t.amount || 0), 0);

      return NextResponse.json({
        stats: {
          total_users: usersRes.count || 0,
          total_venues: venuesRes.count || 0,
          total_credits_spent: totalCreditsSpent,
          total_checkins: checkinsRes.count || 0,
        },
      });
    }

    return NextResponse.json({ error: 'Invalid resource' }, { status: 400 });
  } catch (error) {
    console.error('GET admin error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// PATCH /api/admin - Update user role or venue status
export async function PATCH(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    if (!(await requireSuperadmin(supabase))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { resource, id, updates } = await request.json();
    if (!resource || !id || !updates) {
      return NextResponse.json({ error: 'resource, id, and updates required' }, { status: 400 });
    }

    const table = resource === 'users' ? 'profiles' : resource;
    const { data, error } = await supabase
      .from(table)
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data });
  } catch (error) {
    console.error('PATCH admin error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// DELETE /api/admin?resource=users&id=xxx
export async function DELETE(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    if (!(await requireSuperadmin(supabase))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const resource = searchParams.get('resource');
    const id = searchParams.get('id');

    if (!resource || !id) return NextResponse.json({ error: 'resource and id required' }, { status: 400 });

    const table = resource === 'users' ? 'profiles' : resource;
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE admin error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
