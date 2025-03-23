declare global {
    interface Window {
        ethereum?: any;
    }
}

export type WalletType = 'metamask' | 'coinbase' | 'walletconnect' | null;

export const detectWallet = (): WalletType[] => {
    if (typeof window === 'undefined') return [];

    const availableWallets: WalletType[] = [];

    // Check for MetaMask or other injected wallets
    if (window.ethereum) {
        if (window.ethereum.isMetaMask) {
            availableWallets.push('metamask');
        }
        if (window.ethereum.isCoinbaseWallet) {
            availableWallets.push('coinbase');
        }
    }

    return availableWallets;
};

export const connectToWallet = async (walletType: WalletType): Promise<string> => {
    if (!window.ethereum) {
        throw new Error('Please install MetaMask or another Web3 wallet!');
    }

    try {
        // Try to get accounts first without requesting
        let accounts = await window.ethereum.request({ method: 'eth_accounts' });

        // If no accounts, then request access
        if (!accounts || accounts.length === 0) {
            try {
                accounts = await window.ethereum.request({
                    method: 'eth_requestAccounts',
                    params: [],
                });
            } catch (requestError: any) {
                // If already processing, wait a bit and try again
                if (requestError.code === -32002) {
                    return ''; // Return empty to prevent further processing
                }
                throw requestError;
            }
        }

        // Check if we got accounts
        if (!accounts || accounts.length === 0) {
            throw new Error('No authorized accounts found');
        }

        // Get current chain ID
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });

        // Check if we're on Sepolia (chainId: '0xaa36a7')
        if (chainId !== '0xaa36a7') {
            try {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: '0xaa36a7' }],
                });
            } catch (switchError: any) {
                if (switchError.code === 4902) {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [{
                            chainId: '0xaa36a7',
                            chainName: 'Sepolia',
                            nativeCurrency: {
                                name: 'Sepolia ETH',
                                symbol: 'ETH',
                                decimals: 18
                            },
                            rpcUrls: ['https://sepolia.infura.io/v3/'],
                            blockExplorerUrls: ['https://sepolia.etherscan.io']
                        }],
                    });
                } else {
                    throw switchError;
                }
            }
        }

        // Get final account after network switch
        const finalAccounts = await window.ethereum.request({ method: 'eth_accounts' });
        return finalAccounts[0];
    } catch (error) {
        console.error('Error connecting to wallet:', error);
        throw error;
    }
};
