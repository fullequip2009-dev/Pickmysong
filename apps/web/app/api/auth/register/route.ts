import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { users } from '@/lib/db';
import type { User } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, contraseña y nombre son requeridos' },
        { status: 400 }
      );
    }
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      );
    }

    // Try Supabase Auth
    try {
      const supabase = await createServerSupabaseClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
          emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm`,
        },
      });

      if (error) {
        if (error.message.includes('already registered')) {
          return NextResponse.json({ error: 'El email ya está registrado' }, { status: 409 });
        }
        throw error;
      }

      if (data.user) {
        return NextResponse.json({
          user: {
            id: data.user.id,
            email: data.user.email,
            name,
            handle: '@' + name.toLowerCase().replace(/\s+/g, ''),
            avatar: '🎧',
            plan: 'free',
          },
          message: data.session
            ? '¡Cuenta creada!'
            : '¡Cuenta creada! Revisa tu email para confirmarla.',
          requiresConfirmation: !data.session,
        }, { status: 201 });
      }
    } catch (supaErr) {
      // Check if it's a config error (Supabase not set up yet), fall through
      const errMsg = (supaErr as Error).message || '';
      if (!errMsg.includes('fetch') && !errMsg.includes('URL') && !errMsg.includes('Invalid')) {
        return NextResponse.json({ error: errMsg }, { status: 400 });
      }
    }

    // Fallback: in-memory mock DB
    const existing = users.find((u) => u.email === email);
    if (existing) {
      return NextResponse.json({ error: 'El email ya está registrado' }, { status: 409 });
    }

    const newUser: User = {
      id: 'u' + (users.length + 1),
      name,
      email,
      handle: '@' + name.toLowerCase().replace(/\s+/g, ''),
      avatar: '🎧',
      plan: 'free',
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);

    return NextResponse.json({
      user: { id: newUser.id, name, email, handle: newUser.handle, avatar: '🎧', plan: 'free' },
      message: '¡Cuenta creada exitosamente! (modo demo)',
    }, { status: 201 });

  } catch {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
