# Environment Setup Guide

## Required Environment Variables

### 🗄️ Database Configuration

```bash
# PostgreSQL connection string
DATABASE_URL=postgresql://username:password@localhost:5432/goc_claim
```

**How to set up:**
1. **Local PostgreSQL:**
   ```bash
   # Install PostgreSQL (macOS)
   brew install postgresql
   brew services start postgresql
   
   # Create database
   createdb goc_claim
   
   # Example URL
   DATABASE_URL=postgresql://postgres:password@localhost:5432/goc_claim
   ```

2. **Cloud Database (Recommended for production):**
   - **Supabase:** Free tier available, get URL from dashboard
   - **Railway:** `railway.app` - PostgreSQL addon
   - **PlanetScale:** MySQL alternative with PostgreSQL compatibility
   - **Neon:** Serverless PostgreSQL

### 🔐 Security Configuration

```bash
# Cryptographic pepper for email hashing (32+ chars)
PEPPER=your-super-secret-pepper-string-at-least-32-characters-long-12345

# JWT secret for session tokens (32+ chars)  
JWT_SECRET=your-jwt-secret-key-for-sessions-at-least-32-characters-long-67890
```

**How to generate:**
```bash
# Generate random strings
openssl rand -hex 32
# or
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 💰 Token & Blockchain Configuration

```bash
# Your ERC20 token contract address
GOC_TOKEN_ADDRESS=0x2e105875765e46d93A301A9FE0e81d98d070200e
GOC_DISTRIBUTION_WALLET=0x111F81BE5C1A9d10eeAecfbDD6EDD0636042AC78
TOKEN_DECIMALS=18

# Distributor wallet private key (holds the tokens to distribute)
DISTRIBUTOR_PRIVATE_KEY=0x1234567890abcdef...

# Ethereum RPC endpoint
RPC_URL=https://eth-mainnet.g.alchemy.com/v2/your-api-key
```

**How to set up:**

1. **RPC Provider (Choose one):**
   - **Alchemy:** Sign up at `alchemy.com`, create app, get API key
   - **Infura:** Sign up at `infura.io`, create project, get endpoint
   - **QuickNode:** Premium option with better performance
   
   Example URLs:
   ```bash
   # Alchemy
   RPC_URL=https://eth-mainnet.g.alchemy.com/v2/your-api-key
   
   # Infura
   RPC_URL=https://mainnet.infura.io/v3/your-project-id
   ```

2. **Distributor Wallet:**
   ```bash
   # Create a new wallet for distributing tokens
   # NEVER use your main wallet's private key
   # Fund this wallet with:
   # - Your ERC20 tokens (for distribution)
   # - ETH (for gas fees)
   
   # Get private key from wallet (MetaMask -> Account Details -> Export Private Key)
   DISTRIBUTOR_PRIVATE_KEY=0xYourPrivateKeyHere
   ```

3. **Token Contract:**
   ```bash
   # Your ERC20 token contract address on Ethereum mainnet
   GOC_TOKEN_ADDRESS=0xYourTokenContractAddress
   GOC_DISTRIBUTION_WALLET=0xYourDistributionWallet
   TOKEN_DECIMALS=18  # Usually 18, check your token
   
   # Public variables for UI display
   NEXT_PUBLIC_GOC_TOKEN_ADDRESS=0xYourTokenContractAddress
   NEXT_PUBLIC_GOC_DISTRIBUTION_WALLET=0xYourDistributionWallet
   ```

### 📧 Email Configuration

```bash
# Email settings for sending verification codes
EMAIL_FROM=claims@yourdomain.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

**Email Provider Options:**

1. **Gmail (Easy setup):**
   ```bash
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-gmail@gmail.com
   SMTP_PASS=your-app-password  # Not your regular password!
   ```
   
   Setup steps:
   - Enable 2FA on your Google account
   - Generate App Password: Google Account → Security → App passwords
   - Use the 16-character app password

2. **SendGrid (Recommended for production):**
   ```bash
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_USER=apikey
   SMTP_PASS=your-sendgrid-api-key
   ```

3. **AWS SES:**
   ```bash
   SMTP_HOST=email-smtp.us-east-1.amazonaws.com
   SMTP_PORT=587
   SMTP_USER=your-ses-smtp-username
   SMTP_PASS=your-ses-smtp-password
   ```

### 🛡️ Captcha Configuration (Cloudflare Turnstile)

