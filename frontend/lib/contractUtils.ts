import { ethers } from "ethers";
import { ALCHEMY_RPC_URL, CONTRACT_ADDRESS } from "./networkConfig";
import rawABI from "./contractABI.json";
import type { CampaignDetails, RawCampaign } from "../types/campaign";

// Extract just the ABI array from the raw import
const contractABI = rawABI.abi;

export const getProvider = () => {
  if (typeof window !== "undefined" && window.ethereum) {
    return new ethers.BrowserProvider(window.ethereum);
  }
  return new ethers.JsonRpcProvider(ALCHEMY_RPC_URL);
};

export const getContract = async (withSigner = false) => {
  const provider = getProvider();
  if (withSigner && window.ethereum) {
    const signer = await (provider as ethers.BrowserProvider).getSigner();
    return new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
  }
  return new ethers.Contract(CONTRACT_ADDRESS, contractABI, provider);
};

export const formatEther = (value: bigint | string) => ethers.formatEther(value);
export const parseEther = (value: string) => ethers.parseEther(value);

export const getReadOnlyContract = async () => {
  try {
    // Use the window.ethereum provider if available
    if (typeof window !== 'undefined' && window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      return new ethers.Contract(
        CONTRACT_ADDRESS,
        contractABI,
        provider
      );
    }

    // Fallback to Alchemy provider for read-only operations
    const provider = new ethers.JsonRpcProvider(ALCHEMY_RPC_URL);
    return new ethers.Contract(
      CONTRACT_ADDRESS,
      contractABI,
      provider
    );
  } catch (error) {
    console.error('Failed to initialize contract:', error);
    throw new Error('Failed to connect to the network. Please check your connection and try again.');
  }
};

export const decodeCampaign = (campaign: RawCampaign, id: number): CampaignDetails => {
  return {
    id,
    owner: campaign.owner,
    title: campaign.title,
    description: campaign.description,
    goal: campaign.goal.toString(),
    deadline: new Date(Number(campaign.deadline) * 1000).toISOString(), // Convert to ISO string
    amountCollected: campaign.amountCollected.toString(),
    completed: campaign.completed,
    goalReached: campaign.goalReached
  };
};

export const getCampaignById = async (id: number): Promise<CampaignDetails> => {
  const contract = await getReadOnlyContract();
  const campaign = await contract.getCampaignDetails(id);

  return {
    id,
    title: campaign.title,
    description: campaign.description,
    goal: campaign.goal.toString(),
    amountCollected: campaign.amountCollected.toString(),
    deadline: new Date(Number(campaign.deadline) * 1000).toISOString(),
    completed: campaign.completed,
    goalReached: campaign.goalReached,
    owner: campaign.owner
  };
};

