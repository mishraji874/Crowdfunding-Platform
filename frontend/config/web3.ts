import { JsonRpcProvider } from 'ethers';

const SEPOLIA_RPC_URL = process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL;

if (!SEPOLIA_RPC_URL) {
    throw new Error('NEXT_PUBLIC_SEPOLIA_RPC_URL is not defined');
}

const getProvider = () => {
    return new JsonRpcProvider(SEPOLIA_RPC_URL);
};

export const web3Provider = getProvider();