```bash
# Cloudflare Turnstile (free alternative to reCAPTCHA)
NEXT_PUBLIC_TURNSTILE_SITE_KEY=0x4AAAAAAABkMYinukPVWNqF
TURNSTILE_SECRET_KEY=0x4AAAAAAABkMYinukPVWNqG
```

**How to set up:**
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to "Turnstile" in the sidebar
3. Create a new site
4. Get your Site Key (public) and Secret Key (private)
5. Add your domain to allowed domains

**Free alternatives:**
- Use dummy keys for development: `0x4AAAAAAABkMYinukPVWNqF`
- The app will work without captcha if keys are not configured

### 🌐 App Configuration

```bash
# Your app's public URL
NEXT_PUBLIC_APP_URL=https://claim.yourdomain.com

# For local development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 👨‍💼 Admin Configuration

```bash
# Basic auth for admin dashboard
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-very-secure-admin-password-123!
```

**Security note:** Use a strong password! This protects your admin panel.

### 📊 Optional: Sentry (Error Tracking)

```bash
# Optional - for error tracking in production
SENTRY_DSN=https://your-dsn@sentry.io/project-id
NEXT_PUBLIC_SENTRY_DSN=https://your-public-dsn@sentry.io/project-id
```

## 📝 Complete Example .env.local

Here's a complete example with realistic values:

```bash
# Database
DATABASE_URL=postgresql://postgres:mypassword@localhost:5432/goc_claim

# Crypto (generate these with: openssl rand -hex 32)
PEPPER=a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456
JWT_SECRET=9876543210fedcba0987654321fedcba1234567890abcdef1234567890abcdef

# Token Configuration
GOC_TOKEN_ADDRESS=0x2e105875765e46d93A301A9FE0e81d98d070200e
GOC_DISTRIBUTION_WALLET=0x111F81BE5C1A9d10eeAecfbDD6EDD0636042AC78
TOKEN_DECIMALS=18
DISTRIBUTOR_PRIVATE_KEY=0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef

# Ethereum RPC
RPC_URL=https://eth-mainnet.g.alchemy.com/v2/abc123def456ghi789

# Email Configuration
EMAIL_FROM=claims@mycompany.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=claims@mycompany.com
SMTP_PASS=abcd efgh ijkl mnop

# Cloudflare Turnstile
NEXT_PUBLIC_TURNSTILE_SITE_KEY=0x4AAAAAAABkMYinukPVWNqF
TURNSTILE_SECRET_KEY=0x4AAAAAAABkMYinukPVWNqG

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_GOC_TOKEN_ADDRESS=0x2e105875765e46d93A301A9FE0e81d98d070200e
NEXT_PUBLIC_GOC_DISTRIBUTION_WALLET=0x111F81BE5C1A9d10eeAecfbDD6EDD0636042AC78

# Admin Authentication
ADMIN_USERNAME=admin
ADMIN_PASSWORD=SuperSecurePassword123!

# Optional: Sentry
# SENTRY_DSN=https://your-dsn@sentry.io/project-id
# NEXT_PUBLIC_SENTRY_DSN=https://your-public-dsn@sentry.io/project-id
```

## 🚀 Quick Start Commands

After setting up your `.env.local`:

```bash
# Install dependencies
npm install

# Generate Prisma client
npm run db:generate

# Set up database tables
npm run db:push

# Start development server
npm run dev
```

## 🔍 Testing Your Setup

1. **Database:** Visit `http://localhost:3000/api/health/token`
2. **Email:** Try the claim flow with a test email
3. **Admin:** Visit `http://localhost:3000/admin` with your admin credentials
4. **Blockchain:** Check the health endpoint shows your token info

## ⚠️ Security Warnings

- **Never commit `.env.local` to git**
- **Use environment variables or secrets management in production**
- **Generate strong, unique passwords and keys**
- **Use a dedicated distributor wallet, not your main wallet**
- **Enable 2FA on all service accounts**

## 🆘 Troubleshooting

**Common issues:**
- `PEPPER environment variable is required` → Check your `.env.local` file exists and has the PEPPER variable
- `Database connection failed` → Verify your DATABASE_URL is correct and database is running
- `RPC call failed` → Check your RPC_URL and API key
- `Email sending failed` → Verify SMTP credentials and app password for Gmail

Need help? Check the logs in your terminal when running `npm run dev`!
