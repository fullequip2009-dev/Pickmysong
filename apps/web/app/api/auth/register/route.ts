import { NextResponse } from 'next/server';
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

    // Check if email already exists
    const existing = users.find((u) => u.email === email);
    if (existing) {
      return NextResponse.json(
        { error: 'El email ya está registrado' },
        { status: 409 }
      );
    }

    // Create user (in real app: hash password with bcrypt)
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

    // Return user without password
    return NextResponse.json({
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        handle: newUser.handle,
        avatar: newUser.avatar,
        plan: newUser.plan,
      },
      message: '¡Cuenta creada exitosamente!',
    }, { status: 201 });

  } catch {
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
