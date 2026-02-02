'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { GlassCard } from '@/components/ui/GlassCard';
import { GradientButton } from '@/components/ui/GradientButton';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { InfoRow } from '@/components/ui/InfoRow';
import { Alert } from '@/components/ui/Alert';
import { AnimatedNumber } from '@/components/ui/AnimatedNumber';
import { Button } from '@/components/ui/Button';
import { useClaim } from '@/hooks/useClaim';
import { useTranslations } from 'next-intl';
import { TOKEN_SYMBOL } from '@/config/token';

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

  const canClaim = !!recipientAddress;
  const showSuccessState = isClaimed && claimTxHash;

  const status = loading.claiming
    ? 'pending'
    : allocation?.claimed || isClaimed
    ? 'claimed'
    : allocation
    ? 'eligible'
    : 'not-eligible';

  const statusLabel = loading.claiming
    ? 'Processing'
    : allocation?.claimed || isClaimed
    ? 'Claimed'
    : allocation
    ? 'Eligible'
    : 'Not Eligible';

  const amountValue = useMemo(() => {
    if (!allocation?.amount) return 0;
    const parsed = Number(allocation.amount);
    return Number.isNaN(parsed) ? 0 : parsed;
  }, [allocation?.amount]);

  const amountDecimals = useMemo(() => {
    if (!allocation?.amount) return 0;
    const parts = allocation.amount.split('.');
    if (parts.length < 2) return 0;
    return Math.min(parts[1].length, 2);
  }, [allocation?.amount]);

  const formatAddress = (addr: string | undefined) => {
    if (!addr) return 'Not set';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <GlassCard key={renderKey} className={!canClaim ? 'opacity-90' : ''}>
      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-goc-surface border border-goc-border flex items-center justify-center">
              <Image src="/goc-logo.svg" alt="GOC" width={36} height={36} className="h-9 w-9" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-goc-muted">Claimable</p>
              <div className="flex items-baseline gap-2">
                <AnimatedNumber
                  value={amountValue}
                  decimals={amountDecimals}
                  className="text-4xl font-bold text-goc-ink"
                />
                <span className="text-lg font-semibold text-goc-primary">{TOKEN_SYMBOL}</span>
              </div>
            </div>
          </div>
          <StatusBadge status={status} label={statusLabel} />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <InfoRow label="Recipient Wallet" value={formatAddress(recipientAddress || '')} mono />
          <InfoRow label="Claim Status" value={statusLabel} />
        </div>

        {errors.claim && <Alert variant="error">{errors.claim}</Alert>}

        {showSuccessState ? (
          <div className="space-y-4">
            <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-5 text-center">
              <p className="text-lg font-semibold text-emerald-200">{t('claimComplete')}</p>
              <p className="text-sm text-emerald-200/80">{t('tokensSent')}</p>
            </div>
            <Button
              onClick={() => window.open(`https://etherscan.io/tx/${claimTxHash}`, '_blank')}
              variant="outline"
              className="w-full"
            >
              {t('viewOnEtherscan')}
            </Button>
          </div>
        ) : (
          <>
            <GradientButton
              onClick={handleClaim}
              loading={loading.claiming}
              disabled={!canClaim}
              className="w-full py-4 text-lg hidden sm:inline-flex"
            >
              {getButtonText()}
            </GradientButton>
            <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-goc-border bg-goc-surface/90 backdrop-blur-xl p-4">
              <GradientButton
                onClick={handleClaim}
                loading={loading.claiming}
                disabled={!canClaim}
                className="w-full py-4 text-base"
              >
                {getButtonText()}
              </GradientButton>
            </div>
          </>
        )}

        {history && history.length > 0 && (
          <div className="pt-4 border-t border-goc-border/60">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-goc-ink">Claim History</h3>
              <span className="text-xs text-goc-muted">{history.length} entries</span>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
              {history.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border border-goc-border bg-goc-surface/60 px-3 py-2 text-xs"
                >
                  <div className="font-semibold text-goc-ink">
                    {item.amount} {item.symbol}
                  </div>
                  {item.txHash ? (
                    <a
                      href={`https://etherscan.io/tx/${item.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-goc-primary hover:text-goc-ink transition-colors"
                    >
                      View
                    </a>
                  ) : (
                    <span className="text-goc-muted">Processing</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </GlassCard>
  );
}
