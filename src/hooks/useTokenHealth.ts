import { useState, useEffect } from 'react';

interface TokenHealth {
  ok: boolean;
  symbol?: string;
  decimals?: number;
  contract?: string;
  reason?: string;
}

export function useTokenHealth() {
  const [health, setHealth] = useState<TokenHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkHealth = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/health/token');
      const data = await response.json();
      setHealth(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
    
    // Check health every 30 seconds
    const interval = setInterval(checkHealth, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return {
    health,
    loading,
    error,
    refresh: checkHealth,
  };
}
