'use client';

import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
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
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-3">
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-goc-primary border border-blue-100">
            Optional
          </span>
          <h2 className="text-lg font-semibold text-goc-ink">
            {t('title')}
          </h2>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isConnected ? (
          <>
            <p className="text-sm text-goc-muted">
              {t('description')}
            </p>
            <Button
              onClick={connectWallet}
              loading={isConnecting}
              className="w-full"
            >
              {t('connectButton')}
            </Button>
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
            <Button
              onClick={switchToMainnet}
              loading={isSwitching}
              className="w-full"
            >
              {t('switchNetwork')}
            </Button>
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
      </CardContent>
    </Card>
  );
}
