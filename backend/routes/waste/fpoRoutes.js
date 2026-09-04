
const express = require('express');
const router = express.Router();
const passport = require('passport');

// Import Controllers
const {
  poolCropLots,
  getPooledConsignments,
  getConsignmentById,
  updateConsignmentStatus,
} = require('../controllers/fpoController');

// Import Role Authorization Middleware
const { authorizeRoles } = require('../../middleware/authMiddleware');

// Passport JWT Authentication Guard
const requireAuth = passport.authenticate('jwt', { session: false });

/**
 * @route   POST /api/fpo/pool
 * @desc    Pool multiple individual farmer crop lots into a single FPO bulk consignment
 * @access  Private (FPO Manager / Admin)
 */
router.post(
  '/pool',
  requireAuth,
  authorizeRoles('fpo', 'admin'),
  poolCropLots
);

/**
 * @route   GET /api/fpo/consignments
 * @desc    Get all pooled consignments managed by the authenticated FPO
 * @access  Private (FPO Manager, Admin, Farmer)
 */
router.get(
  '/consignments',
  requireAuth,
  authorizeRoles('fpo', 'farmer', 'admin'),
  getPooledConsignments
);

/**
 * @route   GET /api/fpo/consignments/:id
 * @desc    Get specific pooled consignment details by ID
 * @access  Private (FPO Manager, Buyer, Farmer, Admin)
 */
router.get(
  '/consignments/:id',
  requireAuth,
  getConsignmentById
);

/**
 * @route   PATCH /api/fpo/consignments/:id/status
 * @desc    Update consignment status (e.g., 'ready_for_pickup', 'in_transit', 'sold')
 * @access  Private (FPO Manager, Admin)
 */
router.patch(
  '/consignments/:id/status',
  requireAuth,
  authorizeRoles('fpo', 'admin'),
  updateConsignmentStatus
);

module.exports = router;