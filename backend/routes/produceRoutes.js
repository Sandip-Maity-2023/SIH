import express from 'express';
import passport from 'passport';

// Import Produce Controllers
import {
  createProduce,
  getAllProduce,
  getProduceById,
  updateProduce,
  deleteProduce,
  placeBid,
} from '../controllers/produceController.js';

// Import Role Authorization Middleware
import { authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Passport JWT Authentication Guard
const requireAuth = passport.authenticate('jwt', { session: false });

/**
 * @route   POST /api/produce
 * @desc    Create a new crop/produce listing
 * @access  Private (Farmer, FPO)
 */
router.post(
  '/',
  requireAuth,
  authorizeRoles('farmer', 'fpo'),
  createProduce
);

/**
 * @route   GET /api/produce
 * @desc    Get all available produce listings with filter/search options
 * @access  Public
 */
router.get(
  '/',
  getAllProduce
);

/**
 * @route   GET /api/produce/:id
 * @desc    Get specific produce listing details by ID
 * @access  Public
 */
router.get(
  '/:id',
  getProduceById
);

/**
 * @route   PUT /api/produce/:id
 * @desc    Update an existing produce listing
 * @access  Private (Farmer, FPO, Admin)
 */
router.put(
  '/:id',
  requireAuth,
  authorizeRoles('farmer', 'fpo', 'admin'),
  updateProduce
);

/**
 * @route   DELETE /api/produce/:id
 * @desc    Delete a produce listing
 * @access  Private (Farmer, FPO, Admin)
 */
router.delete(
  '/:id',
  requireAuth,
  authorizeRoles('farmer', 'fpo', 'admin'),
  deleteProduce
);

/**
 * @route   POST /api/produce/:id/bids
 * @desc    Submit a bid on a produce lot
 * @access  Private (Buyer)
 */
router.post(
  '/:id/bids',
  requireAuth,
  authorizeRoles('buyer'),
  placeBid
);

export default router;