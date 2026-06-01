'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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

interface Venue {
  id: string;
  name: string;
  address?: string;
}

interface CampaignVenue {
  venue_id: string;
  venue: Venue;
}

export default function CampaignDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [venues, setVenues] = useState<CampaignVenue[]>([]);
  const [allVenues, setAllVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddVenue, setShowAddVenue] = useState(false);
  const [selectedVenueId, setSelectedVenueId] = useState('');

  useEffect(() => {
    fetchData();
  }, [params.id]);

  const fetchData = async () => {
    try {
      const [campaignRes, venuesRes, allVenuesRes] = await Promise.all([
        fetch(`/api/brands/campaigns/${params.id}`),
        fetch(`/api/brands/campaigns/${params.id}/venues`),
        fetch('/api/venues')
      ]);

      if (campaignRes.ok) {
        const data = await campaignRes.json();
        setCampaign(data.campaign);
      }

      if (venuesRes.ok) {
        const data = await venuesRes.json();
        setVenues(data.venues || []);
      }

      if (allVenuesRes.ok) {
        const data = await allVenuesRes.json();
        setAllVenues(data.venues || []);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!campaign) return;

    try {
      const response = await fetch(`/api/brands/campaigns`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaign_id: campaign.id,
          active: !campaign.active
        })
      });

      if (!response.ok) throw new Error('Error al actualizar');

      setCampaign({ ...campaign, active: !campaign.active });
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleAddVenue = async () => {
    if (!selectedVenueId) return;

    try {
      const response = await fetch(`/api/brands/campaigns/${params.id}/venues`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ venue_id: selectedVenueId })
      });

      if (!response.ok) throw new Error('Error al asociar local');

      await fetchData();
      setShowAddVenue(false);
      setSelectedVenueId('');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleRemoveVenue = async (venueId: string) => {
    try {
      const response = await fetch(`/api/brands/campaigns/${params.id}/venues`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ venue_id: venueId })
      });

      if (!response.ok) throw new Error('Error al quitar local');

      await fetchData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-gray-600 dark:text-gray-400">Campaña no encontrada</p>
        </div>
      </div>
    );
  }

  const availableVenues = allVenues.filter(
    v => !venues.find(cv => cv.venue_id === v.id)
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <Link
            href="/brands/dashboard?tab=campaigns"
            className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-2"
          >
            ← Volver al dashboard
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
              <p className="text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {campaign.name}
              </h1>
              {campaign.description && (
                <p className="text-gray-600 dark:text-gray-400">{campaign.description}</p>
              )}
            </div>
            <button
              onClick={handleToggleStatus}
              className={`px-4 py-2 rounded-md font-semibold transition-colors ${
                campaign.active
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-900/50'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {campaign.active ? 'Activa' : 'Inactiva'}
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 p-6 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Presupuesto</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{campaign.budget} créditos</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Distribuidos</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{campaign.credits_distributed}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Inicio</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {new Date(campaign.start_date).toLocaleDateString('es-ES')}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Fin</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {new Date(campaign.end_date).toLocaleDateString('es-ES')}
              </p>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Locales Asociados</h2>
              <button
                onClick={() => setShowAddVenue(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors"
              >
                + Añadir Local
              </button>
            </div>

            {showAddVenue && (
              <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
                <div className="flex gap-4 items-end">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Seleccionar Local
                    </label>
                    <select
                      value={selectedVenueId}
                      onChange={(e) => setSelectedVenueId(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="">-- Selecciona un local --</option>
                      {availableVenues.map(venue => (
                        <option key={venue.id} value={venue.id}>
                          {venue.name} {venue.address ? `- ${venue.address}` : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={handleAddVenue}
                    disabled={!selectedVenueId}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-2 px-6 rounded-md transition-colors"
                  >
                    Añadir
                  </button>
                  <button
                    onClick={() => {
                      setShowAddVenue(false);
                      setSelectedVenueId('');
                    }}
                    className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold py-2 px-6 rounded-md transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            {venues.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                No hay locales asociados a esta campaña aún. Añade uno para empezar a distribuir créditos.
              </p>
            ) : (
              <div className="space-y-3">
                {venues.map(cv => (
                  <div
                    key={cv.venue_id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700"
                  >
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{cv.venue.name}</h3>
                      {cv.venue.address && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">{cv.venue.address}</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleRemoveVenue(cv.venue_id)}
                      className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium"
                    >
                      Quitar
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
