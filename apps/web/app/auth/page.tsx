'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '../../lib/supabase';

type AuthMode = 'login' | 'register';

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

    const handleOAuth = async (provider: 'google' | 'spotify') => {
          setError('');
          const supabase = createClient();
          const { error } = await supabase.auth.signInWithOAuth({
                  provider,
                  options: { redirectTo: `${window.location.origin}/auth/callback` },
          });
          if (error) setError(error.message);
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const body = mode === 'login' ? { email, password } : { email, password, name };
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Algo salió mal');
      } else {
        if (mode === 'login') {
          setSuccess('¡Bienvenido de vuelta! Redirigiendo...');
          setTimeout(() => { window.location.href = '/discover'; }, 1500);
        } else {
          setSuccess('¡Cuenta creada! Ya puedes iniciar sesión.');
          setTimeout(() => { setMode('login'); setSuccess(''); }, 2000);
        }
      }
    } catch {
      setError('Error de conexión. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-4 py-16">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] bg-pink-900/10 rounded-full blur-3xl" />
      </div>
      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <span className="text-4xl">🎵</span>
            <h1 className="text-2xl font-black tracking-tighter text-white mt-2">
              Pick<span className="text-purple-400">my</span>song
            </h1>
          </Link>
          <p className="text-gray-500 text-sm mt-2">
            {mode === 'login' ? 'Bienvenido de vuelta' : 'Únete a la comunidad'}
          </p>
        </div>
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="flex bg-white/5 rounded-xl p-1 mb-8">
            <button
              onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all ${mode === 'login' ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25' : 'text-gray-400 hover:text-white'}`}
            >
              Iniciar sesión
            </button>
            <button
              onClick={() => { setMode('register'); setError(''); setSuccess(''); }}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all ${mode === 'register' ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25' : 'text-gray-400 hover:text-white'}`}
            >
              Registrarse
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Nombre</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre artístico" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all text-sm" />
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Contraseña</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all text-sm" />
            </div>
            {error && <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">{error}</div>}
            {success && <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-3 text-emerald-400 text-sm">{success}</div>}
            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-purple-500/25 text-sm tracking-wide">
              {loading ? '...' : mode === 'login' ? 'Entrar' : 'Crear cuenta'}
            </button>
          </form>
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div>
            <div className="relative flex justify-center text-xs text-gray-500"><span className="bg-transparent px-3">o continúa con</span></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => handleOAuth('google')} className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 py-2.5 text-gray-300 text-sm font-medium transition-all"><span>🔍</span> Google</button>
            <button onClick={() => handleOAuth('spotify')} className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 py-2.5 text-gray-300 text-sm font-medium transition-all"><span>🎵</span> Spotify</button>
          </div>
        </div>
        <p className="text-center text-gray-600 text-xs mt-6">
          Al continuar aceptas los{' '}
          <Link href="#" className="text-purple-400 hover:underline">Términos de uso</Link>
          {' '}y la{' '}
          <Link href="#" className="text-purple-400 hover:underline">Política de privacidad</Link>
        </p>
      </div>
    </main>
  );
}
