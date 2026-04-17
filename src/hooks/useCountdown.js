import { useEffect, useRef } from 'react';
import { useRateLimitContext } from '../context/RateLimitContext.jsx';

/**
 * Drives the per-second countdown tick when the user is rate-limited.
 * Mount once at AppLayout level.
 */
export function useCountdown() {
  const { isBlocked, decrementCountdown } = useRateLimitContext();
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isBlocked) {
      intervalRef.current = setInterval(decrementCountdown, 1_000);
    } else {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => clearInterval(intervalRef.current);
  }, [isBlocked, decrementCountdown]);
}
