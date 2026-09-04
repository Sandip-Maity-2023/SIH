import express from 'express';
import passport from 'passport';

// Import Payout Controllers
import {
  initiatePayout,
  getPayouts,
  updatePayoutStatus,
} from '../controllers/payoutController.js';

// Import Role Authorization Middleware
import { authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Passport JWT Authentication Guard
const requireAuth = passport.authenticate('jwt', { session: false });

/**
 * @route   POST /api/payouts
 * @desc    Initiate a new payout to a farmer
 * @access  Private (Admin)
 */
router.post(
  '/',
  requireAuth,
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
  requireAuth,
  authorizeRoles('farmer', 'admin'),
  getPayouts
);

/**
 * @route   PUT /api/payouts/:id/status
 * @desc    Update payout status (Completed / Failed / Processing)
 * @access  Private (Admin)
 */
router.put(
  '/:id/status',
  requireAuth,
  authorizeRoles('admin'),
  updatePayoutStatus
);

export default router;




