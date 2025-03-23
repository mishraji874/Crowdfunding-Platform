export interface CampaignDetails {
    id: number;
    title: string;
    description: string;
    goal: string;
    amountCollected: string;
    deadline: string;
    completed: boolean;
    goalReached: boolean;
    owner: string;
}

export interface RawCampaign {
    owner: string;
    title: string;
    description: string;
    goal: bigint;
    deadline: bigint;
    amountCollected: bigint;
    completed: boolean;
    goalReached: boolean;
}

export interface CampaignCardProps extends CampaignDetails { }
