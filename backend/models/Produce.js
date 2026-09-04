import mongoose from 'mongoose';

const produceSchema = new mongoose.Schema(
  {
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    cropCategory: {
      type: String,
      required: true,
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
    quantityKg: {
      type: Number,
      required: true,
      min: 0,
    },
    pricePerKg: {
      type: Number,
      required: true,
      min: 0,
    },
    district: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Produce = mongoose.models.Produce || mongoose.model('Produce', produceSchema);

export default Produce;