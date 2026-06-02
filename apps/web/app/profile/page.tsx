'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface CreditLog {
  id: string;
  amount: number;
  type: string;
  reference?: string;
  created_at: string;
}

interface CreditPack {
  id: string;
  credits: number;
  price: number;
  label: string;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  created_at?: string;
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'credits' | 'history' | 'promo'>('credits');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [balance, setBalance] = useState(0);
  const [history, setHistory] = useState<CreditLog[]>([]);
  const [packs, setPacks] = useState<CreditPack[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [promoCode, setPromoCode] = useState('');
  const [promoMsg, setPromoMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [redeeming, setRedeeming] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [credRes, authRes] = await Promise.all([
          fetch('/api/credits'),
          fetch('/api/auth/me').catch(() => null),
        ]);
        if (credRes.ok) {
          const d = await credRes.json();
          setBalance(d.balance ?? 0);
          setHistory(d.history ?? []);
          setPacks(d.packs ?? []);
        }
        if (authRes && authRes.ok) {
          const u = await authRes.json();
          setUser(u.user ?? u);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handlePurchase(packId: string) {
    setPurchasing(packId);
    try {
      const res = await fetch('/api/credits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pack_id: packId }),
      });
      const data = await res.json();
      if (res.ok) {
        setBalance(data.new_balance ?? balance);
        setHistory(prev => [{ id: Date.now().toString(), amount: data.credits_added, type: 'purchase', created_at: new Date().toISOString() }, ...prev]);
      } else {
        alert(data.error || 'Error al comprar creditos');
      }
    } finally {
      setPurchasing(null);
    }
  }

  async function handleRedeem() {
    if (!promoCode.trim()) return;
    setRedeeming(true);
    setPromoMsg(null);
    try {
      const res = await fetch('/api/promo-codes/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: promoCode.trim().toUpperCase() }),
      });
      const data = await res.json();
      if (res.ok) {
        setBalance(prev => prev + (data.credits_added ?? 0));
        setPromoMsg({ type: 'ok', text: `Codigo canjeado! +${data.credits_added} creditos` });
        setPromoCode('');
      } else {
        setPromoMsg({ type: 'err', text: data.error || 'Codigo invalido' });
      }
    } finally {
      setRedeeming(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const displayName = user?.name || user?.email?.split('@')[0] || 'Usuario';
  const avatarSeed = displayName.replace(/\s/g, '');
  const avatarUrl = user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="relative h-40 bg-gradient-to-br from-purple-900/60 via-black to-pink-900/40">
        <Link href="/" className="absolute top-4 left-4 flex items-center gap-2 bg-black/40 backdrop-blur-sm px-3 py-2 rounded-full text-sm hover:bg-black/60">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Inicio
        </Link>
      </div>

      {/* Avatar + Name */}
      <div className="max-w-2xl mx-auto px-4">
        <div className="-mt-16 mb-6 flex items-end gap-4">
          <div className="w-28 h-28 rounded-2xl border-4 border-black overflow-hidden bg-gradient-to-br from-purple-600 to-pink-600 flex-shrink-0">
            <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
          </div>
          <div className="pb-2">
            <h1 className="text-2xl font-bold">{displayName}</h1>
            {user?.email && <p className="text-gray-400 text-sm">{user.email}</p>}
          </div>
        </div>

        {/* Balance card */}
        <div className="mb-6 bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-500/30 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Saldo de creditos</p>
            <p className="text-4xl font-bold">{balance} <span className="text-lg text-purple-400">cr</span></p>
          </div>
          <div className="text-5xl">🪙</div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(['credits', 'history', 'promo'] as const).map(t => (
            <button key={t} onClick={() => setActiveTab(t)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === t ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}>
              {t === 'credits' ? '💳 Comprar' : t === 'history' ? '📋 Historial' : '🎟️ Canjear'}
            </button>
          ))}
        </div>

        {/* Credits Tab */}
        {activeTab === 'credits' && (
          <div className="space-y-3 pb-10">
            {packs.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                <p className="text-4xl mb-3">💳</p>
                <p>Packs de creditos no disponibles</p>
              </div>
            ) : packs.map(pack => (
              <div key={pack.id} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl p-4 hover:border-purple-500/40 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-xl font-bold">
                    🪙
                  </div>
                  <div>
                    <p className="font-semibold">{pack.label}</p>
                    <p className="text-sm text-purple-400">{pack.credits} creditos</p>
                  </div>
                </div>
                <button
                  onClick={() => handlePurchase(pack.id)}
                  disabled={purchasing === pack.id}
                  className="px-5 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold text-sm hover:opacity-90 transition-all disabled:opacity-50">
                  {purchasing === pack.id ? '...' : `${pack.price.toFixed(2)}€`}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-2 pb-10">
            {history.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                <p className="text-4xl mb-3">📋</p>
                <p>Sin movimientos aun</p>
              </div>
            ) : history.map(log => (
              <div key={log.id} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                <div>
                  <p className="text-sm font-medium capitalize">{log.type === 'bid' ? 'Puja de cancion' : log.type === 'purchase' ? 'Compra de creditos' : log.type === 'promo' ? 'Codigo promo' : log.type}</p>
                  <p className="text-xs text-gray-500">{new Date(log.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                </div>
                <span className={`font-bold text-lg ${log.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {log.amount > 0 ? '+' : ''}{log.amount}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Promo Tab */}
        {activeTab === 'promo' && (
          <div className="pb-10">
            <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border border-yellow-500/30 rounded-2xl p-6">
              <h3 className="font-bold text-lg mb-1">🎟️ Canjear codigo promocional</h3>
              <p className="text-gray-400 text-sm mb-4">Introduce el codigo que recibirte del local o marca</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={e => setPromoCode(e.target.value.toUpperCase())}
                  placeholder="CODIGO-PROMO"
                  maxLength={20}
                  className="flex-1 bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-white font-mono tracking-widest placeholder-gray-600 focus:outline-none focus:border-yellow-500/50 uppercase"
                />
                <button
                  onClick={handleRedeem}
                  disabled={redeeming || !promoCode.trim()}
                  className="px-5 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-xl font-semibold text-sm hover:opacity-90 transition-all disabled:opacity-50">
                  {redeeming ? '...' : 'Canjear'}
                </button>
              </div>
              {promoMsg && (
                <div className={`mt-3 px-4 py-3 rounded-xl text-sm font-medium ${
                  promoMsg.type === 'ok' ? 'bg-green-900/40 text-green-400 border border-green-500/30' : 'bg-red-900/40 text-red-400 border border-red-500/30'
                }`}>
                  {promoMsg.text}
                </div>
              )}
            </div>

            <div className="mt-6 text-center text-gray-600 text-sm">
              <p>¿No tienes codigo? Visita un local adherido y pidelo al DJ 🎧</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
