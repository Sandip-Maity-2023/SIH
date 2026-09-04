
const express = require('express');
const router = express.Router();
const {
  createCropLot,
  getCropLots,
  getCropLotById,
  poolCropLots,
  placeBid,
  updateBidStatus,
} = require('../controllers/cropController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public route to view available crops with optional filters
router.get('/', getCropLots);
router.get('/:id', getCropLotById);
router.post('/:id/bids', protect, authorize('BUYER'), placeBid);
router.put('/:cropId/bids/:bidId', protect, authorize('FARMER', 'FPO', 'ADMIN'), updateBidStatus);

// Protected routes (Farmers & FPOs only)
router.post(
  '/',
  protect,
  authorize('FARMER', 'FPO'),
  upload.fields([
    { name: 'images', maxCount: 5 },
    { name: 'voiceNote', maxCount: 1 },
  ]),
  createCropLot
);

// FPO-specific route to pool multiple farmer lots
router.put(
  '/pool',
  protect,
  authorize('FPO', 'ADMIN'),
  poolCropLots
);

module.exports = router;
