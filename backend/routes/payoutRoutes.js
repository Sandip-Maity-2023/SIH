import express from 'express';

// Import Payout Controllers
import {
  initiatePayout,
  getPayouts,
  updatePayoutStatus,
  requestBankTransfer,
} from '../controllers/payoutController.js';

// Import Authorization Middleware
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Allow authenticated users to request bank transfer
router.post('/request', protect, requestBankTransfer);

/**
 * @route   POST /api/payouts
 * @desc    Initiate a new payout to a farmer
 * @access  Private (Admin)
 */
router.post(
  '/',
  protect,
  authorizeRoles('admin'),
  initiatePayout
);

/**
 * @route   GET /api/payouts
 * @desc    Get payout ledger history for logged-in user or admin
 * @access  Private (Farmer, Admin)
 */
router.get(
  '/',
  protect,
  authorizeRoles('farmer', 'fpo', 'admin'),
  getPayouts
);

/**
 * @route   PUT /api/payouts/:id/status
 * @desc    Update payout status (Completed / Failed / Processing)
 * @access  Private (Admin)
 */
router.put(
  '/:id/status',
  protect,
  authorizeRoles('admin'),
  updatePayoutStatus
);

export default router;




