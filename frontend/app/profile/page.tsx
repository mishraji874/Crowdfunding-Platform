"use client"

import { useState, useEffect } from "react"
import { getProvider, formatEther } from "@/lib/contractUtils"
import { useAccount } from "wagmi" // Add this import
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { RefreshCcw } from "lucide-react" // Add this import
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip" // Add this import

export default function Profile() {
    const { isConnected } = useAccount() // Add this hook
    const [mounted, setMounted] = useState(false) // Add this state
    const [account, setAccount] = useState<string | null>(null)
    const [balance, setBalance] = useState<string | null>(null)
    const [avatarUrl, setAvatarUrl] = useState<string>("")

    const generateRandomAvatar = () => {
        // List of available DiceBear styles
        const styles = ['adventurer', 'avataaars', 'big-ears', 'bottts', 'croodles', 'fun-emoji', 'icons', 'identicon', 'shapes']
        const randomStyle = styles[Math.floor(Math.random() * styles.length)]
        const randomSeed = Math.random().toString(36).substring(7)
        return `https://api.dicebear.com/7.x/${randomStyle}/svg?seed=${randomSeed}`
    }

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        const fetchAccountDetails = async () => {
            try {
                const provider = getProvider()
                const signer = await provider.getSigner()
                const address = await signer.getAddress()
                setAccount(address)
                const balance = await provider.getBalance(address)
                setBalance(formatEther(balance))
                // Generate avatar based on address
                setAvatarUrl(`https://api.dicebear.com/7.x/identicon/svg?seed=${address}`)
            } catch (error) {
                console.error("Error fetching account details:", error)
            }
        }

        fetchAccountDetails()
    }, [])

    // Prevent hydration mismatch by not rendering until mounted
    if (!mounted) {
        return null;
    }

    if (!isConnected) {
        return (
            <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
                <div className="text-center p-6">
                    <h1 className="text-2xl xs:text-3xl sm:text-4xl font-bold mb-4">Connect Your Wallet</h1>
                    <p className="text-muted-foreground">Please connect your wallet to view your profile</p>
                </div>
            </div>
        );
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-start p-4 sm:p-8 max-w-7xl mx-auto w-full">
            <div className="w-full flex flex-col items-center gap-4 sm:gap-8">
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-2xl">
                    <div className="relative">
                        <Avatar
                            className="h-20 w-20 sm:h-24 sm:w-24 border-2 border-primary cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => setAvatarUrl(generateRandomAvatar())}
                        >
                            <AvatarImage src={avatarUrl} />
                            <AvatarFallback className="text-xl sm:text-2xl">
                                {account ? account.substring(2, 4).toUpperCase() : '??'}
                            </AvatarFallback>
                        </Avatar>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div
                                        className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-background border-2 border-primary cursor-pointer hover:bg-muted transition-colors"
                                        onClick={() => setAvatarUrl(generateRandomAvatar())}
                                    >
                                        <RefreshCcw className="h-3 w-3 sm:h-4 sm:w-4 text-foreground" />
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Randomize avatar</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <div className="text-center sm:text-left">
                        <h1 className="text-3xl sm:text-4xl font-bold">Your Profile</h1>
                        <p className="text-muted-foreground">Welcome back!</p>
                    </div>
                </div>

                {account ? (
                    <Card className="w-full max-w-2xl">
                        <CardHeader className="space-y-1">
                            <CardTitle>Account Details</CardTitle>
                            <CardDescription>Your Ethereum account information</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4 sm:gap-6">
                            <div className="space-y-1">
                                <p className="text-sm font-medium">Address:</p>
                                <p className="text-xs sm:text-sm text-muted-foreground break-all">{account}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium">Balance:</p>
                                <p className="text-sm text-muted-foreground">{balance} ETH</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium">Network:</p>
                                <p className="text-sm text-muted-foreground">Sepolia Testnet</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium">Account Status:</p>
                                <div className="flex gap-2 mt-1">
                                    <Badge>Active</Badge>
                                    <Badge variant="secondary">Verified</Badge>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col sm:flex-row gap-2">
                            <Button
                                className="w-full"
                                onClick={() => window.open(`https://sepolia.etherscan.io/address/${account}`, "_blank")}
                            >
                                View on Etherscan
                            </Button>
                        </CardFooter>
                    </Card>
                ) : (
                    <Card className="w-full max-w-md">
                        <CardContent className="pt-6">
                            <p className="text-center">Please connect your wallet to view your profile.</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </main>
    )
}

