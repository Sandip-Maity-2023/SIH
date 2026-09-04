import express from 'express';
import passport from 'passport';

// Import Dispute Controllers
import {
  createDispute,
  getDisputes,
  resolveDispute,
} from '../controllers/disputeController.js';

// Import Role Authorization Middleware
import { authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Passport JWT Authentication Guard
const requireAuth = passport.authenticate('jwt', { session: false });

/**
 * @route   POST /api/disputes
 * @desc    Raise a new quality or delivery dispute
 * @access  Private (Buyer, Farmer, Driver)
 */
router.post(
  '/',
  requireAuth,
  createDispute
);

/**
 * @route   GET /api/disputes
 * @desc    Get all disputes (Filtered by user or admin access)
 * @access  Private
 */
router.get(
  '/',
  requireAuth,
  getDisputes
);

/**
 * @route   PUT /api/disputes/:id/resolve
 * @desc    Resolve dispute & process refund details
 * @access  Private (Admin)
 */
router.put(
  '/:id/resolve',
  requireAuth,
  authorizeRoles('admin'),
  resolveDispute
);

export default router;