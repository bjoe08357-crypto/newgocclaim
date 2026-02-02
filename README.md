# GOC Claim Portal

A secure, privacy-first token claiming portal built with Next.js, TypeScript, and Ethereum integration.

## Features

- 🔐 **Secure Email Verification**: HMAC-hashed emails with time-limited verification codes
- 🔗 **Wallet Integration**: Connect with MetaMask, WalletConnect, and other Web3 wallets
- ✍️ **SIWE Authentication**: Sign-In with Ethereum for wallet ownership verification
- 💰 **Gas-Free Claims**: Server-paid gas fees for token transfers
- 🛡️ **Anti-Abuse Protection**: Rate limiting, captcha, and one-time claim enforcement
- 🎨 **Modern UI**: Beautiful, responsive interface built with Tailwind CSS
- 📊 **Admin Dashboard**: CSV upload, health monitoring, and allocation management

## Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS
- **Blockchain**: ethers.js v6, wagmi v2, SIWE
- **Database**: PostgreSQL with Prisma ORM
- **Security**: JWT, rate-limiter-flexible, Cloudflare Turnstile
- **Email**: Nodemailer with SMTP support
- **Monitoring**: Sentry integration

## Quick Start

### 1. Environment Setup

Copy the environment template and fill in your values:

\`\`\`bash
cp env.example .env.local
\`\`\`

Required environment variables:

\`\`\`bash
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/goc_claim

# Security
PEPPER=your-long-random-string-for-hmac-of-emails-at-least-32-chars
JWT_SECRET=your-jwt-secret-for-session-tokens-at-least-32-chars

# Token Configuration
GOC_TOKEN_ADDRESS=0x2e105875765e46d93A301A9FE0e81d98d070200e
GOC_DISTRIBUTION_WALLET=0x111F81BE5C1A9d10eeAecfbDD6EDD0636042AC78
TOKEN_DECIMALS=18
DISTRIBUTOR_PRIVATE_KEY=your-distributor-wallet-private-key

# Ethereum RPC
RPC_URL=https://eth-mainnet.g.alchemy.com/v2/your-api-key

# Email (SMTP)
EMAIL_FROM=claims@goc.example
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-smtp-username
SMTP_PASS=your-smtp-password

# Cloudflare Turnstile
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your-turnstile-site-key
TURNSTILE_SECRET_KEY=your-turnstile-secret-key

# App Configuration
NEXT_PUBLIC_APP_URL=https://claim.goc.example
NEXT_PUBLIC_GOC_TOKEN_ADDRESS=0x2e105875765e46d93A301A9FE0e81d98d070200e
NEXT_PUBLIC_GOC_DISTRIBUTION_WALLET=0x111F81BE5C1A9d10eeAecfbDD6EDD0636042AC78

# Admin Auth (Basic Auth)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-admin-password
\`\`\`

### 2. Database Setup

\`\`\`bash
# Install dependencies
npm install

# Setup database (creates tables)
npm run db:push

# Or use migrations for production
npm run db:migrate
\`\`\`

### 3. Development

\`\`\`bash
# Start development server
npm run dev

# Open http://localhost:3000
\`\`\`

### 4. Upload Allocations (Admin)

1. Visit `/admin` and authenticate with your admin credentials
2. Upload CSV data in format: \`email,amount\`
3. Monitor token health and system status

Example CSV:
\`\`\`csv
email,amount
alice@example.com,1000.5
bob@example.com,2500
charlie@example.com,750.25
\`\`\`

## API Endpoints

### Public Endpoints

- \`POST /api/request-email-code\` - Request verification code
- \`POST /api/exchange-email-code\` - Exchange code for session token
- \`POST /api/get-sign-challenge\` - Get SIWE challenge (requires auth)
- \`POST /api/submit-signature\` - Submit SIWE signature (requires auth)
- \`POST /api/claim\` - Claim tokens (requires auth)
- \`GET /api/health/token\` - Check token contract health

### Admin Endpoints

- \`POST /api/admin/upload-csv\` - Upload allocation CSV (requires basic auth)

## Security Features

### Privacy Protection
- Email addresses are HMAC-hashed before storage
- Raw emails encrypted with AES-256-CBC for admin lookup only
- No email addresses exposed in logs or responses

### Anti-Abuse Measures
- Rate limiting per IP and per email
- Cloudflare Turnstile captcha verification
- Time-limited verification codes (15 minutes)
- One-time claim enforcement
- Generic responses to prevent enumeration

### Wallet Security
- SIWE (Sign-In with Ethereum) for wallet ownership proof
- Nonce-based replay protection
- Address binding to prevent wallet swapping
- Server-side transaction execution (gas-free for users)

## Deployment Checklist

### Pre-Launch
- [ ] Verify token contract address and decimals
- [ ] Fund distributor wallet with tokens and ETH
- [ ] Configure email domain (SPF, DKIM, DMARC)
- [ ] Set up Cloudflare Turnstile
- [ ] Test CSV upload and claiming flow
- [ ] Configure rate limits for production load
- [ ] Set up database backups
- [ ] Configure Sentry for error tracking

### Production Environment
- [ ] Use secure private key management (AWS KMS/HSM)
- [ ] Enable HTTPS with valid SSL certificate
- [ ] Set up monitoring and alerting
- [ ] Configure log aggregation
- [ ] Set up database connection pooling
- [ ] Enable database SSL connections
- [ ] Configure CORS policies
- [ ] Set up CDN for static assets

### Security Hardening
- [ ] Enable security headers (CSP, HSTS, etc.)
- [ ] Configure firewall rules
- [ ] Set up intrusion detection
- [ ] Enable audit logging
- [ ] Implement backup and disaster recovery
- [ ] Set up health check endpoints
- [ ] Configure automated security scanning

## Monitoring

### Health Checks
- Token contract bytecode verification
- Token symbol and decimals validation
- Distributor wallet balance monitoring
- Database connectivity checks
- Email service availability

### Key Metrics
- Successful claims vs. failures
- Email verification rates
- Rate limit hits
- Error rates by endpoint
- Average claim processing time
- Gas costs per transaction

### Alerts
- Low distributor ETH balance
- Low token balance
- High error rates
- Rate limit threshold breaches
- Database connectivity issues
- Email delivery failures

## Development Scripts

\`\`\`bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server

# Database
npm run db:generate      # Generate Prisma client
npm run db:push          # Push schema to database
npm run db:migrate       # Run database migrations
npm run db:studio        # Open Prisma Studio

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint errors
npm run format           # Format code with Prettier
npm run format:check     # Check code formatting
npm run type-check       # TypeScript type checking
\`\`\`

## Project Structure

\`\`\`
src/
├── app/                 # Next.js App Router pages
│   ├── api/            # API routes
│   ├── claim/          # Claim flow page
│   └── admin/          # Admin dashboard
├── components/         # React components
│   ├── ui/             # Base UI components
│   ├── claim/          # Claim-specific components
│   ├── admin/          # Admin components
│   └── providers/      # Context providers
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries
│   ├── crypto.ts       # Encryption and hashing
│   ├── email.ts        # Email sending
│   ├── ethers.ts       # Blockchain interactions
│   ├── jwt.ts          # JWT token handling
│   ├── prisma.ts       # Database client
│   ├── rateLimit.ts    # Rate limiting
│   ├── siwe.ts         # Sign-In with Ethereum
│   ├── turnstile.ts    # Captcha verification
│   └── wagmi.ts        # Wallet connection config
└── prisma/
    └── schema.prisma   # Database schema
\`\`\`

## Support

For technical support or questions:
- Check the FAQ section on the main page
- Review this README for common setup issues
- Contact: support@goc.example

## License

Copyright © 2025 GOC. All rights reserved.