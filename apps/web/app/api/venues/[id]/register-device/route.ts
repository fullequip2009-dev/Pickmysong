// POST /api/venues/[id]/register-device — Registra el dispositivo Spotify activo del venue.
// Equivale a guardar venue.spoti_device_id de 5Beats (el device del Web Playback SDK).
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const venueId = params.id;

    // Solo el owner puede registrar el dispositivo de su venue.
    const supabase = getServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json().catch(() => ({}));
    const { device_id } = body as { device_id?: string };
    if (!device_id) {
      return NextResponse.json({ error: 'device_id required' }, { status: 400 });
    }

    const { data: venue } = await supabaseAdmin
      .from('venues')
      .select('id, owner_id')
      .eq('id', venueId)
      .single();

    if (!venue) return NextResponse.json({ error: 'Venue not found' }, { status: 404 });
    if (venue.owner_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await supabaseAdmin
      .from('venues')
      .update({ spotify_device_id: device_id })
      .eq('id', venueId);

    return NextResponse.json({ success: true, device_id });
  } catch (err) {
    console.error('[venues/register-device] error:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
