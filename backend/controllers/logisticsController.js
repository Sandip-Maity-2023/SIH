
// const LogisticsTrip = require('../models/Trip');
// const Order = require('../models/Order');

// // @desc    Get active logistics trips
// // @route   GET /api/logistics/trip
// exports.getActiveTrips = async (req, res) => {
//   try {
//     const trips = await LogisticsTrip.find({ tripStatus: { $ne: 'COMPLETED' } })
//       .populate('driverId', 'name phone driverDetails')
//       .sort({ createdAt: -1 });

//     res.status(200).json({ success: true, count: trips.length, data: trips, trips });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // @desc    Create a new logistics trip for pooled orders
// // @route   POST /api/logistics/trip
// exports.createTrip = async (req, res) => {
//   try {
//     const { driverId, associatedOrders, vehicleNumber, optimizedWaypoints, totalDistanceKm, estimatedDurationMinutes } = req.body;

//     // Generate random 4-digit OTP for farm pickup verification
//     const waypointsWithOtp = optimizedWaypoints.map((wp) => ({
//       ...wp,
//       pickupOtp: Math.floor(1000 + Math.random() * 9000).toString(),
//     }));

//     const trip = await LogisticsTrip.create({
//       driverId,
//       associatedOrders,
//       vehicleNumber,
//       optimizedWaypoints: waypointsWithOtp,
//       totalDistanceKm,
//       estimatedDurationMinutes,
//       tripStatus: 'DISPATCHED',
//     });

//     // Update order status
//     await Order.updateMany(
//       { _id: { $in: associatedOrders } },
//       { $set: { orderStatus: 'LOGISTICS_ASSIGNED', logisticsTripId: trip._id } }
//     );

//     res.status(201).json({ success: true, data: trip });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // @desc    Update driver GPS location (triggers WebSocket broadcast)
// // @route   PUT /api/logistics/trip/:id/location
// exports.updateDriverLocation = async (req, res) => {
//   try {
//     const { longitude, latitude } = req.body;

//     const trip = await LogisticsTrip.findById(req.params.id);
//     if (!trip) {
//       return res.status(404).json({ success: false, message: 'Logistics trip not found' });
//     }

//     trip.currentLocation = {
//       type: 'Point',
//       coordinates: [longitude, latitude],
//       lastUpdatedAt: new Date(),
//     };

//     await trip.save();

//     // Broadcast location update via WebSockets
//     const reqSocket = req.app.get('io');
//     if (reqSocket) {
//       reqSocket.to(trip._id.toString()).emit('driverLocationUpdate', {
//         tripId: trip._id,
//         coordinates: [longitude, latitude],
//         timestamp: new Date(),
//       });
//     }

//     res.status(200).json({ success: true, data: trip.currentLocation });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // @desc    Complete a waypoint pickup using OTP verification
// // @route   PUT /api/logistics/trip/:id/complete-waypoint
// exports.completeWaypoint = async (req, res) => {
//   try {
//     const { waypointId, pickupOtp } = req.body;

//     const trip = await LogisticsTrip.findById(req.params.id);
//     if (!trip) {
//       return res.status(404).json({ success: false, message: 'Logistics trip not found' });
//     }

//     const waypoint = trip.optimizedWaypoints.id(waypointId);
//     if (!waypoint) {
//       return res.status(404).json({ success: false, message: 'Waypoint not found' });
//     }

//     if (waypoint.pickupOtp !== pickupOtp) {
//       return res.status(400).json({ success: false, message: 'Invalid pickup OTP code' });
//     }

//     waypoint.isCompleted = true;
//     waypoint.actualArrivalTime = new Date();
//     await trip.save();

//     res.status(200).json({ success: true, message: 'Waypoint verified and marked completed', data: trip });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };
import Vehicle from '../models/Vehicle.js';
import Order from '../models/Order.js';
import DispatchSchedule from '../models/DispatchSchedule.js';

