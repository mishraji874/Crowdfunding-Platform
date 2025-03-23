"use client";

import { useState, useEffect } from "react";
import { formatEther } from "ethers";
import { CampaignCard } from "@/components/campaign-card";
import { getReadOnlyContract } from "@/lib/contractUtils";
import type { CampaignDetails } from "@/types/campaign";
import { Loader2 } from "lucide-react";
import { useAccount } from "wagmi"; // Add this import

export default function ProjectsPage() {
  const { isConnected } = useAccount(); // Add this hook
  const [campaigns, setCampaigns] = useState<CampaignDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCampaigns = async () => {
    try {
      const contract = await getReadOnlyContract();
      let data;
      // Use getCampaigns if available; otherwise fallback
      if (contract.getCampaigns) {
        data = await contract.getCampaigns();
      } else if (contract.campaignCount && contract.getCampaignDetails) {
        const countRaw = await contract.campaignCount();
        const count = countRaw.toNumber ? countRaw.toNumber() : countRaw;
        data = [];
        for (let i = 0; i < count; i++) {
          const campaign = await contract.getCampaignDetails(i);
          data.push(campaign);
        }
      } else {
        throw new Error("No valid method found for fetching campaigns");
      }

      const formattedCampaigns: CampaignDetails[] = data.map((campaign: any, idx: number) => ({
        id: idx,
        title: campaign.title,
        description: campaign.description,
        goal: campaign.goal.toString(),
        amountCollected: campaign.amountCollected.toString(),
        deadline: Number(campaign.deadline), // Remove the * 1000 as blockchain timestamp is already in seconds
        completed: campaign.completed,
        goalReached: campaign.goalReached,
        owner: campaign.owner
      }));

      setCampaigns(formattedCampaigns);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    }
  };

  useEffect(() => {
    fetchCampaigns().finally(() => setIsLoading(false));
  }, []);

  const isExpired = (campaign: CampaignDetails) => {
    return Number(campaign.deadline) < Date.now() / 1000;
  };

  const activeCampaigns = campaigns.filter(c => !c.completed && !isExpired(c));
  const expiredCampaigns = campaigns.filter(c => !c.completed && isExpired(c));
  const completedCampaigns = campaigns.filter(c => c.completed);

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center p-6">
          <h1 className="text-2xl xs:text-3xl sm:text-4xl font-bold mb-4">Connect Your Wallet</h1>
          <p className="text-muted-foreground">Please connect your wallet to view campaigns</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-4 xs:py-6 sm:py-12">
        <h1 className="text-2xl xs:text-3xl sm:text-4xl font-bold mb-4 xs:mb-6 sm:mb-8">
          Discover Campaigns
        </h1>

        {/* Stats - Responsive grid */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4 sm:gap-6 mb-6 xs:mb-8 sm:mb-12">
          <div className="bg-card p-3 xs:p-4 sm:p-6 rounded-lg shadow-sm border border-border">
            <p className="text-xs xs:text-sm text-muted-foreground">Total Campaigns</p>
            <p className="text-xl xs:text-2xl sm:text-3xl font-bold mt-1">{campaigns.length}</p>
          </div>
          <div className="bg-card p-3 xs:p-4 sm:p-6 rounded-lg shadow-sm border border-border">
            <p className="text-xs xs:text-sm text-muted-foreground">Active Campaigns</p>
            <p className="text-xl xs:text-2xl sm:text-3xl font-bold mt-1">{activeCampaigns.length}</p>
          </div>
          <div className="bg-card p-3 xs:p-4 sm:p-6 rounded-lg shadow-sm border border-border col-span-1 xs:col-span-2 lg:col-span-1">
            <p className="text-xs xs:text-sm text-muted-foreground">Expired Campaigns</p>
            <p className="text-xl xs:text-2xl sm:text-3xl font-bold mt-1">{expiredCampaigns.length}</p>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[200px] xs:min-h-[300px] sm:min-h-[400px]">
            <Loader2 className="h-5 w-5 xs:h-6 xs:w-6 sm:h-8 sm:w-8 animate-spin text-muted-foreground" />
          </div>
        ) : campaigns.length === 0 ? (
          <div className="text-center py-6 xs:py-8 sm:py-12 bg-card rounded-lg shadow-sm border border-border px-3 xs:px-4">
            <h3 className="text-base xs:text-lg sm:text-xl font-medium">No Campaigns Found</h3>
            <p className="mt-2 text-xs xs:text-sm sm:text-base text-muted-foreground">Be the first to start a fundraising campaign!</p>
          </div>
        ) : (
          <>
            {activeCampaigns.length > 0 && (
              <div className="mb-6 xs:mb-8 sm:mb-12">
                <h2 className="text-lg xs:text-xl sm:text-2xl font-semibold mb-3 xs:mb-4 sm:mb-6">
                  Active Campaigns
                </h2>
                <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {activeCampaigns.map((campaign) => (
                    <div className="w-full" key={campaign.id}>
                      <CampaignCard {...campaign} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {expiredCampaigns.length > 0 && (
              <div className="mb-6 xs:mb-8 sm:mb-12">
                <h2 className="text-lg xs:text-xl sm:text-2xl font-semibold mb-3 xs:mb-4 sm:mb-6">
                  Expired Campaigns
                </h2>
                <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {expiredCampaigns.map((campaign) => (
                    <div className="w-full" key={campaign.id}>
                      <CampaignCard {...campaign} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {completedCampaigns.length > 0 && (
              <div>
                <h2 className="text-lg xs:text-xl sm:text-2xl font-semibold mb-3 xs:mb-4 sm:mb-6">
                  Completed Campaigns
                </h2>
                <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {completedCampaigns.map((campaign) => (
                    <div className="w-full" key={campaign.id}>
                      <CampaignCard {...campaign} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

