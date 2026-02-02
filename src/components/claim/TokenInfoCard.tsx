'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { TOKEN_ADDRESS, DISTRIBUTION_WALLET, TOKEN_SYMBOL } from '@/config/token';

const shorten = (value: string) => `${value.slice(0, 6)}...${value.slice(-4)}`;

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="text-xs font-medium text-yellow-400 hover:text-yellow-300 transition-colors"
      aria-label={`Copy ${label}`}
      type="button"
    >
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

export function TokenInfoCard() {
  return (
    <Card>
      <CardHeader>
        <h3 className="text-base font-semibold text-white">Token Info</h3>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-400 uppercase tracking-wide">Token</div>
            <div className="text-sm font-semibold text-white">{TOKEN_SYMBOL}</div>
          </div>
          <span className="text-xs text-gray-400">ERC-20</span>
        </div>

        <div className="rounded-xl border border-white/10 bg-black/20 p-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-400 uppercase tracking-wide">Contract</div>
              <div className="text-sm font-mono text-white">{shorten(TOKEN_ADDRESS)}</div>
            </div>
            <CopyButton value={TOKEN_ADDRESS} label="token contract" />
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-black/20 p-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-400 uppercase tracking-wide">Distribution Wallet</div>
              <div className="text-sm font-mono text-white">{shorten(DISTRIBUTION_WALLET)}</div>
            </div>
            <CopyButton value={DISTRIBUTION_WALLET} label="distribution wallet" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
