import express from 'express';

// Import Dispute Controllers
import {
  createDispute,
  getDisputes,
  resolveDispute,
} from '../controllers/disputeController.js';

// Import Authorization Middleware
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @route   POST /api/disputes
 * @desc    Raise a new quality or delivery dispute
 * @access  Private (Buyer, Farmer, Driver)
 */
router.post(
  '/',
  protect,
  createDispute
);

/**
 * @route   GET /api/disputes
 * @desc    Get all disputes (Filtered by user or admin access)
 * @access  Private
 */
router.get(
  '/',
  protect,
  getDisputes
);

/**
 * @route   PUT /api/disputes/:id/resolve
 * @desc    Resolve dispute & process refund details
 * @access  Private (Admin)
 */
router.put(
  '/:id/resolve',
  protect,
  authorizeRoles('admin'),
  resolveDispute
);

export default router;