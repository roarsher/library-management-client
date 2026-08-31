import { useEffect, useRef } from 'react';

/**
 * Re-runs `callback` whenever the tab/window regains focus or becomes
 * visible again, plus on a background interval as a fallback (e.g. if the
 * student scanned attendance on their phone, then switched back to this tab).
 */
const useRefetchOnFocus = (callback, { pollMs = 30000 } = {}) => {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    const handleFocus = () => callbackRef.current();
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') callbackRef.current();
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibility);

    const interval = pollMs ? setInterval(() => callbackRef.current(), pollMs) : null;

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibility);
      if (interval) clearInterval(interval);
    };
  }, [pollMs]);
};

export default useRefetchOnFocus;