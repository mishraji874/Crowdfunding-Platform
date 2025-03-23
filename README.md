# Web3 Crowdfunding Platform

A decentralized crowdfunding platform built on blockchain technology that allows users to create and contribute to fundraising campaigns using cryptocurrency.

## Features

- Create fundraising campaigns with custom goals and deadlines
- Contribute ETH to campaigns
- Track campaign progress and contributions
- Smart contract-based secure fund management
- Connect with Web3 wallets (MetaMask)

## Tech Stack

- Solidity
- React.js
- Hardhat
- Ethers.js
- Tailwind CSS

## Prerequisites

- Node.js (v14+ recommended)
- MetaMask wallet
- Git

## Installation

1. Clone the repository
```bash
git clone [your-repo-link]
cd web3-crowd-funding
```

2. Install dependencies on both `frontend` and `backend` folders using the given below command
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

## Smart Contract Deployment

1. Configure your `.env` file with your private key and network details
2. Deploy to your chosen network:
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.