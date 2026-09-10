// escrowService.js
const { ethers } = require("ethers");
require("dotenv").config();

// Connect to local Hardhat/Ganache node or Polygon Amoy Testnet RPC
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

// Wallet instance executing automated transaction calls (Platform Admin)
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const contractAddress = "YOUR_DEPLOYED_CONTRACT_ADDRESS";
const contractABI = [
  "function currentState() view returns (uint8)",
  "function depositPayment() external payable",
  "function confirmDelivery() external"
];

const escrowContract = new ethers.Contract(contractAddress, contractABI, wallet);

async function releasePaymentToFarmer() {
    try {
        console.log("Triggering automated escrow release...");
        const tx = await escrowContract.confirmDelivery();
        await tx.wait(); // Wait for block confirmation
        console.log(`Payment successfully released! Tx Hash: ${tx.hash}`);
    } catch (error) {
        console.error("Failed to release escrow payment:", error);
    }
}

// Example usage: Call when delivery QR code is scanned & validated in backend
releasePaymentToFarmer();


