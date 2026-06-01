'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function BrandRegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    email: '',
    sector: '',
    website: '',
    description: '',
    contact_name: '',
    contact_phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const sectors = ['Hosteleria', 'Moda', 'Musica', 'Tecnologia', 'Bebidas', 'Ocio', 'Deportes', 'Otro'];

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.sector) {
      setError('Nombre, email y sector son obligatorios');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/brands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({...form, contact_email: form.email}),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al registrar marca');
      setSuccess(true);
      setTimeout(() => router.push('/brands/dashboard'), 2000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">✓</div>
          <h2 className="text-2xl font-bold text-green-400 mb-2">Marca registrada</h2>
          <p className="text-gray-400">Redirigiendo al dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-gray-400 hover:text-white text-sm flex items-center gap-2 mb-8">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Volver
        </Link>

        <div className="mb-10">
          <div className="text-4xl mb-3">🎯</div>
          <h1 className="text-3xl font-bold mb-2">Registra tu marca</h1>
          <p className="text-gray-400">Crea campanas patrocinadas y llega a tu audiencia en locales de musica en vivo</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-900/20 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">
            <h2 className="font-semibold text-lg">Datos de la marca</h2>

            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Nombre de la marca *</label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="Ej: Red Bull, Heineken..." required
                className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors" />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Email de contacto *</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="marca@empresa.com" required
                className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors" />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Sector *</label>
              <select name="sector" value={form.sector} onChange={handleChange} required
                className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors">
                <option value="">Selecciona un sector</option>
                {sectors.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Web (opcional)</label>
              <input name="website" value={form.website} onChange={handleChange} placeholder="https://tuempresa.com"
                className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors" />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Descripcion</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={3}
                placeholder="Breve descripcion de tu marca..."
                className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors resize-none" />
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">
            <h2 className="font-semibold text-lg">Persona de contacto</h2>

            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Nombre</label>
              <input name="contact_name" value={form.contact_name} onChange={handleChange} placeholder="Tu nombre"
                className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors" />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Telefono</label>
              <input name="contact_phone" value={form.contact_phone} onChange={handleChange} placeholder="+34 600 000 000"
                className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors" />
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold text-lg hover:from-purple-500 hover:to-pink-500 transition-all disabled:opacity-50">
            {loading ? 'Registrando...' : 'Registrar marca'}
          </button>

          <p className="text-center text-sm text-gray-500">
            Ya tienes cuenta?{' '}
            <Link href="/brands/dashboard" className="text-purple-400 hover:text-purple-300">Accede al dashboard</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
