import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  env: {
    // Provide dummy values for build time
    DATABASE_URL: process.env.DATABASE_URL || 'postgresql://dummy:dummy@localhost:5432/dummy',
    PEPPER: process.env.PEPPER || 'dummy-pepper-for-build-at-least-32-characters-long',
    JWT_SECRET: process.env.JWT_SECRET || 'dummy-jwt-secret-for-build-at-least-32-characters-long',
    GOC_TOKEN_ADDRESS: process.env.GOC_TOKEN_ADDRESS || '0x2e105875765e46d93A301A9FE0e81d98d070200e',
    GOC_DISTRIBUTION_WALLET: process.env.GOC_DISTRIBUTION_WALLET || '0x111F81BE5C1A9d10eeAecfbDD6EDD0636042AC78',
    TOKEN_CONTRACT: process.env.TOKEN_CONTRACT || '0x2e105875765e46d93A301A9FE0e81d98d070200e',
    TOKEN_DECIMALS: process.env.TOKEN_DECIMALS || '18',
    DISTRIBUTOR_PRIVATE_KEY: process.env.DISTRIBUTOR_PRIVATE_KEY || '0x1234567890123456789012345678901234567890123456789012345678901234',
    RPC_URL: process.env.RPC_URL || 'https://eth-mainnet.g.alchemy.com/v2/dummy-api-key',
    EMAIL_FROM: process.env.EMAIL_FROM || 'claims@goc.example',
    SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
    SMTP_PORT: process.env.SMTP_PORT || '587',
    SMTP_USER: process.env.SMTP_USER || 'dummy',
    SMTP_PASS: process.env.SMTP_PASS || 'dummy',
    TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY || 'dummy-turnstile-secret-key',
    ADMIN_USERNAME: process.env.ADMIN_USERNAME || 'admin',
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'dummy-admin-password',
  },
};

export default withNextIntl(nextConfig);
