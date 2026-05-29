import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

// Demo users for fallback when Supabase is not configured
const DEMO_USERS = [
  { id: 'demo-admin', email: 'admin@pickmysong.com', password: 'admin123', name: 'Admin Demo', handle: '@admin', avatar: '🎵', plan: 'enterprise', role: 'admin' },
  { id: 'demo-venue', email: 'venue@demo.com', password: 'venue123', name: 'Venue Demo', handle: '@venue', avatar: '🎸', plan: 'pro', role: 'venue_owner' },
  { id: 'demo-user', email: 'user@demo.com', password: 'user123', name: 'User Demo', handle: '@urbanlistener', avatar: '🎧', plan: 'free', role: 'user' },
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

    // Try Supabase Auth
    try {
      const supabase = await createServerSupabaseClient();
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          return NextResponse.json({ error: 'Email o contraseña incorrectos' }, { status: 401 });
        }
        if (error.message.includes('Email not confirmed')) {
          return NextResponse.json({ error: 'Por favor confirma tu email antes de iniciar sesión' }, { status: 401 });
        }
        throw error;
      }

      if (data.user && data.session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        return NextResponse.json({
          user: {
            id: data.user.id,
            email: data.user.email,
            name: profile?.name || data.user.email?.split('@')[0],
            handle: profile?.handle || '@user',
            avatar: profile?.avatar || '🎵',
            plan: profile?.plan || 'free',
          },
          token: data.session.access_token,
          message: 'Login exitoso',
        });
      }
    } catch (supaErr) {
      const errMsg = (supaErr as Error).message || '';
      if (!errMsg.includes('fetch') && !errMsg.includes('URL') && !errMsg.includes('Invalid')) {
        return NextResponse.json({ error: errMsg }, { status: 401 });
      }
    }

    // Fallback: demo users
    const demoUser = DEMO_USERS.find((u) => u.email === email && u.password === password);
    if (demoUser) {
      const { password: _, ...safeUser } = demoUser;
      return NextResponse.json({
        user: safeUser,
        token: 'mock-jwt-' + Date.now(),
        message: 'Login exitoso (modo demo)',
      });
    }

    return NextResponse.json(
      { error: 'Email o contraseña incorrectos' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
