import { ethers } from 'ethers';
import { TOKEN_ADDRESS, DISTRIBUTION_WALLET } from '@/config/token';
// import { prisma } from './prisma'; // TODO: Enable after DB migration

const RAW_RPC_URL = process.env.RPC_URL || process.env.NEXT_PUBLIC_RPC_URL;
const DEFAULT_RPC_URL = 'https://rpc.ankr.com/eth';
const isPlaceholderRpc =
  !RAW_RPC_URL ||
  RAW_RPC_URL.includes('your-api-key') ||
  RAW_RPC_URL.includes('dummy-api-key');
const RPC_URL = isPlaceholderRpc ? DEFAULT_RPC_URL : RAW_RPC_URL;
const DISTRIBUTOR_PRIVATE_KEY = process.env.DISTRIBUTOR_PRIVATE_KEY;
const TOKEN_DECIMALS = parseInt(process.env.TOKEN_DECIMALS || '18');

if (isPlaceholderRpc) {
  console.warn('RPC_URL is missing or placeholder. Falling back to public RPC.', {
    rpcUrl: RAW_RPC_URL,
  });
}

if (!DISTRIBUTOR_PRIVATE_KEY) {
  throw new Error('DISTRIBUTOR_PRIVATE_KEY environment variable is required');
}

if (!TOKEN_ADDRESS) {
  throw new Error('TOKEN_ADDRESS is required');
}

const TOKEN_CONTRACT_ADDRESS = TOKEN_ADDRESS as string;

// ERC20 ABI (minimal)
const ERC20_ABI = [
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function balanceOf(address) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
];

// Create provider
export const provider = new ethers.JsonRpcProvider(RPC_URL);

// Create distributor wallet (signer)
export const distributorWallet = new ethers.Wallet(DISTRIBUTOR_PRIVATE_KEY, provider);

if (DISTRIBUTION_WALLET && DISTRIBUTION_WALLET.toLowerCase() !== distributorWallet.address.toLowerCase()) {
  console.warn('Distribution wallet address does not match distributor private key address', {
    configured: DISTRIBUTION_WALLET,
    derived: distributorWallet.address,
  });
}

// Create token contract instance
export const tokenContract = new ethers.Contract(TOKEN_CONTRACT_ADDRESS, ERC20_ABI, distributorWallet);

/**
 * Get current gas settings (using env vars for now)
 */
async function getGasSettings(): Promise<{
  maxGasLimit: string;
  maxGasCostETH: string;
}> {
  // TODO: Enable database settings after migration
  /*
  try {
    const settings = await prisma.gasSettings.findUnique({
      where: { id: 'default' }
    });
    
    if (settings) {
      return {
        maxGasLimit: settings.max_gas_limit,
        maxGasCostETH: settings.max_gas_cost_eth,
      };
    }
  } catch (error) {
    console.warn('Could not read gas settings from database:', error);
  }
  */
  
  // Use environment variables with $10 defaults
  return {
    maxGasLimit: process.env.MAX_GAS_LIMIT || '100000',
    maxGasCostETH: process.env.MAX_GAS_COST_ETH || '0.0025', // $10 at $4000/ETH
  };
}

/**
 * Validate Ethereum address
 */
export function isValidAddress(address: string): boolean {
  try {
    return ethers.isAddress(address);
  } catch {
    return false;
  }
}

/**
 * Get token information
 */
export async function getTokenInfo(): Promise<{
  symbol: string;
  decimals: number;
  contract: string;
}> {
  const [symbol, decimals] = await Promise.all([
    tokenContract.symbol(),
    tokenContract.decimals(),
  ]);

  return {
    symbol,
    decimals: Number(decimals),
    contract: TOKEN_CONTRACT_ADDRESS,
  };
}

/**
 * Check if token contract is healthy
 */
