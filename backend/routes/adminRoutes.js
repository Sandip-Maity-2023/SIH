import express from 'express';
import passport from 'passport';

// Import Admin Controllers
import {
  getAnalytics,
  getPendingKycUsers,
  getSettings,
  updateSettings,
  verifyUserKyc,
} from '../controllers/adminController.js';

// Import Role Authorization Middleware
import { authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Passport JWT Authentication Guard
const requireAuth = passport.authenticate('jwt', { session: false });

/**
 * @route   GET /api/admin/analytics
 * @desc    Get overall system analytics & metrics
 * @access  Private (Admin)
 */
router.get(
  '/analytics',
  requireAuth,
  authorizeRoles('admin'),
  getAnalytics
);

/**
 * @route   GET /api/admin/settings
 * @desc    Get platform configuration settings
 * @access  Private (Admin)
 */
router.get(
  '/settings',
  requireAuth,
  authorizeRoles('admin'),
  getSettings
);

/**
 * @route   PUT /api/admin/settings
 * @desc    Update platform configuration settings
 * @access  Private (Admin)
 */
router.put(
  '/settings',
  requireAuth,
  authorizeRoles('admin'),
  updateSettings
);

/**
 * @route   GET /api/admin/kyc/pending
 * @desc    Get list of users pending KYC verification
 * @access  Private (Admin)
 */
router.get(
  '/kyc/pending',
  requireAuth,
  authorizeRoles('admin'),
  getPendingKycUsers
);

/**
 * @route   PUT /api/admin/kyc/verify/:userId
 * @desc    Verify or reject a user's KYC submission
 * @access  Private (Admin)
 */
router.put(
  '/kyc/verify/:userId',
  requireAuth,
  authorizeRoles('admin'),
  verifyUserKyc
);

export default router;