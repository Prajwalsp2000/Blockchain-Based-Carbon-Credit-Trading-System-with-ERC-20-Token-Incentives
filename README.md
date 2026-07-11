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
   <img src="https://github.com/user-attachments/assets/0a0ee0ae-b4a4-45a3-96a0-7bb84ea94dcd" alt="Screenshot (340)" width="1500" height="800"/>
  <br>
  <em>Fig 1: Company Dashboard Interface. </em>
</p>

<p align="center">
    <img src="https://github.com/user-attachments/assets/bbfbcebb-c016-4c82-92a1-cae89f859217" alt="Screenshot (335)" width="1500" height="800"/>
  <br>
  <em>Fig 2: MetaMask Authentication for Emission Submission. </em>
</p>

<p align="center">
     <img src="https://github.com/user-attachments/assets/ac8d4775-f977-4fca-9aa9-22dec27d017a" alt="Screenshot (334)" width="1500" height="800"/>
  <br>
  <em>Fig 3: Updated Company Interface after Emission Submission. </em>
</p>

<p align="center">
     <img src="https://github.com/user-attachments/assets/8f56aeb4-2f37-440c-96f3-1eb31d0e3d8f" alt="Screenshot (341)" width="1500" height="800"/>
  <br>
  <em>Fig 4: Marketplace Interface for Carbon Credit Trading. </em>
</p>

<p align="center">
     <img src="https://github.com/user-attachments/assets/5d9bab48-82b4-41a8-9757-564c5003caa8" alt="Screenshot (338)" width="1500" height="800"/>
  <br>
  <em>Fig 5: MetaMask Authentication for Credit Purchase. </em>
</p>

<p align="center">
     <img src="https://github.com/user-attachments/assets/a584208f-6482-4871-b9c9-56fc6d91b932" alt="Screenshot 2026-07-09 195016" width="1500" height="800"/>
  <br>
  <em>Fig 6: Marketplace Interface after Partial Credit Purchase. </em>
</p>

<p align="center">
     <img src="https://github.com/user-attachments/assets/bf130a53-194b-471a-87a3-d6f6fc8fe596" alt="Gemini_Generated_Image_johiftjohiftjohi" width="1500" height="800"/>
  <br>
  <em>Fig 7: Multiple Listings and Partial Transactions in Marketplace. </em>
</p>