export async function checkTokenHealth(): Promise<{
  ok: boolean;
  symbol?: string;
  decimals?: number;
  contract?: string;
  reason?: string;
}> {
  try {
    // Check if contract exists by getting its bytecode
    const code = await provider.getCode(TOKEN_CONTRACT_ADDRESS);
    if (code === '0x') {
      return {
        ok: false,
        reason: 'Token contract not found at address',
      };
    }

    // Get token info
    const tokenInfo = await getTokenInfo();

    // Verify decimals match expected
    if (tokenInfo.decimals !== TOKEN_DECIMALS) {
      return {
        ok: false,
        reason: `Token decimals mismatch. Expected ${TOKEN_DECIMALS}, got ${tokenInfo.decimals}`,
      };
    }

    return {
      ok: true,
      ...tokenInfo,
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      ok: false,
      reason: `Token health check failed: ${errorMessage}`,
    };
  }
}

/**
 * Get distributor wallet balance
 */
export async function getDistributorBalance(): Promise<{
  tokenBalance: string;
  ethBalance: string;
}> {
  const [tokenBalance, ethBalance] = await Promise.all([
    tokenContract.balanceOf(distributorWallet.address),
    provider.getBalance(distributorWallet.address),
  ]);

  return {
    tokenBalance: ethers.formatUnits(tokenBalance, TOKEN_DECIMALS),
    ethBalance: ethers.formatEther(ethBalance),
  };
}

/**
 * Estimate gas for token transfer using multiple methods
 */
export async function estimateTransferGas(
  to: string,
  amountWei: string
): Promise<{
  gasLimit: bigint;
  gasPrice: bigint;
  estimatedCost: string;
}> {
  let gasLimit: bigint;
  
  try {
    // Method 1: Direct contract estimation
    const contractEstimate = await tokenContract.transfer.estimateGas(to, amountWei);
    
    // Method 2: Simple ERC20 transfer baseline (21,000 base + ~5,000 for ERC20)
    const baselineGas = BigInt(26000);
    
    // Method 3: Check if this is a complex token by comparing estimates
    const isComplexToken = contractEstimate > BigInt(50000);
    
    if (isComplexToken) {
      // Check if token is a proxy contract (common cause of high gas)
      const code = await provider.getCode(TOKEN_CONTRACT_ADDRESS);
      const isLikelyProxy = code.includes('360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc'); // EIP-1967 proxy storage slot
      
      console.warn('Token appears to be complex (high gas estimate):', {
        contractEstimate: contractEstimate.toString(),
        tokenContract: TOKEN_CONTRACT_ADDRESS,
        isLikelyProxy,
        codeLength: code.length
      });
      
      // For complex tokens, use a reasonable cap
      gasLimit = BigInt(100000); // Cap at 100k for complex tokens
    } else {
      // Use the higher of baseline or contract estimate for safety
      gasLimit = contractEstimate > baselineGas ? contractEstimate : baselineGas;
    }
    
  } catch (error) {
    console.error('Gas estimation failed, using baseline:', error);
    // Fallback to safe baseline
    gasLimit = BigInt(26000);
  }

  // Get current network gas price from multiple sources
  let gasPrice: bigint;
  
  try {
    // Method 1: Direct RPC call
    const feeData = await provider.getFeeData();
    gasPrice = feeData.gasPrice || ethers.parseUnits('10', 'gwei');
    
    // Method 2: Try Etherscan API as backup (if available)
    if (!feeData.gasPrice && process.env.ETHERSCAN_API_KEY) {
      try {
        const etherscanResponse = await fetch(`https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${process.env.ETHERSCAN_API_KEY}`);
        const etherscanData = await etherscanResponse.json();
        if (etherscanData.status === '1' && etherscanData.result?.ProposeGasPrice) {
          gasPrice = ethers.parseUnits(etherscanData.result.ProposeGasPrice, 'gwei');
          console.log('Using Etherscan gas price:', etherscanData.result.ProposeGasPrice, 'GWEI');
        }
      } catch (etherscanError) {
        console.warn('Etherscan gas API failed:', etherscanError);
      }
    }
    
    // Sanity check: if gas price is absurdly high, cap it
    const maxReasonableGasPrice = ethers.parseUnits('100', 'gwei'); // 100 GWEI max
    if (gasPrice > maxReasonableGasPrice) {
      console.warn('Capping extremely high gas price:', ethers.formatUnits(gasPrice, 'gwei'));
      gasPrice = maxReasonableGasPrice;
    }
    
  } catch (error) {
    console.error('Failed to get gas price, using fallback:', error);
    gasPrice = ethers.parseUnits('20', 'gwei'); // Conservative fallback
  }

  // Calculate estimated cost in ETH
  const estimatedCost = ethers.formatEther(gasLimit * gasPrice);
  
  console.error('Gas estimation details:', {
    method: gasLimit > BigInt(50000) ? 'complex-token-capped' : 'standard-estimate',
    networkGasPrice: ethers.formatUnits(gasPrice, 'gwei') + ' gwei',
    finalGasLimit: gasLimit.toString(),
    estimatedCostETH: estimatedCost,
    tokenContract: TOKEN_CONTRACT_ADDRESS
  });

  return {
    gasLimit,
    gasPrice,
    estimatedCost,
  };
}

