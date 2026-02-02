'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { InfoRow } from '@/components/ui/InfoRow';
import { CopyButton } from '@/components/ui/CopyButton';
import { TOKEN_ADDRESS, DISTRIBUTION_WALLET, TOKEN_SYMBOL } from '@/config/token';

const shorten = (value: string) => `${value.slice(0, 6)}...${value.slice(-4)}`;

export function TokenInfoCard() {
  return (
    <GlassCard>
      <div className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-goc-muted uppercase tracking-wide">Token</div>
            <div className="text-base font-semibold text-goc-ink">{TOKEN_SYMBOL}</div>
          </div>
          <span className="text-xs text-goc-muted">ERC-20</span>
        </div>

        <InfoRow
          label="Contract"
          value={shorten(TOKEN_ADDRESS)}
          mono
          action={<CopyButton value={TOKEN_ADDRESS} label="token contract" />}
        />

        <InfoRow
          label="Distribution Wallet"
          value={shorten(DISTRIBUTION_WALLET)}
          mono
          action={<CopyButton value={DISTRIBUTION_WALLET} label="distribution wallet" />}
        />
      </div>
    </GlassCard>
  );
}
