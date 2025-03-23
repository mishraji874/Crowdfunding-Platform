// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract Crowdfunding {
    struct Campaign {
        address owner;
        string title;
        string description;
        uint256 goal;
        uint256 deadline;
        uint256 amountCollected;
        bool completed;
        bool goalReached;
    }

    mapping(uint256 => Campaign) public campaigns;
    mapping(uint256 => mapping(address => uint256)) public contributions;
    uint256 public campaignCount;

    event CampaignCreated(uint256 campaignId, address owner, string title, uint256 goal, uint256 deadline);
    event Funded(uint256 campaignId, address contributor, uint256 amount);
    event Withdrawn(uint256 campaignId, address owner, uint256 amount);
    event Refunded(uint256 campaignId, address contributor, uint256 amount);

    function createCampaign(
        string memory _title,
        string memory _description,
        uint256 _goal,
        uint256 _deadline
    ) external {
        require(_deadline > block.timestamp, "Invalid deadline");
        require(_goal > 0, "Goal must be greater than zero");
        
        campaigns[campaignCount] = Campaign(
            msg.sender,
            _title,
            _description,
            _goal,
            _deadline,
            0,
            false,
            false
        );
        
        emit CampaignCreated(campaignCount, msg.sender, _title, _goal, _deadline);
        campaignCount++;
    }

    function getCampaignDetails(uint256 _campaignId) external view returns (
        address owner,
        string memory title,
        string memory description,
        uint256 goal,
        uint256 deadline,
        uint256 amountCollected,
        bool completed,
        bool goalReached
    ) {
        Campaign storage campaign = campaigns[_campaignId];
        return (
            campaign.owner,
            campaign.title,
            campaign.description,
            campaign.goal,
            campaign.deadline,
            campaign.amountCollected,
            campaign.completed,
            campaign.goalReached
        );
    }

    function fundCampaign(uint256 _campaignId) external payable {
        Campaign storage campaign = campaigns[_campaignId];
        require(block.timestamp < campaign.deadline, "Campaign expired");
        require(msg.value > 0, "Contribution must be greater than zero");
        require(!campaign.completed, "Campaign is completed");

        campaign.amountCollected += msg.value;
        contributions[_campaignId][msg.sender] += msg.value;
        
        if (campaign.amountCollected >= campaign.goal) {
            campaign.goalReached = true;
        }
        
        emit Funded(_campaignId, msg.sender, msg.value);
    }

    function withdrawFunds(uint256 _campaignId) external {
        Campaign storage campaign = campaigns[_campaignId];
        require(msg.sender == campaign.owner, "Only owner can withdraw");
        require(campaign.amountCollected >= campaign.goal, "Goal not reached");
        require(!campaign.completed, "Funds already withdrawn");
        
        campaign.completed = true;
        uint256 amount = campaign.amountCollected;
        payable(campaign.owner).transfer(amount);
        
        emit Withdrawn(_campaignId, campaign.owner, amount);
    }

    function claimRefund(uint256 _campaignId) external {
        Campaign storage campaign = campaigns[_campaignId];
        require(block.timestamp >= campaign.deadline, "Campaign not ended");
        require(!campaign.goalReached, "Goal was reached, no refunds available");
        
        uint256 contributedAmount = contributions[_campaignId][msg.sender];
        require(contributedAmount > 0, "No contribution found");
        
        contributions[_campaignId][msg.sender] = 0;
        payable(msg.sender).transfer(contributedAmount);
        
        emit Refunded(_campaignId, msg.sender, contributedAmount);
    }

    function getContribution(uint256 _campaignId, address _contributor) external view returns (uint256) {
        return contributions[_campaignId][_contributor];
    }
}