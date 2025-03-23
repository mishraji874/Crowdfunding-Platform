// scripts/deploy.ts
import { ethers } from "hardhat";

async function main() {
    try {
        console.log("Deploying Crowdfunding contract...");

        // Deploy the contract
        const Crowdfunding = await ethers.getContractFactory("Crowdfunding");
        const crowdfunding = await Crowdfunding.deploy();
        await crowdfunding.deployed();

        console.log(`Crowdfunding contract deployed to: ${crowdfunding.address}`);

        // Verify the deployment
        console.log("\nDeployment verified! Contract is ready for use.");
        console.log("You can now interact with the contract at:", crowdfunding.address);

    } catch (error) {
        console.error("Error during deployment:", error);
        process.exit(1);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });