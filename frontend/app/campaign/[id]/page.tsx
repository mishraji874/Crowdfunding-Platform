"use client"

import { useState, useEffect } from "react"
import { useAccount } from 'wagmi'
import { ethers } from "ethers"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Card } from "@/components/ui/card"
import { getProvider, getContract, formatEther, parseEther } from "@/lib/contractUtils"
import { Loader2 } from "lucide-react"
import { AlertModal } from "@/components/AlertModal"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

type Campaign = {
    id: string;
    owner: string;
    title: string;
    description: string;
    goal: string;
    deadline: string;
    amountCollected: string;
    completed: boolean;
    goalReached: boolean;
};

export default function CampaignDetails({ params }: { params: { id: string } }) {
    const { isConnected } = useAccount()
    const [mounted, setMounted] = useState(false)
    const [campaign, setCampaign] = useState<Campaign | null>(null)
    const [contribution, setContribution] = useState("")
    const [userContribution, setUserContribution] = useState("0")
    const [alert, setAlert] = useState<{
        show: boolean;
        title: string;
        message: string;
        variant: 'success' | 'error';
    }>({
        show: false,
        title: '',
        message: '',
        variant: 'success'
    });
    const [isContributing, setIsContributing] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const fetchCampaignDetails = async () => {
        try {
            const contract = await getContract();
            const campaignDetails = await contract.getCampaignDetails(params.id);
            setCampaign({
                id: params.id,
                owner: campaignDetails.owner,
                title: campaignDetails.title,
                description: campaignDetails.description,
                goal: campaignDetails.goal.toString(),
                deadline: campaignDetails.deadline.toString(),
                amountCollected: campaignDetails.amountCollected.toString(),
                completed: campaignDetails.completed,
                goalReached: campaignDetails.goalReached,
            });

            const provider = getProvider();
            const accounts = await provider.listAccounts();
            if (accounts.length > 0) {
                const userContrib = await contract.getContribution(params.id, accounts[0].address);
                setUserContribution(userContrib.toString());
            }
        } catch (error) {
            console.error("Error fetching campaign details:", error);
        }
    };

    useEffect(() => {
        fetchCampaignDetails()
    }, [params.id])

    const showAlert = (title: string, message: string, variant: 'success' | 'error') => {
        setAlert({
            show: true,
            title,
            message,
            variant
        });
    };

    const fundCampaign = async () => {
        if (!campaign) return;
        setIsContributing(true);
        try {
            const contract = await getContract(true);
            const tx = await contract.fundCampaign(campaign.id, {
                value: parseEther(contribution),
            });
            await tx.wait();
            showAlert("Success", "Contribution successful!", "success");
            setContribution("");
            fetchCampaignDetails();
        } catch (error) {
            console.error("Error funding campaign:", error);
            showAlert("Error", "Failed to fund campaign. Please try again.", "error");
        } finally {
            setIsContributing(false);
        }
    };

    const withdrawFunds = async () => {
        if (typeof window.ethereum !== "undefined" && campaign) {
            try {
                const provider = getProvider();
                const signer = await provider.getSigner();
                const contract = await getContract(true);

                const tx = await contract.withdrawFunds(campaign.id);
                await tx.wait();

                showAlert("Success", "Funds withdrawn successfully!", "success");
                fetchCampaignDetails();
            } catch (error) {
                console.error("Error withdrawing funds:", error);
                showAlert("Error", "Failed to withdraw funds. Please try again.", "error");
            }
        }
    };

    const claimRefund = async () => {
        if (typeof window.ethereum !== "undefined" && campaign) {
            try {
                const provider = getProvider();
                const signer = await provider.getSigner();
                const contract = await getContract(true);

                const tx = await contract.claimRefund(campaign.id);
                await tx.wait();

                showAlert("Success", "Refund claimed successfully!", "success");
                fetchCampaignDetails();
            } catch (error) {
                console.error("Error claiming refund:", error);
                showAlert("Error", "Failed to claim refund. Please try again.", "error");
            }
        }
    };

    if (!mounted) {
        return null;
    }

    if (!isConnected) {
        return (
            <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
                <div className="text-center p-6">
                    <h1 className="text-2xl xs:text-3xl sm:text-4xl font-bold mb-4">Connect Your Wallet</h1>
                    <p className="text-muted-foreground">Please connect your wallet to view campaign details</p>
                </div>
            </div>
        );
    }

    if (!campaign) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="text-center space-y-3">
                    <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin mx-auto" />
                    <p className="text-base sm:text-lg">Loading campaign details...</p>
                </div>
            </div>
        )
    }

    const progress = (Number.parseFloat(campaign.amountCollected) / Number.parseFloat(campaign.goal)) * 100
    const isOwner = campaign.owner === window.ethereum?.selectedAddress
    const isExpired = Number.parseInt(campaign.deadline) < Date.now() / 1000
    const hasContribution = Number.parseFloat(userContribution) > 0

    return (
        <>
            <main className="min-h-screen bg-background text-foreground">
                <div className="max-w-7xl mx-auto px-3 py-3 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
                    {/* Campaign Title */}
                    <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 px-1">{campaign.title}</h1>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-3 sm:space-y-4 lg:space-y-6 order-2 lg:order-1">
                            <Card className="p-3 sm:p-4 lg:p-6">
                                <h2 className="text-base sm:text-lg lg:text-xl font-semibold mb-2 sm:mb-3">About this Campaign</h2>
                                <p className="text-sm sm:text-base text-muted-foreground whitespace-pre-wrap">{campaign.description}</p>
                            </Card>

                            <Card className="p-3 sm:p-4 lg:p-6">
                                <h2 className="text-base sm:text-lg lg:text-xl font-semibold mb-2 sm:mb-3">Funding Progress</h2>
                                <Progress value={progress} className="h-2.5 sm:h-3 lg:h-4 mb-2 lg:mb-4" />
                                <div className="flex justify-between text-xs sm:text-sm mb-3">
                                    <span>{formatEther(campaign.amountCollected)} ETH raised</span>
                                    <span>{formatEther(campaign.goal)} ETH goal</span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                                    <div className="bg-muted p-2.5 sm:p-3 lg:p-4 rounded-lg">
                                        <p className="text-xs sm:text-sm text-muted-foreground">Campaign Status</p>
                                        <p className="text-sm sm:text-base font-semibold mt-1">
                                            {campaign.completed ? "Completed" : campaign.goalReached ? "Goal Reached" : isExpired ? "Expired" : "Active"}
                                        </p>
                                    </div>
                                    <div className="bg-muted p-2.5 sm:p-3 lg:p-4 rounded-lg">
                                        <p className="text-xs sm:text-sm text-muted-foreground">End Date</p>
                                        <p className="text-sm sm:text-base font-semibold mt-1">
                                            {new Date(Number.parseInt(campaign.deadline) * 1000).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* Sidebar - Contribution Section */}
                        <div className="lg:col-span-1 order-1 lg:order-2 mb-4 lg:mb-0">
                            <Card className="p-3 sm:p-4 lg:p-6 lg:sticky lg:top-8">
                                <div className="space-y-3 sm:space-y-4">
                                    <div>
                                        <h3 className="text-base lg:text-lg font-semibold mb-1">Your Contribution</h3>
                                        <p className="text-lg sm:text-xl lg:text-2xl font-bold">{formatEther(userContribution)} ETH</p>
                                    </div>

                                    {!campaign.completed && !campaign.goalReached && (
                                        <div className="space-y-2 sm:space-y-3">
                                            <h3 className="text-base lg:text-lg font-semibold">Make a Contribution</h3>
                                            <div className="space-y-2">
                                                <Input
                                                    type="number"
                                                    placeholder="Amount in ETH"
                                                    value={contribution}
                                                    onChange={(e) => setContribution(e.target.value)}
                                                    min="0"
                                                    step="0.01"
                                                    disabled={isExpired}
                                                    className="text-sm sm:text-base h-10 sm:h-11"
                                                />
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <div className="w-full">
                                                                <Button
                                                                    onClick={fundCampaign}
                                                                    variant="default"
                                                                    className={`w-full h-10 sm:h-11 text-sm sm:text-base transition-all duration-300 border-2 ${!isExpired && !isContributing
                                                                        ? "border-primary bg-green-600 hover:bg-yellow-500 hover:text-primary-foreground hover:scale-[1.02] text-primary shadow-sm hover:shadow-md"
                                                                        : "border-muted bg-muted/50"
                                                                        }`}
                                                                    disabled={isContributing || isExpired}
                                                                >
                                                                    {isContributing ? (
                                                                        <>
                                                                            <Loader2 className="mr-2 h-3 w-3 lg:h-4 lg:w-4 animate-spin" />
                                                                            Contributing...
                                                                        </>
                                                                    ) : isExpired ? (
                                                                        'Campaign Expired'
                                                                    ) : (
                                                                        'Contribute to Campaign'
                                                                    )}
                                                                </Button>
                                                            </div>
                                                        </TooltipTrigger>
                                                        {isExpired && (
                                                            <TooltipContent>
                                                                <p>This campaign has ended and is no longer accepting contributions</p>
                                                            </TooltipContent>
                                                        )}
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </div>
                                        </div>
                                    )}

                                    {campaign.goalReached && !campaign.completed && isOwner && (
                                        <Button
                                            onClick={withdrawFunds}
                                            variant="default"
                                            className="w-full h-10 sm:h-11 text-sm sm:text-base"
                                        >
                                            Withdraw Campaign Funds
                                        </Button>
                                    )}

                                    {!campaign.goalReached && isExpired && hasContribution && (
                                        <Button
                                            onClick={claimRefund}
                                            className="w-full h-10 sm:h-11 text-sm sm:text-base transition-all duration-300 border-2 border-destructive bg-red-600 hover:bg-red-500 text-white hover:scale-[1.02] shadow-sm hover:shadow-md"
                                        >
                                            Claim Refund
                                        </Button>
                                    )}

                                    <div className="text-xs sm:text-sm text-muted-foreground pt-2">
                                        <p className="mb-1">Campaign ID: {campaign.id}</p>
                                        <p>Creator: {campaign.owner.slice(0, 6)}...{campaign.owner.slice(-4)}</p>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>
            <AlertModal
                isOpen={alert.show}
                onClose={() => setAlert(prev => ({ ...prev, show: false }))}
                title={alert.title}
                message={alert.message}
                variant={alert.variant}
            />
        </>
    )
}

