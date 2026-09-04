import express from 'express';

// Import Produce Controllers
import {
  createProduce,
  getAllProduce,
  getProduceById,
  updateProduce,
  deleteProduce,
  placeBid,
} from '../controllers/produceController.js';

// Import Authorization Middleware
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @route   POST /api/produce
 * @desc    Create a new crop/produce listing
 * @access  Private (Farmer, FPO)
 */
router.post(
  '/',
  protect,
  authorizeRoles('farmer', 'fpo', 'admin'),
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
  protect,
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
  protect,
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
  protect,
  authorizeRoles('buyer', 'consumer', 'bulk_buyer', 'admin'),
  placeBid
);

export default router;