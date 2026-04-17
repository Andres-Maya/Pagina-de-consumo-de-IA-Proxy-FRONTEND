import { useMemo } from 'react';

const CHARS_PER_TOKEN = 4;
const SYSTEM_OVERHEAD = 12;

/**
 * Estimates token consumption for a given text string.
 * Returns { estimated, severity: 'low' | 'medium' | 'high' }
 */
export function useTokenEstimator(text) {
  return useMemo(() => {
    const estimated = Math.ceil((text || '').length / CHARS_PER_TOKEN) + SYSTEM_OVERHEAD;
    const severity =
      estimated > 800 ? 'high' : estimated > 400 ? 'medium' : 'low';
    return { estimated, severity };
  }, [text]);
}