/**
 * Execute token transfer
 */
export async function executeTransfer(
  to: string,
  amountWei: string
): Promise<{
  txHash: string;
  receipt: ethers.TransactionReceipt;
}> {
  // Validate recipient address
  if (!isValidAddress(to)) {
    throw new Error('Invalid recipient address');
  }

  // Estimate gas cost
  const { estimatedCost } = await estimateTransferGas(to, amountWei);
  
  // Validate gas cost is reasonable
  // Use dynamic gas settings
  const gasSettings = await getGasSettings();
  const maxGasCostETH = parseFloat(gasSettings.maxGasCostETH);
  if (parseFloat(estimatedCost) > maxGasCostETH) {
    throw new Error(`Gas fee too high: ${estimatedCost} ETH (max allowed: ${maxGasCostETH} ETH). Try again when network is less congested.`);
  }

  // Execute transfer with automatic gas pricing (let ethers.js handle it)
  const tx = await tokenContract.transfer(to, amountWei);
  // No manual gas settings - let the network determine optimal values

  // Wait for confirmation
  const receipt = await tx.wait();

  if (!receipt) {
    throw new Error('Transaction failed - no receipt');
  }

  if (receipt.status !== 1) {
    throw new Error('Transaction failed - status not success');
  }

  return {
    txHash: tx.hash,
    receipt,
  };
}

/**
 * Format token amount from wei to human readable
 */
export function formatTokenAmount(amountWei: string): string {
  return ethers.formatUnits(amountWei, TOKEN_DECIMALS);
}

/**
 * Parse token amount from human readable to wei
 */
export function parseTokenAmount(amount: string): string {
  return ethers.parseUnits(amount, TOKEN_DECIMALS).toString();
}

/**
 * Check if distributor has sufficient balance
 */
export async function checkSufficientBalance(amountWei: string): Promise<{
  sufficient: boolean;
  tokenBalance: string;
  ethBalance: string;
  requiredToken: string;
  estimatedGasCost: string;
}> {
  const [balance, gasEstimate] = await Promise.all([
    getDistributorBalance(),
    estimateTransferGas('0x0000000000000000000000000000000000000001', amountWei), // Use dummy address for estimation
  ]);

  const requiredToken = formatTokenAmount(amountWei);
  const hasEnoughTokens = parseFloat(balance.tokenBalance) >= parseFloat(requiredToken);
  const hasEnoughEth = parseFloat(balance.ethBalance) >= parseFloat(gasEstimate.estimatedCost);

  // Log the actual balances for debugging
  console.error('Distributor balance check:', {
    distributorTokenBalance: balance.tokenBalance,
    distributorEthBalance: balance.ethBalance,
    requiredToken,
    estimatedGasCost: gasEstimate.estimatedCost,
    hasEnoughTokens,
    hasEnoughEth,
    sufficient: hasEnoughTokens && hasEnoughEth
  });

  return {
    sufficient: hasEnoughTokens && hasEnoughEth,
    tokenBalance: balance.tokenBalance,
    ethBalance: balance.ethBalance,
    requiredToken,
    estimatedGasCost: gasEstimate.estimatedCost,
  };
}
