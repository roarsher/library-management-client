 import React, { useEffect, useRef, useState } from 'react';
import * as timerService from '../../services/timerService';
import * as attendanceService from '../../services/attendanceService';

const formatTime = (totalSeconds) => {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60)
    .toString()
    .padStart(2, '0');
  const s = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, '0');
  return h > 0 ? `${h}:${m}:${s}` : `${m}:${s}`;
};

const StudyTimer = () => {
  const [status, setStatus] = useState('stopped'); // 'running' | 'paused' | 'stopped'
  const [baseSeconds, setBaseSeconds] = useState(0); // last known-good value from server
  const [displaySeconds, setDisplaySeconds] = useState(0);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const clientStartRef = useRef(null); // Date.now() when local ticking began
  const intervalRef = useRef(null);

  // Load current state from server on mount (this is what makes it survive logout)
  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await timerService.getMyTimer();
        setStatus(data.timer.status);
        setBaseSeconds(data.timer.elapsedSeconds);
        setDisplaySeconds(data.timer.elapsedSeconds);
        if (data.timer.status === 'running') {
          clientStartRef.current = Date.now();
        }
      } catch {
        setError('Could not load timer');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Local ticking while running — purely visual, server is source of truth
  useEffect(() => {
    if (status === 'running') {
      intervalRef.current = setInterval(() => {
        const localElapsed = clientStartRef.current
          ? Math.floor((Date.now() - clientStartRef.current) / 1000)
          : 0;
        setDisplaySeconds(baseSeconds + localElapsed);
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [status, baseSeconds]);

  const handleStart = async () => {
    setError('');
    setBusy(true);
    try {
      const { data } = await timerService.startTimer();
      setStatus(data.timer.status);
      setBaseSeconds(data.timer.elapsedSeconds);
      setDisplaySeconds(data.timer.elapsedSeconds);
      clientStartRef.current = Date.now();

      if (data.isFreshSession) {
        // Only log an attendance check-in the first time a session starts from zero
        attendanceService.checkIn().catch(() => {});
      }
    } catch {
      setError('Could not start timer');
    } finally {
      setBusy(false);
    }
  };

  const handlePause = async () => {
    setBusy(true);
    try {
      const { data } = await timerService.pauseTimer();
      setStatus(data.timer.status);
      setBaseSeconds(data.timer.elapsedSeconds);
      setDisplaySeconds(data.timer.elapsedSeconds);
    } catch {
      setError('Could not pause timer');
    } finally {
      setBusy(false);
    }
  };

  const handleReset = async () => {
    setBusy(true);
    try {
      const { data } = await timerService.resetTimer();
      setStatus(data.timer.status);
      setBaseSeconds(0);
      setDisplaySeconds(0);
      attendanceService.checkOut().catch(() => {});
    } catch {
      setError('Could not reset timer');
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <div>
        <h3 className="font-semibold text-gray-800 mb-3">Study Timer</h3>
        <p className="text-sm text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-800">Study Timer</h3>
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-full uppercase tracking-wide ${
            status === 'running'
              ? 'bg-green-50 text-green-600'
              : status === 'paused'
              ? 'bg-amber-50 text-amber-600'
              : 'bg-gray-100 text-gray-400'
          }`}
        >
          {status}
        </span>
      </div>

      <div className="text-center py-4">
        <div className="text-4xl font-bold text-gray-800 tabular-nums">
          {formatTime(displaySeconds)}
        </div>
        <p className="text-xs text-gray-400 mt-1">Total time tracked this session</p>
      </div>

      {error && <p className="text-xs text-red-500 mb-2">{error}</p>}

      <div className="flex gap-2">
        {status !== 'running' ? (
          <button
            onClick={handleStart}
            disabled={busy}
            className="btn-primary flex-1 text-sm disabled:opacity-50"
          >
            {displaySeconds === 0 ? 'Start' : 'Resume'}
          </button>
        ) : (
          <button
            onClick={handlePause}
            disabled={busy}
            className="btn-secondary flex-1 text-sm disabled:opacity-50"
          >
            Pause
          </button>
        )}
        <button
          onClick={handleReset}
          disabled={busy || displaySeconds === 0}
          className="btn-secondary text-sm px-3 disabled:opacity-50"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default StudyTimer;