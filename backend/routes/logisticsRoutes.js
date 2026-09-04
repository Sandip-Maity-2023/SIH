import express from 'express';
import {
  getActiveTrips,
  createTrip,
  updateDriverLocation,
  completeWaypoint,
} from '../controllers/logisticsController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/trip', authorize('FPO', 'DRIVER', 'ADMIN'), getActiveTrips);

// Create a multi-pickup trip (FPO / Admin / Driver)
router.post('/trip', authorize('FPO', 'DRIVER', 'ADMIN'), createTrip);

// Driver updates real-time GPS location (Triggers Socket.io event)
router.put(
  '/trip/:id/location',
  authorize('DRIVER'),
  updateDriverLocation
);

// Verify pickup OTP at farm gate
router.put(
  '/trip/:id/complete-waypoint',
  authorize('DRIVER'),
  completeWaypoint
);

export default router;