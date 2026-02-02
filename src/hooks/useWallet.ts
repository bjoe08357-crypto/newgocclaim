import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi';
import { mainnet } from 'wagmi/chains';

export function useWallet() {
  const { address, isConnected, chainId } = useAccount();
  const { connect, connectors, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain, isPending: isSwitching } = useSwitchChain();

  const isWrongNetwork = isConnected && chainId !== mainnet.id;

  const connectWallet = () => {
    const connector = connectors.find(c => c.name === 'MetaMask') || connectors[0];
    if (connector) {
      connect({ connector });
    }
  };

  const switchToMainnet = () => {
    switchChain({ chainId: mainnet.id });
  };

  return {
    address,
    isConnected,
    isWrongNetwork,
    isConnecting,
    isSwitching,
    connectWallet,
    switchToMainnet,
    disconnect,
  };
}
