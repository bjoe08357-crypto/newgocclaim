'use client';

import React from 'react';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { useTokenHealth } from '@/hooks/useTokenHealth';
import { useTranslations } from 'next-intl';

export function HealthBanner() {
  const t = useTranslations('admin.healthBanner');
  const { health, loading, error, refresh } = useTokenHealth();

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-16 bg-gray-200 rounded-md"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="error">
        <div className="flex items-center justify-between">
          <div>
            <strong>Health Check Failed:</strong> {error}
          </div>
          <Button size="sm" onClick={refresh}>
            Retry
          </Button>
        </div>
      </Alert>
    );
  }

  if (!health) {
    return null;
  }

  if (health.ok) {
    return (
      <Alert variant="success">
        <div className="flex items-center justify-between">
          <div>
            <strong>{t('tokenHealth')} - {t('healthy')}</strong>
            <div className="text-sm mt-1">
              {health.symbol} • {health.decimals} decimals • {health.contract}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-green-600">Claims enabled</span>
            <Button size="sm" variant="outline" onClick={refresh}>
              Refresh
            </Button>
          </div>
        </div>
      </Alert>
    );
  }

  return (
    <Alert variant="error">
      <div className="flex items-center justify-between">
        <div>
          <strong>Token Contract Issue</strong>
          <div className="text-sm mt-1">{health.reason}</div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-red-600">Claims disabled</span>
          <Button size="sm" variant="outline" onClick={refresh}>
            Refresh
          </Button>
        </div>
      </div>
    </Alert>
  );
}
