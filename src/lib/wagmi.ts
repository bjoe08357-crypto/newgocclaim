import { http, createConfig } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { injected, metaMask, walletConnect } from 'wagmi/connectors';

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'demo-project-id';

export const config = createConfig({
  chains: [mainnet],
  connectors: [
    injected(),
    metaMask(),
    walletConnect({
      projectId,
    }),
  ],
  transports: {
    [mainnet.id]: http(),
  },
});

declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}
