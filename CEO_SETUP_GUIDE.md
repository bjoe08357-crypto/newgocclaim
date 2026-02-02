# GOC Token Claim Portal - Setup Guide

## What This Is
A secure website where users can claim their GOC tokens by connecting their wallet and verifying their email address. The system handles everything automatically and covers gas fees for users.

---

## 🚀 Quick Setup Checklist (30 minutes)

### Step 1: Set Up Database (5 minutes)
**What it does:** Stores user email addresses and token allocations securely

**Option A - Easy Cloud Setup (Recommended):**
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" → Sign up with GitHub
3. Create new project (choose any name, strong password)
4. Wait 2 minutes for setup
5. Go to Settings → Database → Copy the connection string
6. Save this - you'll need it in Step 4

**Option B - Local Setup:**
- Ask your developer to set up PostgreSQL locally

---

### Step 2: Get Blockchain Connection (5 minutes)
**What it does:** Connects to Ethereum network to send tokens

1. Go to [alchemy.com](https://alchemy.com)
2. Sign up → Create your first app
3. Choose "Ethereum" → "Mainnet" 
4. Name it "GOC Claim Portal"
5. Copy the API Key from the dashboard
6. Save this - you'll need it in Step 4

---

### Step 3: Set Up Email Sending (5 minutes)
**What it does:** Sends verification codes to users

**Gmail Setup (Easiest):**
1. Use a Gmail account (create new one if needed: claims@yourcompany.com)
2. Enable 2-Factor Authentication on the Gmail account
3. Go to Google Account Settings → Security → App passwords
4. Generate app password for "Mail"
5. Save the 16-character password - you'll need it in Step 4

**Alternative:** Use SendGrid, AWS SES, or other email service

---

### Step 4: Configure the System (10 minutes)
**What it does:** Tells the system how to connect to everything

1. In your project folder, find the file `.env.local`
2. Open it and fill in these values:

```bash
# Database (from Step 1)
DATABASE_URL=your-supabase-connection-string

# Security (generated automatically - don't change)
PEPPER=57e5b1bcd2a0453156781cb1cbe399c77f26fd9a95ae2c230ea5e4997d2ec5ec
JWT_SECRET=9555ff94c5690098e7d4c8930733f13242320b9fb90b37a1f4a431e945080ce2

# Your Token Details
GOC_TOKEN_ADDRESS=0xYourActualTokenContractAddress
GOC_DISTRIBUTION_WALLET=0xYourDistributionWallet
TOKEN_DECIMALS=18
DISTRIBUTOR_PRIVATE_KEY=0xYourDistributorWalletPrivateKey

# Blockchain Connection (from Step 2)
RPC_URL=https://eth-mainnet.g.alchemy.com/v2/your-alchemy-api-key

# Email Settings (from Step 3)
EMAIL_FROM=claims@yourcompany.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=claims@yourcompany.com
SMTP_PASS=your-16-character-app-password

# Website Settings
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_GOC_TOKEN_ADDRESS=0xYourActualTokenContractAddress
NEXT_PUBLIC_GOC_DISTRIBUTION_WALLET=0xYourDistributionWallet

# Admin Login
ADMIN_USERNAME=admin
ADMIN_PASSWORD=YourSecurePassword123!
```

---

### Step 5: Start the System (5 minutes)
**What it does:** Launches your claim portal

Run these commands in order:
```bash
npm run db:push
npm run dev
```

✅ **Success!** Your portal is now running at: http://localhost:3000

---

## 📊 How to Upload Token Allocations

1. **Visit Admin Panel:** Go to http://localhost:3000/admin
2. **Login:** Use the admin username/password from Step 4
3. **Upload CSV:** Prepare a file like this:
   ```
   email,amount
   alice@example.com,1000
   bob@example.com,2500
   charlie@example.com,750.5
   ```
4. **Paste and Upload:** Copy your CSV data into the upload box

---

## 💰 Wallet Setup (IMPORTANT)

**Create a Distributor Wallet:**
1. Create a NEW wallet (don't use existing ones)
2. Fund it with:
   - Your GOC tokens (total amount you want to distribute)
   - ETH for gas fees (approximately 0.1 ETH should cover hundreds of claims)
3. Export the private key and use it for `DISTRIBUTOR_PRIVATE_KEY`

**Security Note:** This wallet only holds tokens for distribution. Keep the private key secure.

---

## 🎯 How Users Claim Tokens

1. **User visits your website**
2. **Connects their wallet** (MetaMask, etc.)
3. **Enters their email** and completes captcha
4. **Receives verification code** via email
5. **Signs a message** to prove wallet ownership
6. **Clicks "Claim"** - tokens sent automatically

**User Experience:** Simple, secure, no gas fees for users.

---

## 🛡️ Security Features

✅ **Email Privacy:** Email addresses are encrypted and hashed  
✅ **One-Time Claims:** Each person can only claim once  
✅ **Rate Limiting:** Prevents spam and abuse  
✅ **Captcha Protection:** Blocks automated attacks  
✅ **Audit Trail:** All actions are logged  

---

## 📈 What Happens Next

**For Testing:**
- Test the full flow yourself with a small amount
- Have team members test with their emails
- Verify tokens appear in their wallets

**For Launch:**
- Upload your full allocation list
- Share the website URL with your community
- Monitor the admin dashboard for claims

---

## 🆘 If Something Goes Wrong

**Common Issues:**
- "Database connection failed" → Check your Supabase URL
- "Email not sending" → Verify Gmail app password
- "Token contract error" → Confirm contract address is correct
- "Insufficient funds" → Add more ETH to distributor wallet

**Get Help:**
- Check the terminal output for error messages
- All errors are logged with clear descriptions
- Contact your developer with the specific error message

---

## 💡 Pro Tips

1. **Start Small:** Test with 5-10 allocations first
2. **Monitor Gas:** Watch ETH balance in distributor wallet
3. **Backup Data:** Export allocation list before major changes
4. **User Support:** Most issues are solved by checking spam folders
5. **Mobile Friendly:** Works on phones and tablets

---

## 📋 Launch Checklist

Before going live:

- [ ] Database is set up and accessible
- [ ] Email sending works (test it!)
- [ ] Distributor wallet has tokens and ETH
- [ ] Token contract address is correct
- [ ] Admin panel works
- [ ] Test claim flow works end-to-end
- [ ] Website URL is configured correctly
- [ ] Backup of allocation data exists

**Estimated Total Setup Time:** 30 minutes  
**Technical Skill Required:** Basic (copy/paste configuration)  
**Ongoing Maintenance:** Minimal (monitor wallet balance)

---

*This system is production-ready and handles all the technical complexity automatically. Users get a smooth, secure experience while you maintain full control through the admin panel.*
