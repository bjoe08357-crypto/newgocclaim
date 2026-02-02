'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Pill } from '@/components/ui/Pill';
import { Alert } from '@/components/ui/Alert';
import { useClaim } from '@/hooks/useClaim';
import { useWallet } from '@/hooks/useWallet';
import { useTranslations } from 'next-intl';

export function SignatureCard() {
  const t = useTranslations('claim.steps.signMessage');
  const { address, isConnected } = useWallet();
  const [forceUpdate, setForceUpdate] = useState(0);
  
  const {
    isSigned,
    loading,
    errors,
    signMessage,
    lastUpdated,
  } = useClaim();

  // Listen for state update events
  useEffect(() => {
    const handleStateUpdate = () => {
      setForceUpdate(prev => prev + 1);
    };
    
    window.addEventListener('claim-state-updated', handleStateUpdate);
    return () => window.removeEventListener('claim-state-updated', handleStateUpdate);
  }, []);

  const handleSign = async () => {
    if (!address) return;
    const result = await signMessage(address);
    if (result.success) {
      // Force all components to re-render
      setTimeout(() => {
        window.dispatchEvent(new Event('claim-state-updated'));
      }, 100);
    }
  };

  // Always allow signing if wallet is connected (let backend validate)
  const canSign = isConnected;
  const showSuccessState = isSigned;

  return (
    <Card key={`${lastUpdated}-${forceUpdate}`} className={!canSign ? 'opacity-60' : ''}>
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-goc-primary text-white font-bold text-sm">
            3
          </div>
          <h2 className="text-lg font-semibold text-goc-ink">
            {t('title')}
          </h2>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-goc-muted">
          {t('description')}
        </p>

        {!isConnected && (
          <Alert variant="info">
            Connect your wallet to continue.
          </Alert>
        )}

        {errors.signature && (
          <Alert variant="error">
            {errors.signature}
          </Alert>
        )}

        {showSuccessState ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-goc-ink">
                  {t('messageSigned')}
                </p>
                <Pill variant="success" className="mt-1">
                  {t('messageSigned')} ✓
                </Pill>
              </div>
            </div>
            
            <p className="text-sm text-goc-muted">
              Your wallet ownership has been confirmed. You can now proceed to claim your tokens.
            </p>
          </div>
        ) : (
          <Button
            onClick={handleSign}
            loading={loading.signing}
            disabled={!canSign}
            className="w-full"
          >
            {!isConnected ? 'Connect Wallet First' : t('signButton')}
          </Button>
        )}

        <p className="text-xs text-goc-muted text-center">
          This signature doesn&apos;t cost any gas and proves wallet ownership.
        </p>
      </CardContent>
    </Card>
  );
}
