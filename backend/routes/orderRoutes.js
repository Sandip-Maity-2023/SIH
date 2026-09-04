import express from 'express';
import {
  createOrder,
  getUserOrders,
  releaseEscrow,
  createRazorpayOrder,
  verifyRazorpayPayment,
} from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// All order routes require authentication
router.use(protect);

// Get orders for current user (Buyer or Farmer)
router.get('/', getUserOrders);

// Buyer creates a new order and locks funds in escrow
router.post('/', authorize('BUYER', 'consumer', 'bulk_buyer'), createOrder);

// Razorpay Order Creation and Verification
router.post('/razorpay-order', createRazorpayOrder);
router.post('/verify-payment', verifyRazorpayPayment);

// Release escrow funds to farmers after delivery verification
router.put(
  '/:id/release-escrow',
  authorize('BUYER', 'consumer', 'bulk_buyer', 'ADMIN'),
  releaseEscrow
);

export default router;