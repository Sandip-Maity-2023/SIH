
const express = require('express');
const router = express.Router();
const {
  gradeCropQuality,
  getMandiForecast,
  getOptimizedRoute,
} = require('../controllers/aiProxyController');
const { protect, authorize } = require('../../middleware/authMiddleware');

// Public or lightweight cached route for Mandi price & demand forecasting
router.get('/forecast-price', getMandiForecast);

// Protected AI routes
router.post('/grade-quality', protect, gradeCropQuality);

// Logistics & Admin route to calculate optimal multi-stop pickup routes
router.post(
  '/optimize-route',
  protect,
  authorize('DRIVER', 'FPO', 'ADMIN'),
  getOptimizedRoute
);

module.exports = router;
