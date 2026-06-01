'use client';

import { useEffect, useState } from 'react';

type Resource = 'users' | 'venues' | 'sponsors' | 'stats';

interface Stats {
  total_users: number;
  total_venues: number;
  total_credits_spent: number;
  total_checkins: number;
}

export default function SuperadminPage() {
  const [resource, setResource] = useState<Resource>('stats');
  const [data, setData] = useState<Record<string, unknown>[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchData = async (res: Resource, pg = 1) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/admin?resource=${res}&page=${pg}&limit=20`);
      if (!response.ok) {
        const err = await response.json();
        setError(err.error || 'Error de acceso');
        setLoading(false);
        return;
      }
      const json = await response.json();
      if (res === 'stats') {
        setStats(json.stats);
      } else {
        setData(json[res] || []);
        setTotal(json.total || 0);
      }
    } catch {
      setError('Error de red');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData(resource, page);
  }, [resource, page]);

  const handleResourceChange = (res: Resource) => {
    setResource(res);
    setPage(1);
    setData([]);
    setStats(null);
  };

  const updateUser = async (id: string, updates: Record<string, unknown>) => {
    await fetch('/api/admin', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resource: 'users', id, updates }),
    });
    fetchData('users', page);
  };

  const toggleVenueStatus = async (id: string, currentStatus: boolean) => {
    await fetch('/api/admin', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resource: 'venues', id, updates: { is_active: !currentStatus } }),
    });
    fetchData('venues', page);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Panel Superadmin</h1>

        {/* Navigation */}
        <div className="flex gap-2 mb-8">
          {(['stats', 'users', 'venues', 'sponsors'] as Resource[]).map((r) => (
            <button
              key={r}
              onClick={() => handleResourceChange(r)}
              className={`px-4 py-2 rounded font-semibold capitalize ${
                resource === r
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {error && (
          <div className="bg-red-600 text-white px-4 py-3 rounded mb-6">
            {error} — Asegúrate de tener rol superadmin
          </div>
        )}

        {loading && <p className="text-gray-400">Cargando...</p>}

        {/* Stats View */}
        {resource === 'stats' && stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Usuarios', value: stats.total_users },
              { label: 'Locales', value: stats.total_venues },
              { label: 'Créditos gastados', value: stats.total_credits_spent },
              { label: 'Checkins', value: stats.total_checkins },
            ].map((stat) => (
              <div key={stat.label} className="bg-gray-800 rounded-xl p-5 text-center">
                <p className="text-4xl font-bold text-purple-400">{stat.value.toLocaleString()}</p>
                <p className="text-gray-400 mt-1 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Users View */}
        {resource === 'users' && data.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700 text-left text-gray-400">
                  <th className="py-2 pr-4">Nombre</th>
                  <th className="py-2 pr-4">Email</th>
                  <th className="py-2 pr-4">Rol</th>
                  <th className="py-2 pr-4">Créditos</th>
                  <th className="py-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {data.map((user) => (
                  <tr key={user.id as string} className="border-b border-gray-800 hover:bg-gray-800">
                    <td className="py-2 pr-4">{user.display_name as string || '-'}</td>
                    <td className="py-2 pr-4 text-gray-400">{user.email as string}</td>
                    <td className="py-2 pr-4">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                        user.role === 'superadmin' ? 'bg-purple-600' :
                        user.role === 'venue_owner' ? 'bg-blue-600' :
                        'bg-gray-700'
                      }`}>{user.role as string}</span>
                    </td>
                    <td className="py-2 pr-4">{user.credits as number || 0}</td>
                    <td className="py-2">
                      <select
                        defaultValue={user.role as string}
                        onChange={(e) => updateUser(user.id as string, { role: e.target.value })}
                        className="bg-gray-700 text-white text-xs rounded px-2 py-1"
                      >
                        <option value="user">user</option>
                        <option value="venue_owner">venue_owner</option>
                        <option value="brand">brand</option>
                        <option value="superadmin">superadmin</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Venues View */}
        {resource === 'venues' && data.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700 text-left text-gray-400">
                  <th className="py-2 pr-4">Nombre</th>
                  <th className="py-2 pr-4">Ciudad</th>
                  <th className="py-2 pr-4">Plan</th>
                  <th className="py-2 pr-4">Estado</th>
                  <th className="py-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {data.map((venue) => (
                  <tr key={venue.id as string} className="border-b border-gray-800 hover:bg-gray-800">
                    <td className="py-2 pr-4">{venue.name as string}</td>
                    <td className="py-2 pr-4 text-gray-400">{venue.city as string}</td>
                    <td className="py-2 pr-4">
                      <span className="bg-blue-700 text-xs px-2 py-0.5 rounded">{venue.plan as string}</span>
                    </td>
                    <td className="py-2 pr-4">
                      <span className={`text-xs font-bold ${
                        venue.is_active ? 'text-green-400' : 'text-red-400'
                      }`}>{venue.is_active ? 'Activo' : 'Inactivo'}</span>
                    </td>
                    <td className="py-2">
                      <button
                        onClick={() => toggleVenueStatus(venue.id as string, venue.is_active as boolean)}
                        className={`text-xs font-bold py-1 px-3 rounded ${
                          venue.is_active
                            ? 'bg-red-700 hover:bg-red-600 text-white'
                            : 'bg-green-700 hover:bg-green-600 text-white'
                        }`}
                      >
                        {venue.is_active ? 'Desactivar' : 'Activar'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {resource !== 'stats' && total > 20 && (
          <div className="flex gap-2 mt-6 justify-center">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="px-3 py-1 bg-gray-700 rounded disabled:opacity-40"
            >
              ← Anterior
            </button>
            <span className="px-3 py-1 text-gray-400">
              Pág {page} / {Math.ceil(total / 20)}
            </span>
            <button
              disabled={page * 20 >= total}
              onClick={() => setPage(p => p + 1)}
              className="px-3 py-1 bg-gray-700 rounded disabled:opacity-40"
            >
              Siguiente →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
