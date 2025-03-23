"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@/context/WalletContext";
import { detectWallet } from "@/utils/wallet-utils";
import dynamic from 'next/dynamic';

const ClientButton = dynamic(() => import('./client-button'), {
  ssr: false,
});
const AlertModal = dynamic(() => import('./ui/alert-modal'), { ssr: false });

interface ConnectWalletProps {
  buttonClassName?: string;
}

export function ConnectWallet({ buttonClassName }: ConnectWalletProps) {
  const { account, connectWallet, disconnectWallet } = useWallet();
  const [mounted, setMounted] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [alert, setAlert] = useState<{ show: boolean; title: string; message: string }>({
    show: false,
    title: '',
    message: ''
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const showAlert = (title: string, message: string) => {
    setAlert({ show: true, title, message });
  };

  const closeAlert = () => {
    setAlert({ show: false, title: '', message: '' });
  };

  if (!mounted) return null;

  const handleConnect = async () => {
    if (isConnecting) return;

    try {
      setIsConnecting(true);
      const availableWallets = detectWallet();

      if (availableWallets.length > 0) {
        const account = await connectWallet(availableWallets[0]);
        if (!account) {
          setTimeout(() => setIsConnecting(false), 1000);
          showAlert(
            "Wallet Connection",
            "Please open your wallet and accept the connection request"
          );
          return;
        }
      } else {
        window.open('https://metamask.io/download/', '_blank');
        showAlert(
          "Wallet Required",
          "Please install MetaMask or another Web3 wallet to continue"
        );
      }
    } catch (error: any) {
      console.error("Failed to connect wallet:", error);
      showAlert("Connection Error", error.message || 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <>
      {!account ? (
        <ClientButton
          onClick={handleConnect}
          className={buttonClassName || "bg-primary hover:bg-primary/90 text-primary-foreground"}
        >
          Connect Wallet
        </ClientButton>
      ) : (
        <div className="flex items-center space-x-2">
          <p className="text-sm">
            {account.slice(0, 6)}...{account.slice(-4)}
          </p>
          <ClientButton
            onClick={disconnectWallet}
            variant="outline"
            className="hover:bg-destructive/90 hover:text-destructive-foreground"
          >
            Disconnect
          </ClientButton>
        </div>
      )}

      {alert.show && (
        <AlertModal
          isOpen={alert.show}
          onClose={closeAlert}
          title={alert.title}
          message={alert.message}
        />
      )}
    </>
  );
}

