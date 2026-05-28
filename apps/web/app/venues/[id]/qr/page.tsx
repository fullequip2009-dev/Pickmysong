'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';

export default function VenueQRPage() {
  const { id } = useParams<{ id: string }>();
  const [venueName, setVenueName] = useState('Cargando...');
  const [venueUrl, setVenueUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const url = typeof window !== 'undefined'
      ? `${window.location.origin}/venues/${id}`
      : `https://pickmysong.app/venues/${id}`;
    setVenueUrl(url);

    // Fetch venue name
    fetch(`/api/venues/${id}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.venue?.name) setVenueName(data.venue.name);
        else setVenueName('Pickmysong Venue');
      })
      .catch(() => setVenueName('Pickmysong Venue'));
  }, [id]);

  useEffect(() => {
    if (!venueUrl || !canvasRef.current) return;
    generateQR(venueUrl, canvasRef.current);
  }, [venueUrl]);

  function generateQR(text: string, canvas: HTMLCanvasElement) {
    // Simple QR placeholder using canvas — in production use qrcode.js
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 280;
    canvas.width = size;
    canvas.height = size;

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);

    // Draw a decorative QR placeholder
    const modules = 21;
    const moduleSize = Math.floor((size - 40) / modules);
    const offset = (size - modules * moduleSize) / 2;

    // Simple pseudo-QR pattern
    const pattern = [
      [1,1,1,1,1,1,1,0,1,0,1,0,1,1,1,1,1,1,1,0,0],
      [1,0,0,0,0,0,1,0,0,1,0,1,1,0,0,0,0,0,1,0,0],
      [1,0,1,1,1,0,1,0,1,0,1,0,1,0,1,1,1,0,1,0,0],
      [1,0,1,1,1,0,1,0,0,1,1,0,1,0,1,1,1,0,1,0,0],
      [1,0,1,1,1,0,1,0,1,0,0,1,1,0,1,1,1,0,1,0,0],
      [1,0,0,0,0,0,1,0,0,1,0,0,1,0,0,0,0,0,1,0,0],
      [1,1,1,1,1,1,1,0,1,0,1,0,1,1,1,1,1,1,1,0,0],
      [0,0,0,0,0,0,0,0,1,1,0,1,0,0,0,0,0,0,0,0,0],
      [1,0,1,1,0,1,1,1,0,0,1,0,1,1,0,1,1,0,1,1,0],
      [0,1,0,0,1,0,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1],
      [1,0,1,0,0,1,1,1,0,1,1,0,1,0,0,1,1,0,1,0,0],
      [0,1,0,1,0,0,0,1,1,0,0,1,0,1,0,0,0,1,0,1,0],
      [1,1,1,1,1,1,1,0,1,0,1,0,1,1,1,0,1,0,1,0,1],
      [0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,1,0,1,0,0,0],
      [1,1,1,1,1,1,1,0,1,0,1,0,1,1,1,1,1,1,1,0,0],
      [1,0,0,0,0,0,1,0,0,1,0,1,1,0,0,0,0,0,1,0,0],
      [1,0,1,1,1,0,1,0,1,0,1,0,1,0,1,1,1,0,1,0,0],
      [1,0,0,0,0,0,1,0,0,1,1,0,1,0,0,0,0,0,1,0,0],
      [1,1,1,1,1,1,1,0,1,0,0,1,1,1,1,1,1,1,1,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    ];

    ctx.fillStyle = '#1a0a2e';
    pattern.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (cell) {
          ctx.fillRect(
            offset + c * moduleSize,
            offset + r * moduleSize,
            moduleSize - 1,
            moduleSize - 1
          );
        }
      });
    });

    // Center logo area
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(size/2 - 20, size/2 - 20, 40, 40);
    ctx.fillStyle = '#9333ea';
    ctx.font = 'bold 20px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('♪', size/2, size/2 + 7);
  }

  async function copyLink() {
    await navigator.clipboard.writeText(venueUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function downloadQR() {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `pickmysong-qr-${id}.png`;
    link.href = canvasRef.current.toDataURL();
    link.click();
  }

  function shareVenue() {
    if (navigator.share) {
      navigator.share({
        title: venueName + ' en Pickmysong',
        text: '¡Vota por las canciones que quieres escuchar en ' + venueName + '!',
        url: venueUrl,
      });
    } else {
      copyLink();
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-12">
      {/* Back */}
      <Link
        href={`/venues/${id}`}
        className="self-start mb-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Volver al local
      </Link>

      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">📱</div>
          <h1 className="text-2xl font-bold">Código QR</h1>
          <p className="text-gray-400 mt-2 text-sm">
            Escanea para acceder a <span className="text-purple-400 font-medium">{venueName}</span>
          </p>
        </div>

        {/* QR Card */}
        <div className="bg-white rounded-3xl p-8 flex flex-col items-center shadow-2xl shadow-purple-900/40 mb-6">
          <canvas
            ref={canvasRef}
            className="rounded-xl"
            style={{ width: 240, height: 240, imageRendering: 'pixelated' }}
          />
          <div className="mt-4 flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold">♪</span>
            </div>
            <span className="text-gray-800 font-bold text-sm">Pickmysong</span>
          </div>
        </div>

        {/* URL pill */}
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3 mb-6">
          <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          <span className="text-sm text-gray-300 flex-1 truncate">{venueUrl}</span>
          <button
            onClick={copyLink}
            className="text-xs text-purple-400 hover:text-purple-300 font-medium flex-shrink-0 transition-colors"
          >
            {copied ? '✓ Copiado' : 'Copiar'}
          </button>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            onClick={downloadQR}
            className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl py-3 text-sm font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Descargar
          </button>
          <button
            onClick={shareVenue}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl py-3 text-sm font-medium transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Compartir
          </button>
        </div>

        {/* Venue owner tip */}
        <div className="bg-purple-900/20 border border-purple-500/30 rounded-xl p-4 text-center">
          <p className="text-xs text-gray-400">
            💡 Si eres el propietario del local, imprime este QR y colócalo en las mesas para que tus clientes puedan votar por la música
          </p>
        </div>
      </div>
    </div>
  );
}
