
const mongoose = require('mongoose');

const cropLotSchema = new mongoose.Schema(
  {
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Optional reference if this lot is pooled/managed by an FPO
    fpoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    cropName: {
      type: String,
      required: [true, 'Crop name is required'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['VEGETABLE', 'FRUIT', 'GRAIN', 'PULSE', 'OILSEED'],
      required: true,
    },
    quantityKg: {
      type: Number,
      required: [true, 'Quantity in KG is required'],
      min: [1, 'Quantity must be at least 1 kg'],
    },
    expectedPricePerKg: {
      type: Number,
      required: [true, 'Expected price per kg is required'],
    },
    harvestDate: {
      type: Date,
      required: true,
    },
    images: [{ type: String }], // Cloudinary or S3 URLs
    voiceNoteUrl: { type: String }, // Optional original voice recording link

    // AI Computer Vision Quality Verification Results
    aiQualityGrade: {
      grade: {
        type: String,
        enum: ['A', 'B', 'C', 'REJECTED', 'PENDING'],
        default: 'PENDING',
      },
      confidenceScore: { type: Number, min: 0, max: 1 },
      defectsDetected: [{ type: String }], // e.g., ["surface_discoloration", "pest_spotting"]
      evaluatedAt: Date,
    },

    // Specific farm pickup location
    pickupLocation: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
      farmAddress: String,
    },

    status: {
      type: String,
      enum: ['AVAILABLE', 'POOLED', 'LOCKED_IN_ORDER', 'SOLD', 'CANCELLED'],
      default: 'AVAILABLE',
    },
    bids: [
      {
        buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        bidAmountPerKg: { type: Number, required: true },
        quantityKg: { type: Number, required: true },
        message: String,
        status: {
          type: String,
          enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'COUNTERED'],
          default: 'PENDING',
        },
        counterAmountPerKg: Number,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

cropLotSchema.index({ pickupLocation: '2dsphere' });
cropLotSchema.index({ cropName: 1, status: 1 });

module.exports = mongoose.model('CropLot', cropLotSchema);
