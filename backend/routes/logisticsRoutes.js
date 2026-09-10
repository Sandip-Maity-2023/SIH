import express from 'express';
import {
  getActiveTrips,
  createTrip,
  updateDriverLocation,
  completeWaypoint,
  getDispatchSchedules,
  createDispatchSchedule,
  updateDispatchScheduleStatus,
} from '../controllers/logisticsController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

// Dispatch Schedules
router.get('/schedules', authorize('DRIVER', 'LOGISTICS', 'LOGISTICS_PARTNER', 'FPO', 'ADMIN'), getDispatchSchedules);
router.post('/schedules', authorize('DRIVER', 'LOGISTICS', 'LOGISTICS_PARTNER', 'FPO', 'ADMIN'), createDispatchSchedule);
router.patch('/schedules/:id/status', authorize('DRIVER', 'LOGISTICS', 'LOGISTICS_PARTNER', 'FPO', 'ADMIN'), updateDispatchScheduleStatus);

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