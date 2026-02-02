import React from 'react';
import { useWallet } from '@/hooks/useWallet';
import { GradientButton } from '@/components/ui/GradientButton';

const formatAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

export function WalletBadge() {
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

  const networkLabel = !isConnected
    ? 'No Wallet'
    : isWrongNetwork
    ? 'Wrong Network'
    : 'Ethereum Mainnet';

  const networkStyle = !isConnected
    ? 'border-slate-500/40 bg-slate-500/10 text-slate-300'
    : isWrongNetwork
    ? 'border-amber-500/40 bg-amber-500/10 text-amber-200'
    : 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200';

  return (
    <div className="flex items-center gap-3">
      <span
        className={`hidden md:inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${networkStyle}`}
      >
        <span className="h-2 w-2 rounded-full bg-current opacity-80"></span>
        {networkLabel}
      </span>
      {!isConnected ? (
        <GradientButton
          onClick={connectWallet}
          loading={isConnecting}
          className="px-4 py-2 text-sm"
        >
          Connect Wallet
        </GradientButton>
      ) : isWrongNetwork ? (
        <GradientButton
          onClick={switchToMainnet}
          loading={isSwitching}
          className="px-4 py-2 text-sm"
        >
          Switch Network
        </GradientButton>
      ) : (
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center rounded-full border border-goc-border bg-goc-surface/70 px-3 py-1 text-xs font-mono text-goc-ink">
            {formatAddress(address!)}
          </span>
          <button
            onClick={() => disconnect()}
            className="text-xs text-goc-muted hover:text-goc-ink transition-colors"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}
