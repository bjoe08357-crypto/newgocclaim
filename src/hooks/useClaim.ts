import { useState, useEffect } from 'react';
import { useSignMessage, useAccount } from 'wagmi';

interface AllocationData {
  amount: string;
  symbol: string;
  decimals: number;
  chain: string;
  claimed: boolean;
  txHash?: string | null;
  date?: string;
}

interface ClaimState {
  sessionToken: string | null;
  allocation: AllocationData | null;
  history: AllocationData[]; // Store claim history
  email: string | null; // Store the verified email
  isEmailVerified: boolean;
  recipientAddress: string | null; // Store the recipient address for simplified flow
  isSigned: boolean;
  signedAddress: string | null; // Track which address was signed
  isClaimed: boolean;
  claimTxHash: string | null;
  lastUpdated: number; // Timestamp to force re-renders
}

const STORAGE_KEY = 'goc-claim-state';

export function useClaim() {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();

  // Initialize state from localStorage if available
  const [state, setState] = useState<ClaimState>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsedState = JSON.parse(saved);
          return parsedState;
        }
      } catch (error) {
        console.warn('Failed to load saved claim state:', error);
      }
    }
    return {
      sessionToken: null,
      allocation: null,
      history: [],
      email: null,
      isEmailVerified: false,
      recipientAddress: null,
      isSigned: false,
      signedAddress: null,
      isClaimed: false,
      claimTxHash: null,
      lastUpdated: Date.now(),
    };
  });

  // Save state to localStorage - clean version without debug logs
  const saveStateToStorage = (newState: ClaimState) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      } catch (error) {
        console.warn('Failed to save claim state:', error);
      }
    }
  };

  // Handle wallet connection changes - DISABLED FOR DEBUGGING
  useEffect(() => {
    
    // TEMPORARILY DISABLED - this might be causing the state reset on refresh
    /*
    // Only reset if wallet was actually disconnected (not just initial load)
    if (!isConnected && (state.isEmailVerified || state.isSigned || state.sessionToken) && state.signedAddress) {
      console.log('Wallet disconnected - resetting state');
      // Wallet disconnected - reset everything to start over
      const newState = {
        sessionToken: null,
        allocation: null,
        email: null,
        isEmailVerified: false,
        isSigned: false,
        signedAddress: null,
        isClaimed: false,
        claimTxHash: null,
      };
      setState(newState);
      saveStateToStorage(newState);
    } else if (isConnected && address && state.isSigned && state.signedAddress !== address) {
      // Different address connected, reset signature state only
      const newState = {
        ...state,
        isSigned: false,
        signedAddress: null,
      };
      setState(newState);
      saveStateToStorage(newState);
    } else if (isConnected && address && state.signedAddress === address && !state.isSigned) {
      // Same address reconnected and we have it marked as signed, restore signature state
      const newState = {
        ...state,
        isSigned: true,
      };
      setState(newState);
      saveStateToStorage(newState);
    }
    */
  }, [isConnected, address, state.isSigned, state.signedAddress, state]);

  // Prevent multiple claims - if allocation is claimed, don't allow further actions
  const isClaimCompleted = state.allocation?.claimed || state.isClaimed;

  const [loading, setLoading] = useState({
    requestingCode: false,
    verifyingCode: false,
    signing: false,
    claiming: false,
  });

  // Simple update counter - no longer needed since components are always visible
  const [updateCounter] = useState(0);

  const [errors, setErrors] = useState({
    email: '',
    code: '',
    address: '',
    signature: '',
    claim: '',
  });

  // Refresh status on mount if we have a session token
  useEffect(() => {
    const checkStatus = async () => {
      if (state.sessionToken) {
        try {
          const response = await fetch('/api/claim/status', {
            headers: {
              'Authorization': `Bearer ${state.sessionToken}`,
            },
          });
          
          if (response.ok) {
            const data = await response.json();
            if (data.success && data.allocation) {
              const newState = {
                ...state,
                allocation: data.allocation,
                history: data.history || [],
                isClaimed: data.allocation.claimed,
                claimTxHash: data.allocation.txHash || null,
                lastUpdated: Date.now(),
              };
              setState(newState);
              saveStateToStorage(newState);
            }
          } else if (response.status === 401) {
            // Session expired
            reset();
          }
        } catch (error) {
          console.error('Failed to check status:', error);
        }
      }
    };

    checkStatus();
  }, []); // Run once on mount

  const clearError = (field: keyof typeof errors) => {
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const requestEmailCode = async (email: string, _turnstileToken?: string) => {
    setLoading(prev => ({ ...prev, requestingCode: true }));
    clearError('email');

    try {
      const response = await fetch('/api/request-email-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send code');
      }

      // Save the email to state when code is successfully sent
      const newState = { ...state, email, lastUpdated: Date.now() };
      setState(newState);
      saveStateToStorage(newState);

      return { success: true };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setErrors(prev => ({ ...prev, email: errorMessage }));
      return { success: false, error: errorMessage };
    } finally {
      setLoading(prev => ({ ...prev, requestingCode: false }));
    }
  };

  const verifyEmailCode = async (email: string, code: string) => {
    setLoading(prev => ({ ...prev, verifyingCode: true }));
    clearError('code');

    try {
      const response = await fetch('/api/exchange-email-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Invalid code');
      }

      if (data.session_token && data.allocation) {
        const newState = {
          ...state,
          email,
          sessionToken: data.session_token,
          allocation: data.allocation,
          history: data.history || [],
          isEmailVerified: true,
          isClaimed: data.allocation.claimed,
          lastUpdated: Date.now(),
        };
        setState(newState);
        saveStateToStorage(newState);
      } else {
        const newState = {
          ...state,
          email,
          isEmailVerified: true,
          lastUpdated: Date.now(),
        };
        setState(newState);
        saveStateToStorage(newState);
      }
      return { success: true, hasAllocation: !!data.session_token };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setErrors(prev => ({ ...prev, code: errorMessage }));
      return { success: false, error: errorMessage };
    } finally {
      setLoading(prev => ({ ...prev, verifyingCode: false }));
    }
  };

  const getSignChallenge = async (address: string) => {
    if (!state.sessionToken) {
      throw new Error('No session token');
    }

    const response = await fetch('/api/get-sign-challenge', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${state.sessionToken}`,
      },
      body: JSON.stringify({ address }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to get challenge');
    }

    return data;
  };

  const signMessage = async (address: string) => {
    setLoading(prev => ({ ...prev, signing: true }));
    clearError('signature');

    try {
      const challenge = await getSignChallenge(address);
      const signature = await signMessageAsync({ message: challenge.message });

      const response = await fetch('/api/submit-signature', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.sessionToken}`,
        },
        body: JSON.stringify({
          address,
          signature,
          message: challenge.message,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Signature verification failed');
      }

      const newState = { ...state, isSigned: true, signedAddress: address, lastUpdated: Date.now() };
      setState(newState);
      saveStateToStorage(newState);
      return { success: true };
    } catch (error: unknown) {
      const baseMessage = error instanceof Error ? error.message : 'An error occurred';
      const errorMessage = baseMessage.includes('User rejected') 
        ? 'Signature was cancelled' 
        : baseMessage;
      setErrors(prev => ({ ...prev, signature: errorMessage }));
      return { success: false, error: errorMessage };
    } finally {
      setLoading(prev => ({ ...prev, signing: false }));
    }
  };

  const claimTokens = async () => {
    setLoading(prev => ({ ...prev, claiming: true }));
    clearError('claim');

    try {
      const response = await fetch('/api/claim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.sessionToken}`,
        },
        body: JSON.stringify({
          recipientAddress: state.recipientAddress,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Claim failed');
      }

      const newState = {
        ...state,
        isClaimed: true,
        claimTxHash: data.txHash,
        lastUpdated: Date.now(),
      };
      setState(newState);
      saveStateToStorage(newState);
      return { success: true, txHash: data.txHash };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setErrors(prev => ({ ...prev, claim: errorMessage }));
      return { success: false, error: errorMessage };
    } finally {
      setLoading(prev => ({ ...prev, claiming: false }));
    }
  };

  const reset = () => {
    const initialState = {
      sessionToken: null,
      allocation: null,
      history: [],
      email: null,
      isEmailVerified: false,
      recipientAddress: null,
      isSigned: false,
      signedAddress: null,
      isClaimed: false,
      claimTxHash: null,
      lastUpdated: Date.now(),
    };
    setState(initialState);
    setErrors({
      email: '',
      code: '',
      address: '',
      signature: '',
      claim: '',
    });
    // Clear localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const setRecipientAddress = (address: string) => {
    const newState = { ...state, recipientAddress: address, lastUpdated: Date.now() };
    setState(newState);
    saveStateToStorage(newState);
  };

  return {
    ...state,
    loading,
    errors,
    isClaimCompleted,
    updateCounter, // Include this to force re-renders
    requestEmailCode,
    verifyEmailCode,
    signMessage,
    claimTokens,
    setRecipientAddress,
    reset,
    clearError,
  };
}
