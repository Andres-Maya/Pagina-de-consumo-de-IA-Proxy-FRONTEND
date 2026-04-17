import { useState, useEffect } from 'react';
import { activeAiService } from '../api/aiService.js';

export function useUsageHistory(days = 7) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    activeAiService
      .getUsageHistory(days)
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => { cancelled = true; };
  }, [days]);

  return { data, isLoading, error };
}
