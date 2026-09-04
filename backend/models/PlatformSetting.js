import mongoose from 'mongoose';

const platformSettingSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      default: 'default',
      unique: true,
      trim: true,
      lowercase: true,
    },
    platformCommissionPercent: {
      type: Number,
      default: 2, // Aligned with the 2% platform fee from backend business logic
      min: [0, 'Commission percent cannot be negative.'],
      max: [100, 'Commission percent cannot exceed 100.'],
    },
    logisticsCostPerKm: {
      type: Number,
      default: 12, // Aligned with default rate used in calculateOrderTotal
      min: [0, 'Logistics cost cannot be negative.'],
    },
    minimumLogisticsFee: {
      type: Number,
      default: 150, // Base minimum charge for transport
      min: [0, 'Base logistics fee cannot be negative.'],
    },
    paymentGatewayFeePercent: {
      type: Number,
      default: 0.25,
      min: [0, 'Payment gateway fee cannot be negative.'],
      max: [100, 'Payment gateway fee cannot exceed 100.'],
    },
    spoilageDelayPenaltyEnabled: {
      type: Boolean,
      default: true,
    },
    spoilageDelayPenaltyPerHour: {
      type: Number,
      default: 50,
      min: [0, 'Delay penalty cannot be negative.'],
    },
    minimumBulkOrderQuintal: {
      type: Number,
      default: 10,
      min: [0, 'Minimum bulk order cannot be negative.'],
    },
    aiPriceSuggestionEnabled: {
      type: Boolean,
      default: true,
    },
    routeOptimizationEnabled: {
      type: Boolean,
      default: true,
    },
    docaApiSyncInterval: {
      type: String,
      enum: {
        values: ['Hourly', 'Daily', 'Realtime'],
        message: '{VALUE} is not a valid DOCA API sync interval.',
      },
      default: 'Daily',
    },
    supportEmail: {
      type: String,
      default: 'support@krishi.gov.in',
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid support email address.',
      ],
    },
  },
  { timestamps: true }
);

export default mongoose.model('PlatformSetting', platformSettingSchema);
