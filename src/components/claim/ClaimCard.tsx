'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { useClaim } from '@/hooks/useClaim';
import { useTranslations } from 'next-intl';

export function ClaimCard() {
  const t = useTranslations('claim.steps.claimTokens');
  const {
    allocation,
    history,
    recipientAddress,
    isClaimed,
    claimTxHash,
    loading,
    errors,
    claimTokens,
  } = useClaim();

  // Force re-render when recipientAddress changes
  const [renderKey, setRenderKey] = useState(0);

  useEffect(() => {
    setRenderKey(prev => prev + 1);
  }, [recipientAddress]);

  const handleClaim = async () => {
    await claimTokens();
  };

  const getButtonText = () => {
    if (!recipientAddress) return t('enterAddressToClaim');
    if (!allocation) return t('verifyEmailToClaim');
    if (allocation.claimed || isClaimed) return t('alreadyClaimed');
    return t('claimButton');
  };

  // Allow claiming if we have a recipient address (let backend validate)
  const canClaim = !!recipientAddress;

  const formatAddress = (addr: string | undefined) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const showSuccessState = isClaimed && claimTxHash;
  
  return (
    <Card key={renderKey} className={!canClaim ? 'opacity-60' : ''}>
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-goc-primary text-white font-bold text-sm">
            2
          </div>
          <h2 className="text-lg font-semibold text-goc-ink">
            {t('title')}
          </h2>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {allocation && !allocation.claimed && (
          <div className="relative overflow-hidden border border-goc-border rounded-2xl p-6 bg-goc-surface-alt transition-all duration-200">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-goc-primary opacity-20"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-goc-primary"></span>
                  </span>
                  <p className="text-sm font-bold text-goc-primary uppercase tracking-wider">
                    {t('readyToClaim')}
                  </p>
                </div>
                <div className="px-2 py-1 rounded bg-blue-50 border border-blue-100 text-xs text-goc-primary font-mono">
                  READY
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col p-4 rounded-lg bg-goc-surface border border-goc-border">
                  <span className="text-xs text-goc-muted uppercase tracking-wide mb-1">{t('amount')}</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-goc-ink tracking-tight">{allocation.amount}</span>
                    <span className="text-lg font-medium text-goc-primary">{allocation.symbol}</span>
                  </div>
                </div>

                <div className="flex flex-col p-3 rounded-lg bg-goc-surface border border-goc-border">
                  <span className="text-xs text-goc-muted uppercase tracking-wide mb-1">{t('recipient')}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="font-mono text-sm text-goc-ink">{formatAddress(recipientAddress || '')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {allocation?.claimed && !showSuccessState && (
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 flex items-start gap-3">
            <svg className="w-5 h-5 text-goc-primary mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="text-sm font-medium text-goc-primary mb-1">{t('alreadyClaimed')}</h4>
              <p className="text-xs text-goc-muted">You have claimed all your available tokens. Check back later for new rewards.</p>
            </div>
          </div>
        )}

        {history && history.length > 0 && (
          <div className="pt-4 border-t border-goc-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-goc-ink flex items-center gap-2">
                <svg className="w-4 h-4 text-goc-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Claim History
              </h3>
              <span className="text-xs text-goc-muted bg-goc-surface-alt px-2 py-1 rounded-full">{history.length} Claims</span>
            </div>
            
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {history.map((item, index) => (
                <div
                  key={index}
                  className="group flex justify-between items-center p-3 rounded-lg bg-goc-surface-alt border border-goc-border hover:border-goc-primary/30 transition-all duration-200"
                >
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-goc-ink">{item.amount}</span>
                      <span className="text-xs font-medium text-goc-primary">{item.symbol}</span>
                    </div>
                    <span className="text-xs text-goc-muted mt-0.5">
                      {item.date ? new Date(item.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'Unknown date'}
                    </span>
                  </div>
                  
                  {item.txHash ? (
                    <a
                      href={`https://etherscan.io/tx/${item.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-goc-surface text-xs font-medium text-goc-muted hover:text-goc-ink hover:border-goc-primary/30 transition-all duration-200 group-hover:border-goc-border border border-goc-border"
                    >
                      <span>TX</span>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  ) : (
                    <span className="text-xs text-goc-muted italic">Processing</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {errors.claim && (
          <Alert variant="error">
            {errors.claim}
          </Alert>
        )}

        {showSuccessState ? (
          <div className="space-y-4 animate-fade-in">
            <div className="border rounded-xl p-6 bg-green-50 border-green-200 text-center">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-lg font-bold text-green-700 mb-1">
                {t('claimComplete')}
              </p>
              <p className="text-sm text-green-700/80">
                {t('tokensSent')}
              </p>
            </div>
            
            <Button
              onClick={() => window.open(`https://etherscan.io/tx/${claimTxHash}`, '_blank')}
              variant="outline"
              className="w-full group hover:border-green-500/50 hover:text-green-700"
            >
              <span className="flex items-center justify-center gap-2">
                {t('viewOnEtherscan')}
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </span>
            </Button>
          </div>
        ) : (
          <Button
            onClick={handleClaim}
            loading={loading.claiming}
            disabled={!canClaim}
            className="w-full py-6 text-lg font-bold"
          >
            {getButtonText()}
          </Button>
        )}

        <div className="grid grid-cols-3 gap-2 pt-2">
          <div className="text-center p-2 rounded-lg bg-goc-surface-alt border border-goc-border">
            <div className="text-xs text-goc-muted mb-1">Gas Fees</div>
            <div className="text-xs font-medium text-green-700">Covered</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-goc-surface-alt border border-goc-border">
            <div className="text-xs text-goc-muted mb-1">Speed</div>
            <div className="text-xs font-medium text-goc-primary">Instant</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-goc-surface-alt border border-goc-border">
            <div className="text-xs text-goc-muted mb-1">Security</div>
            <div className="text-xs font-medium text-blue-600">Audited</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
