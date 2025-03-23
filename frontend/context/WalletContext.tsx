"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { WalletType, connectToWallet } from "@/utils/wallet-utils";

interface WalletContextType {
    account: string | null;
    connectWallet: (walletType: WalletType) => Promise<string | null>;
    disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextType>({
    account: null,
    connectWallet: async () => null,
    disconnectWallet: () => { },
});

export function WalletProvider({ children }: { children: ReactNode }) {
    const [account, setAccount] = useState<string | null>(null);

    const connectWallet = async (walletType: WalletType): Promise<string | null> => {
        try {
            const account = await connectToWallet(walletType);
            if (account) {
                setAccount(account);
                return account;
            }
            return null;
        } catch (error) {
            console.error("Error connecting to wallet:", error);
            throw error;
        }
    };

    const disconnectWallet = () => {
        setAccount(null);
    };

    return (
        <WalletContext.Provider value={{ account, connectWallet, disconnectWallet }}>
            {children}
        </WalletContext.Provider>
    );
}

export const useWallet = () => useContext(WalletContext);
