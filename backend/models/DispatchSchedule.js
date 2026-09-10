import mongoose from 'mongoose';

const dispatchScheduleSchema = new mongoose.Schema(
  {
    scheduleId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    driverName: {
      type: String,
      default: 'Assigned Driver',
      trim: true,
    },
    origin: {
      type: String,
      required: [true, 'Origin hub or farm cluster is required'],
      trim: true,
    },
    destination: {
      type: String,
      required: [true, 'Destination mandi or facility is required'],
      trim: true,
    },
    departureTime: {
      type: String,
      required: [true, 'Departure date and time is required'],
    },
    vehicleType: {
      type: String,
      default: 'Refrigerated Truck (10 Ton)',
    },
    cargoWeight: {
      type: String,
      default: 'Standard Payload',
    },
    tempControl: {
      type: String,
      default: '4°C Cold Storage',
    },
    notes: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Scheduled', 'In-Transit', 'Completed'],
      default: 'Scheduled',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true }
);

dispatchScheduleSchema.index({ status: 1 });
dispatchScheduleSchema.index({ driverId: 1 });
dispatchScheduleSchema.index({ createdAt: -1 });

const DispatchSchedule =
  mongoose.models.DispatchSchedule ||
  mongoose.model('DispatchSchedule', dispatchScheduleSchema);

export default DispatchSchedule;
