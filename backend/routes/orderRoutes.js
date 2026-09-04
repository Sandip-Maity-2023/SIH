import express from 'express';
import {
  createOrder,
  getUserOrders,
  releaseEscrow,
} from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// All order routes require authentication
router.use(protect);

// Get orders for current user (Buyer or Farmer)
router.get('/', getUserOrders);

// Buyer creates a new order and locks funds in escrow
router.post('/', authorize('BUYER'), createOrder);

// Release escrow funds to farmers after delivery verification
router.put(
  '/:id/release-escrow',
  authorize('BUYER', 'ADMIN'),
  releaseEscrow
);

export default router;