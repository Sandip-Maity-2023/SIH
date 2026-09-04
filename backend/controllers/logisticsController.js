
const LogisticsTrip = require('../models/Trip');
const Order = require('../models/Order');

// @desc    Get active logistics trips
// @route   GET /api/logistics/trip
exports.getActiveTrips = async (req, res) => {
  try {
    const trips = await LogisticsTrip.find({ tripStatus: { $ne: 'COMPLETED' } })
      .populate('driverId', 'name phone driverDetails')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: trips.length, data: trips, trips });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new logistics trip for pooled orders
// @route   POST /api/logistics/trip
exports.createTrip = async (req, res) => {
  try {
    const { driverId, associatedOrders, vehicleNumber, optimizedWaypoints, totalDistanceKm, estimatedDurationMinutes } = req.body;

    // Generate random 4-digit OTP for farm pickup verification
    const waypointsWithOtp = optimizedWaypoints.map((wp) => ({
      ...wp,
      pickupOtp: Math.floor(1000 + Math.random() * 9000).toString(),
    }));

    const trip = await LogisticsTrip.create({
      driverId,
      associatedOrders,
      vehicleNumber,
      optimizedWaypoints: waypointsWithOtp,
      totalDistanceKm,
      estimatedDurationMinutes,
      tripStatus: 'DISPATCHED',
    });

    // Update order status
    await Order.updateMany(
      { _id: { $in: associatedOrders } },
      { $set: { orderStatus: 'LOGISTICS_ASSIGNED', logisticsTripId: trip._id } }
    );

    res.status(201).json({ success: true, data: trip });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update driver GPS location (triggers WebSocket broadcast)
// @route   PUT /api/logistics/trip/:id/location
exports.updateDriverLocation = async (req, res) => {
  try {
    const { longitude, latitude } = req.body;

    const trip = await LogisticsTrip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Logistics trip not found' });
    }

    trip.currentLocation = {
      type: 'Point',
      coordinates: [longitude, latitude],
      lastUpdatedAt: new Date(),
    };

    await trip.save();

    // Broadcast location update via WebSockets
    const reqSocket = req.app.get('io');
    if (reqSocket) {
      reqSocket.to(trip._id.toString()).emit('driverLocationUpdate', {
        tripId: trip._id,
        coordinates: [longitude, latitude],
        timestamp: new Date(),
      });
    }

    res.status(200).json({ success: true, data: trip.currentLocation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Complete a waypoint pickup using OTP verification
// @route   PUT /api/logistics/trip/:id/complete-waypoint
exports.completeWaypoint = async (req, res) => {
  try {
    const { waypointId, pickupOtp } = req.body;

    const trip = await LogisticsTrip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Logistics trip not found' });
    }

    const waypoint = trip.optimizedWaypoints.id(waypointId);
    if (!waypoint) {
      return res.status(404).json({ success: false, message: 'Waypoint not found' });
    }

    if (waypoint.pickupOtp !== pickupOtp) {
      return res.status(400).json({ success: false, message: 'Invalid pickup OTP code' });
    }

    waypoint.isCompleted = true;
    waypoint.actualArrivalTime = new Date();
    await trip.save();

    res.status(200).json({ success: true, message: 'Waypoint verified and marked completed', data: trip });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
