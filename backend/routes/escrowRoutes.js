import express from 'express';
import { ethers } from 'ethers';
import logger from '../utils/logger.js';

const router = express.Router();

const contractABI = [
  "function currentState() view returns (uint8)",
  "function amount() view returns (uint256)",
  "function confirmDelivery() external",
  "function refundBuyer() external"
];

// Helper to instantiate contract instance lazily
const getEscrowContract = () => {
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL || 'http://127.0.0.1:8545/');
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  return new ethers.Contract(process.env.CONTRACT_ADDRESS, contractABI, wallet);
};

// @route   GET /api/escrow/status
// @desc    Fetch state of deployed smart contract
router.get('/status', async (req, res, next) => {
  try {
    if (!process.env.CONTRACT_ADDRESS) {
      return res.status(400).json({ success: false, message: 'CONTRACT_ADDRESS not configured in .env' });
    }

    const escrow = getEscrowContract();
    const state = await escrow.currentState();
    const amount = await escrow.amount();
    const states = ['Created', 'Deposited', 'Delivered', 'Refunded'];

    res.json({
      success: true,
      state: states[state],
      amountETH: ethers.formatEther(amount)
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/escrow/confirm-delivery
// @desc    Trigger blockchain payment release upon delivery confirmation
router.post('/confirm-delivery', async (req, res, next) => {
  try {
    const escrow = getEscrowContract();
    logger.info('Executing smart contract payment release to farmer...');
    
    const tx = await escrow.confirmDelivery();
    await tx.wait(); // Wait for block confirmation

    res.json({
      success: true,
      message: 'Escrow payment released to farmer successfully on blockchain.',
      transactionHash: tx.hash
    });
  } catch (error) {
    next(error);
  }
});

export default router;
