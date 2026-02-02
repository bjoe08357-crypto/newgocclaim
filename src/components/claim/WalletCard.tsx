'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { GradientButton } from '@/components/ui/GradientButton';
import { Pill } from '@/components/ui/Pill';
import { useWallet } from '@/hooks/useWallet';
import { useTranslations } from 'next-intl';

export function WalletCard() {
  const t = useTranslations('claim.steps.connectWallet');
  const {
    address,
    isConnected,
    isWrongNetwork,
    isConnecting,
    isSwitching,
    connectWallet,
    switchToMainnet,
    disconnect,
  } = useWallet();

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <GlassCard>
      <div className="p-6 space-y-4">
        <div className="flex items-center space-x-3">
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-goc-primary/15 text-goc-primary border border-goc-primary/30">
            Optional
          </span>
          <h2 className="text-lg font-semibold text-goc-ink">
            {t('title')}
          </h2>
        </div>
        {!isConnected ? (
          <>
            <p className="text-sm text-goc-muted">
              {t('description')}
            </p>
            <GradientButton
              onClick={connectWallet}
              loading={isConnecting}
              className="w-full"
            >
              {t('connectButton')}
            </GradientButton>
          </>
        ) : isWrongNetwork ? (
          <>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-goc-ink">
                  {formatAddress(address!)}
                </p>
                <Pill variant="warning" className="mt-1">
                  {t('wrongNetwork')}
                </Pill>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => disconnect()}
              >
                {t('disconnect')}
              </Button>
            </div>
            <p className="text-sm text-goc-muted">
              Please switch to Ethereum Mainnet to continue.
            </p>
            <GradientButton
              onClick={switchToMainnet}
              loading={isSwitching}
              className="w-full"
            >
              {t('switchNetwork')}
            </GradientButton>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-goc-ink">
                  {formatAddress(address!)}
                </p>
                <Pill variant="success" className="mt-1">
                  {t('connectedTo')}
                </Pill>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => disconnect()}
              >
                {t('disconnect')}
              </Button>
            </div>
            <p className="text-sm text-goc-muted">
              Wallet connected successfully. You can now proceed to verify your email.
            </p>
          </>
        )}
      </div>
    </GlassCard>
  );
}
