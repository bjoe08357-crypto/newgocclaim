import React from 'react';
import { useWallet } from '@/hooks/useWallet';
import { useClaim } from '@/hooks/useClaim';

export function StepIndicator() {
  const { isConnected } = useWallet();
  const { isEmailVerified, isClaimed } = useClaim();

  const steps = [
    { label: 'Connect Wallet', done: isConnected },
    { label: 'Verify', done: isEmailVerified },
    { label: 'Claim', done: isClaimed },
    { label: 'Done', done: isClaimed },
  ];

  const currentIndex = steps.findIndex(step => !step.done);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {steps.map((step, index) => {
        const isActive = currentIndex === index;
        return (
          <div
            key={step.label}
            className={`rounded-xl border px-3 py-2 text-xs font-semibold uppercase tracking-wide transition-colors ${
              step.done
                ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200'
                : isActive
                ? 'border-goc-primary/50 bg-goc-primary/15 text-goc-primary'
                : 'border-goc-border bg-goc-surface/60 text-goc-muted'
            }`}
          >
            {step.label}
          </div>
        );
      })}
    </div>
  );
}
