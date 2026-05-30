'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '../../lib/supabase';

type AuthMode = 'login' | 'register';
type Provider = 'google' | 'spotify';

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams?.get('redirect') || '/discover';

  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push(redirectTo);
        router.refresh();
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name },
            emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirectTo)}`,
          },
        });
        if (error) throw error;
        setSuccess('Revisa tu correo para confirmar tu cuenta.');
      }
    } catch (err: any) {
      setError(err?.message || 'Algo salio mal. Intentalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: Provider) => {
    setError('');
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirectTo)}`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err?.message || 'No se pudo iniciar sesion con ' + provider);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <div className="text-center mb-8">
        <div className="text-4xl mb-3">🎵</div>
        <h1 className="text-3xl font-bold">
          Pick<span className="text-fuchsia-500">my</span>song
        </h1>
        <p className="text-gray-400 mt-1">
          {mode === 'login' ? 'Bienvenido de vuelta' : 'Crea tu cuenta'}
        </p>
      </div>

      <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-6">
        <div className="grid grid-cols-2 gap-2 mb-6 bg-white/5 rounded-xl p-1">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
            className={`rounded-lg py-2.5 text-sm font-semibold transition-all ${mode === 'login' ? 'bg-fuchsia-600 text-white' : 'text-gray-400'}`}
          >
            Iniciar sesion
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(''); setSuccess(''); }}
            className={`rounded-lg py-2.5 text-sm font-semibold transition-all ${mode === 'register' ? 'bg-fuchsia-600 text-white' : 'text-gray-400'}`}
          >
            Registrarse
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">NOMBRE</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-fuchsia-500"
              />
            </div>
          )}
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1">EMAIL</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-fuchsia-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1">CONTRASENA</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-fuchsia-500"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}
          {success && <p className="text-sm text-green-400">{success}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-fuchsia-600 to-pink-600 rounded-xl py-3 font-semibold text-white disabled:opacity-60"
          >
            {loading ? 'Cargando...' : mode === 'login' ? 'Entrar' : 'Crear cuenta'}
          </button>
        </form>

        <div className="text-center text-xs text-gray-500 my-4">o continua con</div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleOAuth('google')}
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 py-2.5 text-gray-300 text-sm font-medium transition-all disabled:opacity-60"
          >
            <span>🔍</span> Google
          </button>
          <button
            type="button"
            onClick={() => handleOAuth('spotify')}
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 py-2.5 text-gray-300 text-sm font-medium transition-all disabled:opacity-60"
          >
            <span>🎵</span> Spotify
          </button>
        </div>
      </div>

      <p className="text-xs text-gray-500 mt-6 text-center">
        Al continuar aceptas los{' '}
        <Link href="/terms" className="text-fuchsia-400">Terminos de uso</Link> y la{' '}
        <Link href="/privacy" className="text-fuchsia-400">Politica de privacidad</Link>
      </p>
    </div>
  );
}
