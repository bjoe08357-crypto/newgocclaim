import { mainnet } from 'wagmi/chains';

export const TOKEN_SYMBOL = 'GOC';

const DEFAULT_TOKEN_ADDRESS = '0x2e105875765e46d93A301A9FE0e81d98d070200e';
const DEFAULT_DISTRIBUTION_WALLET = '0x111F81BE5C1A9d10eeAecfbDD6EDD0636042AC78';

const clean = (value?: string) => value?.trim();

export const TOKEN_ADDRESS =
  clean(process.env.NEXT_PUBLIC_GOC_TOKEN_ADDRESS) ??
  clean(process.env.NEXT_PUBLIC_DRX_TOKEN_ADDRESS) ??
  clean(process.env.GOC_TOKEN_ADDRESS) ??
  clean(process.env.DRX_TOKEN_ADDRESS) ??
  clean(process.env.TOKEN_CONTRACT) ??
  DEFAULT_TOKEN_ADDRESS;

export const DISTRIBUTION_WALLET =
  clean(process.env.NEXT_PUBLIC_GOC_DISTRIBUTION_WALLET) ??
  clean(process.env.NEXT_PUBLIC_DRX_DISTRIBUTION_WALLET) ??
  clean(process.env.GOC_DISTRIBUTION_WALLET) ??
  clean(process.env.DRX_DISTRIBUTION_WALLET) ??
  clean(process.env.DISTRIBUTION_WALLET) ??
  DEFAULT_DISTRIBUTION_WALLET;

export const CHAIN_ID = Number(clean(process.env.NEXT_PUBLIC_CHAIN_ID) ?? clean(process.env.CHAIN_ID) ?? mainnet.id);
