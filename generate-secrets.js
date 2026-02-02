#!/usr/bin/env node

const crypto = require('crypto');

console.log('🔐 GOC Claim Portal - Environment Secrets Generator\n');

console.log('Copy these values to your .env.local file:\n');

console.log('# Security Keys (Generated)');
console.log(`PEPPER=${crypto.randomBytes(32).toString('hex')}`);
console.log(`JWT_SECRET=${crypto.randomBytes(32).toString('hex')}\n`);

console.log('# Ethereum Configuration (Update these)');
console.log('GOC_TOKEN_ADDRESS=0x2e105875765e46d93A301A9FE0e81d98d070200e');
console.log('GOC_DISTRIBUTION_WALLET=0x111F81BE5C1A9d10eeAecfbDD6EDD0636042AC78');
console.log('TOKEN_DECIMALS=18');
console.log('DISTRIBUTOR_PRIVATE_KEY=0x1234567890abcdef... # Your distributor wallet private key');
console.log('RPC_URL=https://eth-mainnet.g.alchemy.com/v2/your-api-key # Get from Alchemy\n');

console.log('# Database (Update for your setup)');
console.log('DATABASE_URL=postgresql://postgres:password@localhost:5432/goc_claim\n');

console.log('# Email (Configure with your provider)');
console.log('EMAIL_FROM=claims@yourdomain.com');
console.log('SMTP_HOST=smtp.gmail.com');
console.log('SMTP_PORT=587');
console.log('SMTP_USER=your-email@gmail.com');
console.log('SMTP_PASS=your-gmail-app-password\n');

console.log('# App Configuration');
console.log('NEXT_PUBLIC_APP_URL=http://localhost:3000');
console.log('NEXT_PUBLIC_GOC_TOKEN_ADDRESS=0x2e105875765e46d93A301A9FE0e81d98d070200e');
console.log('NEXT_PUBLIC_GOC_DISTRIBUTION_WALLET=0x111F81BE5C1A9d10eeAecfbDD6EDD0636042AC78\n');

console.log('# Cloudflare Turnstile (Get from Cloudflare Dashboard)');
console.log('NEXT_PUBLIC_TURNSTILE_SITE_KEY=your-site-key');
console.log('TURNSTILE_SECRET_KEY=your-secret-key\n');

console.log('# Admin Access');
console.log('ADMIN_USERNAME=admin');
console.log('ADMIN_PASSWORD=your-secure-password\n');

console.log('📚 For detailed setup instructions, see ENV_SETUP_GUIDE.md');
console.log('🚀 After setup, run: npm run db:push && npm run dev');
