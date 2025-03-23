// test/Crowdfunding.test.ts
import { expect } from "chai";
import { ethers } from "hardhat";
import { Crowdfunding } from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { time } from "@nomicfoundation/hardhat-network-helpers";

describe("Crowdfunding", function () {
    let crowdfunding: Crowdfunding;
    let owner: SignerWithAddress;
    let addr1: SignerWithAddress;
    let addr2: SignerWithAddress;
    let addrs: SignerWithAddress[];

    beforeEach(async function () {
        // Get signers
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

        // Deploy contract
        const Crowdfunding = await ethers.getContractFactory("Crowdfunding");
        crowdfunding = await Crowdfunding.deploy();
        await crowdfunding.deployed();
    });

    describe("Campaign Creation", function () {
        it("Should create a new campaign", async function () {
            const deadline = (await time.latest()) + 86400; // 1 day from now
            await crowdfunding.createCampaign(
                "Test Campaign",
                "Test Description",
                ethers.utils.parseEther("1"),
                deadline
            );

            const campaign = await crowdfunding.getCampaignDetails(0);
            expect(campaign.title).to.equal("Test Campaign");
            expect(campaign.goal).to.equal(ethers.utils.parseEther("1"));
        });

        it("Should fail with invalid deadline", async function () {
            const pastDeadline = (await time.latest()) - 86400; // 1 day ago
            await expect(
                crowdfunding.createCampaign(
                    "Test Campaign",
                    "Test Description",
                    ethers.utils.parseEther("1"),
                    pastDeadline
                )
            ).to.be.revertedWith("Invalid deadline");
        });
    });

    describe("Campaign Funding", function () {
        beforeEach(async function () {
            const deadline = (await time.latest()) + 86400;
            await crowdfunding.createCampaign(
                "Test Campaign",
                "Test Description",
                ethers.utils.parseEther("1"),
                deadline
            );
        });

        it("Should accept funds", async function () {
            await crowdfunding.connect(addr1).fundCampaign(0, {
                value: ethers.utils.parseEther("0.5"),
            });

            const campaign = await crowdfunding.getCampaignDetails(0);
            expect(campaign.amountCollected).to.equal(ethers.utils.parseEther("0.5"));
        });

        it("Should track individual contributions", async function () {
            await crowdfunding.connect(addr1).fundCampaign(0, {
                value: ethers.utils.parseEther("0.5"),
            });

            const contribution = await crowdfunding.getContribution(0, addr1.address);
            expect(contribution).to.equal(ethers.utils.parseEther("0.5"));
        });
    });

    describe("Withdrawals", function () {
        beforeEach(async function () {
            const deadline = (await time.latest()) + 86400;
            await crowdfunding.createCampaign(
                "Test Campaign",
                "Test Description",
                ethers.utils.parseEther("1"),
                deadline
            );
        });

        it("Should allow withdrawal after goal is reached", async function () {
            await crowdfunding.connect(addr1).fundCampaign(0, {
                value: ethers.utils.parseEther("1"),
            });

            const initialBalance = await owner.getBalance();
            await crowdfunding.withdrawFunds(0);
            const finalBalance = await owner.getBalance();

            expect(finalBalance.gt(initialBalance)).to.be.true;
        });

        it("Should prevent withdrawal before goal is reached", async function () {
            await crowdfunding.connect(addr1).fundCampaign(0, {
                value: ethers.utils.parseEther("0.5"),
            });

            await expect(crowdfunding.withdrawFunds(0)).to.be.revertedWith(
                "Goal not reached"
            );
        });
    });

    describe("Refunds", function () {
        beforeEach(async function () {
            const deadline = (await time.latest()) + 86400;
            await crowdfunding.createCampaign(
                "Test Campaign",
                "Test Description",
                ethers.utils.parseEther("1"),
                deadline
            );
        });

        it("Should allow refunds if goal not reached and deadline passed", async function () {
            await crowdfunding.connect(addr1).fundCampaign(0, {
                value: ethers.utils.parseEther("0.5"),
            });

            // Advance time past deadline
            await time.increase(86401);

            const initialBalance = await addr1.getBalance();
            await crowdfunding.connect(addr1).claimRefund(0);
            const finalBalance = await addr1.getBalance();

            expect(finalBalance.gt(initialBalance)).to.be.true;
        });

        it("Should prevent refunds if goal reached", async function () {
            await crowdfunding.connect(addr1).fundCampaign(0, {
                value: ethers.utils.parseEther("1"),
            });

            await time.increase(86401);

            await expect(
                crowdfunding.connect(addr1).claimRefund(0)
            ).to.be.revertedWith("Goal was reached, no refunds available");
        });
    });
});