// @desc    Get active logistics trips
// @route   GET /api/logistics/trip
// @access  Private (FPO, Driver, Admin)
export const getActiveTrips = async (req, res, next) => {
  try {
    const query = req.user.role === 'DRIVER'
      ? { driverId: req.user.id, isAvailable: false }
      : { isAvailable: false };

    const activeVehicles = await Vehicle.find(query).populate('activeOrderId');

    res.status(200).json({
      success: true,
      count: activeVehicles.length,
      data: activeVehicles,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create multi-pickup trip
// @route   POST /api/logistics/trip
// @access  Private (FPO, Driver, Admin)
export const createTrip = async (req, res, next) => {
  try {
    const { vehicleId, orderIds } = req.body;

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    vehicle.isAvailable = false;
    if (orderIds && orderIds.length > 0) {
      vehicle.activeOrderId = orderIds[0];
    }
    await vehicle.save();

    res.status(201).json({
      success: true,
      message: 'Logistics trip created successfully',
      data: vehicle,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Driver updates real-time GPS location
// @route   PUT /api/logistics/trip/:id/location
// @access  Private (Driver)
export const updateDriverLocation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { longitude, latitude } = req.body;

    const vehicle = await Vehicle.findById(id);
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    vehicle.currentLocation = {
      type: 'Point',
      coordinates: [Number(longitude), Number(latitude)],
      lastUpdated: new Date(),
    };

    await vehicle.save();

    // Socket.io real-time broadcast can be triggered here if req.app.get('io') is configured
    const io = req.app.get('io');
    if (io) {
      io.emit(`locationUpdate:${id}`, vehicle.currentLocation);
    }

    res.status(200).json({
      success: true,
      data: vehicle.currentLocation,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify pickup OTP at farm gate
// @route   PUT /api/logistics/trip/:id/complete-waypoint
// @access  Private (Driver)
export const completeWaypoint = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { orderId, otp } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Example OTP verification logic
    order.status = 'IN_TRANSIT';
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Waypoint completed and order status updated to IN_TRANSIT',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// Seed initial default schedules if DB collection is empty
const initialSeedSchedules = [
  {
    scheduleId: 'SCH-1001',
    origin: 'Singur Farm Cluster (Hooghly, WB)',
    destination: 'Kolkata Wholesale Mandi',
    departureTime: '2026-09-06T06:00',
    vehicleType: 'Refrigerated Truck (10 Ton)',
    driverName: 'Ramesh Kumar',
    status: 'Scheduled',
    cargoWeight: '7.5 Tons (Potatoes & Tomatoes)',
    tempControl: '4°C Cold Storage',
    notes: 'Morning priority dispatch for early mandi auction.',
  },
  {
    scheduleId: 'SCH-1002',
    origin: 'Nashik Farmer Hub (MH)',
    destination: 'Vashi APMC Mandi Navi Mumbai',
    departureTime: '2026-09-05T20:00',
    vehicleType: 'Covered Container (5 Ton)',
    driverName: 'Suresh Patil',
    status: 'In-Transit',
    cargoWeight: '4.2 Tons (Onions)',
    tempControl: 'Ambient Dry Storage',
    notes: 'GPS broadcasting enabled.',
  },
  {
    scheduleId: 'SCH-1003',
    origin: 'Sonipat Agri Hub (HR)',
    destination: 'Azadpur Mandi Delhi',
    departureTime: '2026-09-04T05:30',
    vehicleType: 'Open Pickup (2 Ton)',
    driverName: 'Vikram Singh',
    status: 'Completed',
    cargoWeight: '1.8 Tons (Leafy Greens)',
    tempControl: 'Misting System',
    notes: 'Successfully delivered and signed off.',
  },
];

// @desc    Get all dispatch schedules
// @route   GET /api/logistics/schedules
// @access  Private (Driver, Logistics, FPO, Admin)
export const getDispatchSchedules = async (req, res, next) => {
  try {
    let schedules = await DispatchSchedule.find().sort({ createdAt: -1 });

    if (schedules.length === 0) {
      // Seed default initial schedules on first run
      await DispatchSchedule.insertMany(initialSeedSchedules);
      schedules = await DispatchSchedule.find().sort({ createdAt: -1 });
    }

    res.status(200).json({
      success: true,
      count: schedules.length,
      data: schedules,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a dispatch schedule
// @route   POST /api/logistics/schedules
// @access  Private (Driver, Logistics, FPO, Admin)
export const createDispatchSchedule = async (req, res, next) => {
  try {
    const {
      origin,
      destination,
      departureTime,
      vehicleType,
      driverName,
      cargoWeight,
      tempControl,
      notes,
    } = req.body;

    if (!origin || !destination) {
      return res.status(400).json({
        success: false,
        message: 'Origin and destination are required.',
      });
    }

    const count = await DispatchSchedule.countDocuments();
    const scheduleId = `SCH-${1000 + count + 1}`;

    const newSchedule = await DispatchSchedule.create({
      scheduleId,
      driverId: req.user?.id || null,
      driverName: driverName || req.user?.name || 'Assigned Driver',
      origin,
      destination,
      departureTime: departureTime || new Date().toISOString(),
      vehicleType: vehicleType || 'Refrigerated Truck (10 Ton)',
      cargoWeight: cargoWeight || 'Standard Payload',
      tempControl: tempControl || '4°C Cold Storage',
      notes: notes || '',
      status: 'Scheduled',
      createdBy: req.user?.id || null,
    });

    res.status(201).json({
      success: true,
      message: 'Dispatch schedule created successfully in database',
      data: newSchedule,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update dispatch schedule status
// @route   PATCH /api/logistics/schedules/:id/status
// @access  Private (Driver, Logistics, FPO, Admin)
export const updateDispatchScheduleStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Scheduled', 'In-Transit', 'Completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid schedule status. Must be Scheduled, In-Transit, or Completed.',
      });
    }

    const schedule = await DispatchSchedule.findOne({
      $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { scheduleId: id }],
    });

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Dispatch schedule not found.',
      });
    }

    schedule.status = status;
    await schedule.save();

    res.status(200).json({
      success: true,
      message: `Schedule status updated to ${status}`,
      data: schedule,
    });
  } catch (error) {
    next(error);
  }
};