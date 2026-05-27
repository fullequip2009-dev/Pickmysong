import { NextResponse } from 'next/server';
import { users } from '@/lib/db';

// Mock seed user for demo login
const SEED_USER = {
  id: 'demo-1',
  name: 'Urban Listener',
  email: 'demo@pickmysong.com',
  password: 'demo123',
  handle: '@urbanlistener',
  avatar: '🎧',
  plan: 'free' as const,
  createdAt: new Date().toISOString(),
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

    // Check seed user first (demo)
    if (email === SEED_USER.email && password === SEED_USER.password) {
      const { password: _, ...safeUser } = SEED_USER;
      return NextResponse.json({
        user: safeUser,
        token: 'mock-jwt-' + Date.now(),
        message: 'Login exitoso',
      });
    }

    // Check registered users (in-memory)
    const user = users.find((u) => u.email === email);
    if (!user) {
      return NextResponse.json(
        { error: 'Email o contraseña incorrectos' },
        { status: 401 }
      );
    }

    // In real app: compare hashed password
    // For demo purposes we just check if user exists
    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        handle: user.handle,
        avatar: user.avatar,
        plan: user.plan,
      },
      token: 'mock-jwt-' + Date.now(),
      message: 'Login exitoso',
    });

  } catch {
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
