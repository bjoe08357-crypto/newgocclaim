import { useState, useEffect } from 'react';

interface AdminStats {
  totalAllocations: number;
  claimedAllocations: number;
  pendingClaims: number;
  totalValue: number;
  claimedValue: number;
  claimPercentage: number;
}

export function useAdminStats() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);

    try {
      const authToken = sessionStorage.getItem('admin-auth');
      if (!authToken) {
        throw new Error('Not authenticated');
      }

      const response = await fetch('/api/admin/stats', {
        headers: {
          'Authorization': `Basic ${authToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: Failed to fetch statistics`);
      }

      const data = await response.json();
      setStats(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Listen for authentication events
    const handleAuthEvent = () => {
      fetchStats();
    };

    // Check initial auth state
    const authToken = sessionStorage.getItem('admin-auth');
    if (authToken) {
      fetchStats();
    } else {
      setLoading(false);
      setError('Please authenticate to view statistics');
    }

    // Listen for authentication events
    window.addEventListener('admin-authenticated', handleAuthEvent);
    
    // Refresh stats every 30 seconds if authenticated
    const interval = setInterval(() => {
      const currentAuthToken = sessionStorage.getItem('admin-auth');
      if (currentAuthToken) {
        fetchStats();
      }
    }, 30000);
    
    return () => {
      window.removeEventListener('admin-authenticated', handleAuthEvent);
      clearInterval(interval);
    };
  }, []);

  return {
    stats,
    loading,
    error,
    refresh: fetchStats,
  };
}
