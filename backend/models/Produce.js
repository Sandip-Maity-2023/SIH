import mongoose from 'mongoose';

const bidSchema = new mongoose.Schema(
  {
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    bidAmountPerKg: {
      type: Number,
      required: true,
      min: 0,
    },
    quantityKg: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'COUNTERED', 'EXPIRED'],
      default: 'PENDING',
    },
    message: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const produceSchema = new mongoose.Schema(
  {
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    fpoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    title: {
      type: String,
      trim: true,
    },
    cropName: {
      type: String,
      trim: true,
    },
    cropCategory: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      trim: true,
    },
    variety: {
      type: String,
      trim: true,
    },
    grade: {
      type: String,
      enum: ['A_PREMIUM', 'B_STANDARD', 'C_BULK_PROCESSING'],
      default: 'B_STANDARD',
    },
    aiQualityGrade: {
      type: mongoose.Schema.Types.Mixed,
    },
    quantityKg: {
      type: Number,
      required: true,
      min: 0,
    },
    pricePerKg: {
      type: Number,
      min: 0,
    },
    expectedPricePerKg: {
      type: Number,
      min: 0,
    },
    harvestDate: {
      type: Date,
    },
    images: {
      type: [String],
      default: [],
    },
    voiceNoteUrl: {
      type: String,
    },
    district: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    pickupLocation: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [73.7898, 20.0063],
      },
      address: {
        villageOrCity: String,
        district: String,
        state: String,
        pincode: String,
      },
    },
    status: {
      type: String,
      enum: ['AVAILABLE', 'POOLED', 'LOCKED_IN_ORDER', 'SOLD', 'CANCELLED'],
      default: 'AVAILABLE',
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    bids: [bidSchema],
  },
  { timestamps: true }
);

produceSchema.pre('save', function (next) {
  if (this.cropName && !this.title) {
    this.title = this.cropName;
  }
  if (this.title && !this.cropName) {
    this.cropName = this.title;
  }
  if (this.category && !this.cropCategory) {
    this.cropCategory = this.category;
  }
  if (this.cropCategory && !this.category) {
    this.category = this.cropCategory;
  }
  if (this.expectedPricePerKg !== undefined && this.pricePerKg === undefined) {
    this.pricePerKg = this.expectedPricePerKg;
  }
  if (this.pricePerKg !== undefined && this.expectedPricePerKg === undefined) {
    this.expectedPricePerKg = this.pricePerKg;
  }
  this.isAvailable = this.status === 'AVAILABLE';
  next();
});

const Produce = mongoose.models.Produce || mongoose.model('Produce', produceSchema);

export default Produce;