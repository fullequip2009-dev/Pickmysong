// @ts-nocheck
import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

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
        options: { data: { name } },
      });

      if (error) {
        if (error.message.includes('already registered')) {
          return NextResponse.json({ error: 'Este email ya está registrado' }, { status: 409 });
        }
        throw error;
      }

      return NextResponse.json({
        user: {
          id: data.user?.id,
          email: data.user?.email,
          name,
          handle: '@' + name.toLowerCase().replace(/\s+/g, ''),
          plan: 'free',
        },
        message: 'Registro exitoso. Por favor confirma tu email.',
      });
    } catch (supaErr) {
      const errMsg = (supaErr as Error).message || '';
      if (!errMsg.includes('fetch') && !errMsg.includes('URL')) {
        return NextResponse.json({ error: errMsg }, { status: 400 });
      }
    }

    // Fallback: mock registration
    const mockUser = {
      id: 'mock-' + Date.now(),
      email,
      name,
      handle: '@' + name.toLowerCase().replace(/\s+/g, ''),
      avatar: '🎵',
      plan: 'free',
    };

    return NextResponse.json({
      user: mockUser,
      token: 'mock-jwt-' + Date.now(),
      message: 'Registro exitoso (modo demo)',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
