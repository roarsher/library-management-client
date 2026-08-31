 import React, { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import * as attendanceService from '../../services/attendanceService';

const GateQRDisplay = () => {
  const [mode, setMode] = useState('checkin');
  const [token, setToken] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    setToken(null);
    setError('');
    attendanceService
      .getGateToken(mode)
      .then(({ data }) => setToken(data.token))
      .catch(() => setError('Could not load QR code — check connection'));
  }, [mode]);

  const handleDownload = () => {
    const svg = document.getElementById('gate-qr-svg');
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 40, 40, 720, 720);
      const link = document.createElement('a');
      link.download = `gate-qr-${mode}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <div className="flex gap-2 mb-8 bg-gray-800 p-1.5 rounded-xl">
        <button
          onClick={() => setMode('checkin')}
          className={`px-6 py-2 rounded-lg text-sm font-semibold transition-colors ${
            mode === 'checkin' ? 'bg-green-500 text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          Check-In QR
        </button>
        <button
          onClick={() => setMode('checkout')}
          className={`px-6 py-2 rounded-lg text-sm font-semibold transition-colors ${
            mode === 'checkout' ? 'bg-red-500 text-white' : 'text-gray-400 hover:text-white'
          }`}
        >
          Check-Out QR
        </button>
      </div>

      <h1 className="text-2xl font-semibold mb-2">
        {mode === 'checkin' ? 'Check-In' : 'Check-Out'} QR — Static, Safe to Print
      </h1>
      <p className="text-gray-400 mb-8 text-center max-w-md">
         Print it and post it permanently at the {mode === 'checkin' ? 'entrance' : 'exit'}.
      </p>

      <div className="bg-white p-6 rounded-2xl">
        {token ? (
          <QRCodeSVG id="gate-qr-svg" value={token} size={320} />
        ) : (
          <div className="w-80 h-80 flex items-center justify-center text-gray-400">Loading...</div>
        )}
      </div>

      {error && <p className="text-red-400 mt-4 text-sm">{error}</p>}

      {token && (
        <button
          onClick={handleDownload}
          className="mt-6 px-6 py-2.5 rounded-lg bg-white text-gray-900 text-sm font-semibold hover:bg-gray-100 transition-colors"
        >
          Download as PNG to Print
        </button>
      )}
    </div>
  );
};

export default GateQRDisplay;