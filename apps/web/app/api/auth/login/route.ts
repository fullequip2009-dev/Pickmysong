import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

// Demo users for fallback when Supabase is not configured
const DEMO_USERS = [
  { id: 'demo-admin', email: 'admin@pickmysong.com', password: 'admin123', name: 'Admin Demo', handle: 'admin', avatar: '🎵', plan: 'premium', role: 'admin' },
  { id: 'demo-venue', email: 'venue@demo.com', password: 'venue123', name: 'Venue Demo', handle: 'venue', avatar: '🎸', plan: 'venue', role: 'venue' },
  { id: 'demo-user', email: 'user@demo.com', password: 'user123', name: 'User Demo', handle: 'user', avatar: '🎤', plan: 'free', role: 'user' },
];

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y contraseña son requeridos' },
        { status: 400 }
      );
    }

    // Try Supabase Auth first
    try {
      const supabase = createServerSupabaseClient();
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (!error && data.user) {
        // Get user profile
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
        const profileData = profile as Record<string, unknown> | null;

        return NextResponse.json({
          user: {
            id: data.user.id,
            email: data.user.email || '',
            name: (profileData?.name as string) || (data.user.email ? data.user.email.split('@')[0] : 'User'),
            handle: (profileData?.handle as string) || '@user',
            avatar: (profileData?.avatar as string) || '🎵',
            plan: (profileData?.plan as string) || 'free',
            role: (profileData?.role as string) || 'user',
          },
          session: data.session,
        });
      }
    } catch {
      // Supabase not configured, fall through to demo users
    }

    // Fallback: demo users
    const demoUser = DEMO_USERS.find(u => u.email === email && u.password === password);
    if (demoUser) {
      const { password: _pw, ...safeUser } = demoUser;
      return NextResponse.json({
        user: safeUser,
        session: { access_token: 'demo-token-' + demoUser.id },
      });
    }

    return NextResponse.json(
      { error: 'Credenciales inválidas' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
