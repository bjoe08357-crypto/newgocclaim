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
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
            style={{ background: 'linear-gradient(135deg, #7C5CFF 0%, #22D3EE 100%)' }}
          >
            3
          </div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-white">
              {t('title')}
            </h2>
            <Pill variant="info">{t('optionalLabel')}</Pill>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isConnected ? (
          <>
            <p className="text-sm text-gray-300">
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
                <p className="text-sm font-medium text-white">
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
            <p className="text-sm text-gray-300">
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
                <p className="text-sm font-medium text-white">
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
            <p className="text-sm text-gray-300">
              Wallet connected successfully. You can now proceed to verify your email.
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
