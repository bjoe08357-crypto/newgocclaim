'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { AddressInputCard } from '@/components/claim/AddressInputCard';
import { ClaimCard } from '@/components/claim/ClaimCard';
import { StepIndicator } from '@/components/claim/StepIndicator';
import { TokenInfoCard } from '@/components/claim/TokenInfoCard';
import { WalletCard } from '@/components/claim/WalletCard';
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { TokenStatCard } from '@/components/ui/TokenStatCard';
import { InfoRow } from '@/components/ui/InfoRow';
import { CopyButton } from '@/components/ui/CopyButton';
import { ToastStack, ToastItem } from '@/components/ui/Toast';
import { LoadingOverlay } from '@/components/ui/LoadingOverlay';
import { useTranslations } from 'next-intl';
import { useClaim } from '@/hooks/useClaim';
import { useWallet } from '@/hooks/useWallet';
import { TOKEN_ADDRESS, DISTRIBUTION_WALLET } from '@/config/token';

export default function ClaimPage() {
  const t = useTranslations('claim');
  const { reset, loading, isClaimed, claimTxHash, errors } = useClaim();
  const { isConnected, isConnecting, isSwitching } = useWallet();
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const prevConnected = useRef(isConnected);
  const prevClaimed = useRef(isClaimed);
  const prevClaimError = useRef('');

  const shorten = (value: string) => `${value.slice(0, 6)}...${value.slice(-4)}`;

  const addToast = useCallback((toast: Omit<ToastItem, 'id'>) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(item => item.id !== id));
    }, 3500);
  }, []);

  useEffect(() => {
    if (!prevConnected.current && isConnected) {
      addToast({ title: 'Wallet connected', message: 'Ready to proceed with claim', variant: 'success' });
    }
    prevConnected.current = isConnected;
  }, [addToast, isConnected]);

  useEffect(() => {
    if (!prevClaimed.current && isClaimed && claimTxHash) {
      addToast({ title: 'Claim successful', message: 'Tokens sent to your wallet', variant: 'success' });
    }
    prevClaimed.current = isClaimed;
  }, [addToast, claimTxHash, isClaimed]);

  useEffect(() => {
    if (errors.claim && errors.claim !== prevClaimError.current) {
      addToast({ title: 'Claim failed', message: errors.claim, variant: 'error' });
      prevClaimError.current = errors.claim;
    }
  }, [addToast, errors.claim]);

  const isBusy = useMemo(
    () => isConnecting || isSwitching || Object.values(loading).some(Boolean),
    [isConnecting, isSwitching, loading]
  );

  return (
    <div className="min-h-screen text-goc-ink relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-24 h-[260px] w-[260px] rounded-full bg-goc-primary/15 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[240px] w-[240px] rounded-full bg-goc-secondary/15 blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:48px_48px]" />
      </div>
      <Navigation variant="claim" />

      {/* Main Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="rounded-2xl bg-goc-surface border border-goc-border shadow-goc-sm p-4">
              <Image
                src="/goc-logo.svg"
                alt="GOC Logo"
                width={72}
                height={72}
                className="h-16 w-16 object-contain"
              />
            </div>
          </div>
          
          <h1 className="text-2xl md:text-3xl font-semibold text-goc-ink mb-2">
            {t('title')}
          </h1>
          <p className="text-goc-muted text-sm md:text-base mb-4">
            {t('description')}
          </p>
          
          <div className="flex justify-center">
            <Button
              onClick={() => {
                if (confirm('Are you sure you want to start over? This will clear all progress.')) {
                  reset();
                }
              }}
              variant="outline"
              size="sm"
              className="text-goc-muted hover:text-goc-primary"
            >
              Reset Progress
            </Button>
          </div>
        </div>

        <div className="space-y-8">
          <StepIndicator />

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.5fr),minmax(0,0.9fr)] gap-6">
            <ClaimCard />
            <TokenInfoCard />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AddressInputCard />
            <WalletCard />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <TokenStatCard
              title="Token Contract"
              description="Verified on Ethereum"
              icon={<span>🔗</span>}
            >
              <InfoRow
                label="Address"
                value={shorten(TOKEN_ADDRESS)}
                mono
                action={<CopyButton value={TOKEN_ADDRESS} label="token contract" />}
              />
            </TokenStatCard>

            <TokenStatCard
              title="Distributor Wallet"
              description="Claim source wallet"
              icon={<span>🧾</span>}
            >
              <InfoRow
                label="Address"
                value={shorten(DISTRIBUTION_WALLET)}
                mono
                action={<CopyButton value={DISTRIBUTION_WALLET} label="distribution wallet" />}
              />
            </TokenStatCard>

            <TokenStatCard
              title="Claim Instructions"
              description="Complete the steps"
              icon={<span>✨</span>}
            >
              <ul className="text-xs text-goc-muted space-y-2">
                <li>• Verify your email and set a recipient wallet.</li>
                <li>• Confirm eligibility and submit your claim.</li>
                <li>• Tokens arrive after on-chain confirmation.</li>
              </ul>
            </TokenStatCard>

            <TokenStatCard
              title="Security Notice"
              description="Stay safe"
              icon={<span>🛡️</span>}
            >
              <ul className="text-xs text-goc-muted space-y-2">
                <li>• Only claim from the official portal.</li>
                <li>• Never share verification codes.</li>
                <li>• Claims are one-time per allocation.</li>
              </ul>
            </TokenStatCard>
          </div>
        </div>
      </main>

      {/* Help Section */}
      <section className="border-t border-goc-border bg-goc-surface-alt mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-goc-ink mb-4">
              Need Help?
            </h2>
            <p className="text-goc-muted mb-6 max-w-2xl mx-auto">
              If you encounter any issues during the claiming process, check our FAQ or contact support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a 
                href="/#faq" 
                className="inline-flex items-center px-4 py-2 border border-goc-border rounded-xl text-sm font-medium text-goc-ink bg-goc-surface hover:border-goc-primary/40 hover:text-goc-primary transition-all duration-200"
              >
                View FAQ
              </a>
              <a 
                href="mailto:support@goc.example" 
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-xl text-sm font-medium text-white transition-all duration-200 shadow-goc bg-goc-primary hover:bg-indigo-500"
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer variant="minimal" />

      <ToastStack toasts={toasts} onDismiss={(id) => setToasts(prev => prev.filter(t => t.id !== id))} />
      <LoadingOverlay active={isBusy} message="Confirm the transaction in your wallet." />
    </div>
  );
}
