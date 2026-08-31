import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeScannerState } from 'html5-qrcode';
import { useNavigate } from 'react-router-dom';
import * as attendanceService from '../../services/attendanceService';

const SCANNER_ELEMENT_ID = 'gate-qr-reader';

const ScanAttendance = () => {
  const navigate = useNavigate();
  const scannerRef = useRef(null);
  const [status, setStatus] = useState('scanning');
  const [message, setMessage] = useState('');
  const [result, setResult] = useState(null);
  const processedRef = useRef(false);

  useEffect(() => {
    const scanner = new Html5Qrcode(SCANNER_ELEMENT_ID);
    scannerRef.current = scanner;
    let isMounted = true;

    scanner
      .start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: 250 },
        (decodedText) => handleScanSuccess(decodedText),
        () => {} // ignore per-frame "no QR found" noise
      )
      .catch(() => {
        if (isMounted) {
          setStatus('error');
          setMessage('Could not access camera — check browser permissions');
        }
      });

    return () => {
      isMounted = false;
      // Only call stop() if the scanner actually reached a running/paused
      // state — calling it outside that state throws "Cannot stop, scanner
      // is not running or paused", which surfaces under React 18 StrictMode's
      // mount→unmount→remount dev-only cycle.
      const state = scanner.getState?.();
      const canStop = state === Html5QrcodeScannerState.SCANNING || state === Html5QrcodeScannerState.PAUSED;
      if (canStop) {
        scanner.stop().catch(() => {});
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getLocation = () =>
    new Promise((resolve) => {
      if (!navigator.geolocation) return resolve(null);
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
        () => resolve(null),
        { timeout: 8000 }
      );
    });

  const handleScanSuccess = async (token) => {
    if (processedRef.current) return;
    processedRef.current = true;
    setStatus('processing');
    setMessage('Getting your location...');

    await scannerRef.current?.pause(true);
    const location = await getLocation();

    setMessage('Recording attendance...');
    try {
      const { data } = await attendanceService.scanAttendance({
        token,
        latitude: location?.latitude,
        longitude: location?.longitude,
      });
      setResult(data);
      setStatus('success');
      setMessage(data.action === 'check-in' ? 'Checked in successfully' : 'Checked out successfully');

      setTimeout(() => navigate('/dashboard'), 1800);
    } catch (err) {
      setStatus('error');
      setMessage(err.response?.data?.message || 'Could not record attendance');
    }
  };

  const handleRetry = () => {
    processedRef.current = false;
    setStatus('scanning');
    setMessage('');
    setResult(null);
    scannerRef.current?.resume();
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8 text-center">
      <h1 className="text-xl font-semibold text-gray-800 mb-1">Scan Gate QR</h1>
      <p className="text-sm text-gray-500 mb-6">Point your camera at the QR code at the library gate</p>

      <div
        id={SCANNER_ELEMENT_ID}
        className={`rounded-2xl overflow-hidden mx-auto ${status !== 'scanning' ? 'opacity-40' : ''}`}
      />

      {status === 'processing' && (
        <p className="text-sm text-gray-500 mt-4 animate-pulse">{message}</p>
      )}

      {status === 'success' && (
        <div className="mt-4 p-4 rounded-xl bg-green-50 border border-green-200">
          <p className="text-green-700 font-medium">{message}</p>
          {result?.streak != null && (
            <p className="text-sm text-green-600 mt-1">🔥 Current streak: {result.streak} days</p>
          )}
          <button
            onClick={handleRetry}
            className="mt-3 text-xs text-green-700 underline hover:no-underline"
          >
            Scan again
          </button>
        </div>
      )}

      {status === 'error' && (
        <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200">
          <p className="text-red-600 text-sm">{message}</p>
          <button
            onClick={handleRetry}
            className="mt-3 text-xs text-red-700 underline hover:no-underline"
          >
            Try again
          </button>
        </div>
      )}
    </div>
  );
};

export default ScanAttendance;