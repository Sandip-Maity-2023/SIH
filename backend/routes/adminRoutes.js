import express from 'express';

// Import Admin Controllers
import {
  getAnalytics,
  getPendingKycUsers,
  getSettings,
  updateSettings,
  verifyUserKyc,
} from '../controllers/adminController.js';

// Import Authorization Middleware
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @route   GET /api/admin/analytics
 * @desc    Get overall system analytics & metrics
 * @access  Private (Admin)
 */
router.get(
  '/analytics',
  protect,
  authorizeRoles('ADMIN', 'FARMER', 'FPO', 'BUYER', 'LOGISTICS', 'DRIVER', 'admin', 'farmer', 'fpo', 'buyer', 'logistics', 'driver'),
  getAnalytics
);

/**
 * @route   GET /api/admin/settings
 * @desc    Get platform configuration settings
 * @access  Private (Admin)
 */
router.get(
  '/settings',
  protect,
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
  protect,
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
  protect,
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
  protect,
  authorizeRoles('admin'),
  verifyUserKyc
);

export default router;