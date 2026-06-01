'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Brand {
  id: string;
  name: string;
  email: string;
  sector: string;
  website?: string;
  description?: string;
  logo_url?: string;
}

interface Campaign {
  id: string;
  name: string;
  description?: string;
  budget: number;
  start_date: string;
  end_date: string;
  active: boolean;
  credits_distributed: number;
}

export default function BrandDashboardPage() {
  const [brand, setBrand] = useState<Brand | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'profile' | 'campaigns'>('profile');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: '', website: '', description: '' });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const [brandRes, campaignsRes] = await Promise.all([
        fetch('/api/brands/me'),
        fetch('/api/brands/campaigns'),
      ]);
      if (brandRes.ok) {
        const data = await brandRes.json();
        setBrand(data.brand);
        setFormData({ name: data.brand.name, website: data.brand.website || '', description: data.brand.description || '' });
      }
      if (campaignsRes.ok) {
        const data = await campaignsRes.json();
        setCampaigns(data.campaigns || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveProfile() {
    try {
      const res = await fetch('/api/brands/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        await fetchData();
        setEditMode(false);
      }
    } catch (err) {
      console.error(err);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">No hay una marca registrada</p>
          <Link href="/brands/register" className="text-purple-400 hover:text-purple-300">Registra tu marca</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-2xl font-bold">
                {brand.logo_url ? <img src={brand.logo_url} alt={brand.name} className="w-full h-full rounded-xl object-cover" /> : brand.name[0]}
              </div>
              <div>
                <h1 className="text-2xl font-bold">{brand.name}</h1>
                <p className="text-gray-400 text-sm">{brand.sector}</p>
              </div>
            </div>
            <Link href="/" className="text-gray-400 hover:text-white text-sm">Salir</Link>
          </div>

          <div className="flex gap-6 mt-6">
            <button onClick={() => setTab('profile')} className={`pb-3 border-b-2 transition-colors ${tab === 'profile' ? 'border-purple-500 text-white' : 'border-transparent text-gray-400 hover:text-white'}`}>
              Perfil
            </button>
            <button onClick={() => setTab('campaigns')} className={`pb-3 border-b-2 transition-colors ${tab === 'campaigns' ? 'border-purple-500 text-white' : 'border-transparent text-gray-400 hover:text-white'}`}>
              Campañas
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {tab === 'profile' && (
          <div className="max-w-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Perfil de marca</h2>
              {!editMode && (
                <button onClick={() => setEditMode(true)} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors">
                  Editar
                </button>
              )}
            </div>

            {editMode ? (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Nombre</label>
                  <input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500" />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Web</label>
                  <input value={formData.website} onChange={e => setFormData({ ...formData, website: e.target.value })}
                    className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500" />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Descripción</label>
                  <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows={4}
                    className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 resize-none" />
                </div>

                <div className="flex gap-3">
                  <button onClick={handleSaveProfile} className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold hover:from-purple-500 hover:to-pink-500 transition-all">
                    Guardar
                  </button>
                  <button onClick={() => { setEditMode(false); setFormData({ name: brand.name, website: brand.website || '', description: brand.description || '' }); }}
                    className="flex-1 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-semibold transition-colors">
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase mb-1">Email</p>
                  <p className="text-gray-200">{brand.email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase mb-1">Sector</p>
                  <p className="text-gray-200">{brand.sector}</p>
                </div>
                {brand.website && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase mb-1">Web</p>
                    <a href={brand.website} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300">{brand.website}</a>
                  </div>
                )}
                {brand.description && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase mb-1">Descripción</p>
                    <p className="text-gray-300">{brand.description}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {tab === 'campaigns' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Campañas patrocinadas</h2>
              <Link href="/brands/campaigns/new" className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-sm font-semibold hover:from-purple-500 hover:to-pink-500 transition-all">
                + Nueva campaña
              </Link>
            </div>

            {campaigns.length === 0 ? (
              <div className="text-center py-16 bg-white/5 border border-white/10 rounded-2xl">
                <div className="text-5xl mb-4">🎯</div>
                <p className="text-gray-400 mb-4">No tienes campañas activas</p>
                <Link href="/brands/campaigns/new" className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold hover:from-purple-500 hover:to-pink-500 transition-all">
                  Crear primera campaña
                </Link>
              </div>
            ) : (
              <div className="grid gap-4">
                {campaigns.map(camp => (
                  <div key={camp.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/8 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-lg">{camp.name}</h3>
                        {camp.description && <p className="text-gray-400 text-sm mt-1">{camp.description}</p>}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${camp.active ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'}`}>
                        {camp.active ? 'Activa' : 'Inactiva'}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
                      <div>
                        <p className="text-xs text-gray-500 uppercase mb-1">Presupuesto</p>
                        <p className="text-white font-semibold">{camp.budget}€</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase mb-1">Créditos distribuidos</p>
                        <p className="text-white font-semibold">{camp.credits_distributed}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase mb-1">Fecha fin</p>
                        <p className="text-white font-semibold">{new Date(camp.end_date).toLocaleDateString('es-ES')}</p>
                      </div>
                    </div>

                    <Link href={`/brands/campaigns/${camp.id}`} className="mt-4 block text-center py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors">
                      Ver detalles
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
