# Blockchain - Based Carbon Credit Trading System with ERC-20 Token Incentives and Decentralized Marketplace

• Traditional carbon credit trading systems are primarily centralized, resulting in limited transparency, inefficient record management, delayed settlements, and dependence on intermediaries.

• To address these challenges, this project presents a Blockchain-Based Carbon Credit Trading System that leverages Ethereum blockchain technology and smart contracts to provide a secure, transparent, and decentralized platform for managing and trading carbon credits.

• Organizations can register using MetaMask, submit their carbon emission data, and automatically receive rewards or penalties based on predefined emission thresholds. Carbon credits are represented as ERC-20 tokens, enabling secure peer-to-peer trading through a decentralized marketplace.

• The platform also supports partial buying and selling of carbon credits, providing greater flexibility for participants.

• Smart contracts automate emission tracking, carbon credit allocation, penalty enforcement, and marketplace transactions, ensuring transparency, immutability, and trust while reducing manual intervention.

# Features

- Company registration using MetaMask wallet
- Secure wallet authentication and transaction signing
- Carbon emission tracking and recording
- Automatic reward and penalty mechanism
- ERC-20 Carbon Credit Token implementation
- Decentralized carbon credit marketplace
- Partial buying and selling of carbon credits
- Real-time balance updates
- Purchase history tracking
- Transparent blockchain transaction records

# Technologies Used

• Frontend: React.js, HTML5, CSS3, JavaScript

• Blockchain: Ethereum, Solidity Smart Contracts, Hardhat, OpenZeppelin ERC-20

• Wallet: MetaMask

• Libraries: Ethers.js

# Installation & Setup

1. Clone the repository
 ```
 git clone https://github.com/Prajwalsp2000/Blockchain-Based-Carbon-Credit-Trading-System-with-ERC-20-Token-Incentives.git
 ```
2. Install dependencies
```
npm install
```
3. Compile Smart Contracts
```
npx hardhat compile
```
4. Start Local Hardhat Network
```
npx hardhat node
```
5. Deploy Smart Contracts
```
npx hardhat run scripts/deploy.js --network localhost
```

6. Install React Dependencies

```
cd client
npm install
```

7. Start React Application
```
npm start
```

# Configuration

- Install and configure MetaMask.
- Connect MetaMask to the Hardhat Local Network.
- After deploying the smart contracts, update the deployed contract addresses in the React application.
- Ensure the contract ABI files are correctly imported into the frontend.

# Output

<p align="center">
   <img src="https://github.com/user-attachments/assets/6e757a4c-a46b-4605-9663-7153ec42c849" alt="Screenshot (340)" width="1500" height="800"/>
  <br>
  <em>Fig 1: Company Dashboard Interface. </em>
</p>

<p align="center">
    <img src="https://github.com/user-attachments/assets/84f969bf-4d89-424e-8bf1-579a1d6e97de" alt="Screenshot (335)" width="1500" height="800"/>
  <br>
  <em>Fig 2: MetaMask Authentication for Emission Submission. </em>
</p>

<p align="center">
     <img src="https://github.com/user-attachments/assets/59b1e117-fcd3-4b49-9aa0-92e2644733a9" alt="Screenshot (334)" width="1500" height="800"/>
  <br>
  <em>Fig 3: Updated Company Interface after Emission Submission. </em>
</p>

<p align="center">
     <img src="https://github.com/user-attachments/assets/49a9e8d6-a153-49f2-bf94-88b6cdb95a9f"" alt="Screenshot (341)" width="1500" height="800"/>
  <br>
  <em>Fig 4: Marketplace Interface for Carbon Credit Trading. </em>
</p>

<p align="center">
     <img src="https://github.com/user-attachments/assets/84fb55c8-0a49-41e7-a021-12245ebe3d6a" alt="Screenshot (338)" width="1500" height="800"/>
  <br>
  <em>Fig 5: MetaMask Authentication for Credit Purchase. </em>
</p>

<p align="center">
     <img src="https://github.com/user-attachments/assets/dd184b71-8ff5-49cf-b0b3-56a9def912bf" alt="Screenshot 2026-07-09 195016" width="1500" height="800"/>
  <br>
  <em>Fig 6: Marketplace Interface after Partial Credit Purchase. </em>
</p>

<p align="center">
     <img src="https://github.com/user-attachments/assets/9202a746-e5d6-415f-afcd-03097835a026" alt="Gemini_Generated_Image_johiftjohiftjohi" width="1500" height="800"/>
  <br>
  <em>Fig 7: Multiple Listings and Partial Transactions in Marketplace. </em>
</p>


