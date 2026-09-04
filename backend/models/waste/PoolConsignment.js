const mongoose = require('mongoose');

const PoolConsignmentSchema = new mongoose.Schema(
  {
    fpoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    cropType: {
      type: String,
      required: true,
    },
    crops: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Crop',
      },
    ],
    totalQuantity: {
      type: Number,
      required: true,
    },
    pricePerKg: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'ready_for_pickup', 'in_transit', 'delivered', 'sold'],
      default: 'pending',
    },
    destination: {
      address: String,
      lat: Number,
      lng: Number,
    },
    notes: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('PoolConsignment', PoolConsignmentSchema);
