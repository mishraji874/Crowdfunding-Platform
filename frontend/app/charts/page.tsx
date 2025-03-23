'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import CryptoChart from './components/CryptoChart'

export default function ChartsPage() {
    const { isConnected } = useAccount()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return null;
    }

    if (!isConnected) {
        return (
            <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
                <div className="text-center p-6">
                    <h1 className="text-2xl xs:text-3xl sm:text-4xl font-bold mb-4">Connect Your Wallet</h1>
                    <p className="text-muted-foreground">Please connect your wallet to view crypto charts</p>
                </div>
            </div>
        );
    }

    return (
        <main className="flex min-h-screen flex-col items-center px-4 py-6 sm:p-6 md:p-8">
            <div className="w-full max-w-[1200px] space-y-4 sm:space-y-6">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Live Crypto Charts</h1>
                <div className="rounded-lg border bg-card p-3 sm:p-4">
                    <CryptoChart />
                </div>
            </div>
        </main>
    );
}
