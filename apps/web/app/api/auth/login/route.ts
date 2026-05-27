import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { users } from '@/lib/db';

// Demo user for when Supabase is not configured
const DEMO_USER = {
  email: 'demo@pickmysong.com',
  password: 'demo123',
  id: 'demo-1',
  name: 'Urban Listener',
  handle: '@urbanlistener',
  avatar: '🎧',
  plan: 'free' as const,
};

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
        // Get profile from DB
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
            avatar: profile?.avatar || '🎧',
            plan: profile?.plan || 'free',
          },
          token: data.session.access_token,
          message: 'Login exitoso',
        });
      }
    } catch (supaErr) {
      const errMsg = (supaErr as Error).message || '';
      if (!errMsg.includes('fetch') && !errMsg.includes('URL') && !errMsg.includes('Invalid API')) {
        return NextResponse.json({ error: errMsg }, { status: 401 });
      }
    }

    // Fallback: demo user + in-memory users
    if (email === DEMO_USER.email && password === DEMO_USER.password) {
      const { password: _, ...safeUser } = DEMO_USER;
      return NextResponse.json({
        user: safeUser,
        token: 'mock-jwt-' + Date.now(),
        message: 'Login exitoso (modo demo)',
      });
    }

    const user = users.find((u) => u.email === email);
    if (!user) {
      return NextResponse.json({ error: 'Email o contraseña incorrectos' }, { status: 401 });
    }

    return NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email, handle: user.handle, avatar: user.avatar, plan: user.plan },
      token: 'mock-jwt-' + Date.now(),
      message: 'Login exitoso (modo demo)',
    });

  } catch {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
