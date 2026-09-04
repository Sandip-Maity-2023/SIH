import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    cropLotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Produce', // Aligned with the project's Produce model
      required: [true, 'Crop lot reference is required.'],
    },
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Farmer reference is required.'],
    },
    quantityKg: {
      type: Number,
      required: [true, 'Quantity in KG is required.'],
      min: [0.1, 'Quantity must be at least 0.1 kg.'],
    },
    pricePerKg: {
      type: Number,
      required: [true, 'Price per KG is required.'],
      min: [0, 'Price cannot be negative.'],
    },
    subtotal: {
      type: Number,
      required: [true, 'Subtotal is required.'],
      min: [0, 'Subtotal cannot be negative.'],
    },
  },
  { _id: true }
);

const orderSchema = new mongoose.Schema(
  {
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Buyer reference is required.'],
      index: true,
    },
    // Array of crop lots aggregated inside this single order
    items: {
      type: [orderItemSchema],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: 'An order must contain at least one item.',
      },
    },
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required.'],
      min: [0, 'Total amount cannot be negative.'],
    },
    platformFee: {
      type: Number,
      default: 0,
    },
    logisticsFee: {
      type: Number,
      default: 0,
    },
    deliveryAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      district: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      location: {
        type: {
          type: String,
          enum: ['Point'],
          default: 'Point',
        },
        coordinates: {
          type: [Number], // [longitude, latitude]
          required: true,
        },
      },
    },

    // Escrow payment model fields
    paymentDetails: {
      paymentGatewayOrderId: { type: String, default: null },
      escrowStatus: {
        type: String,
        enum: ['PENDING', 'LOCKED_IN_ESCROW', 'RELEASED_TO_FARMER', 'REFUNDED'],
        default: 'PENDING',
      },
      transactionReference: { type: String, default: null },
      paidAt: { type: Date, default: null },
    },

    orderStatus: {
      type: String,
      enum: [
        'PENDING_PAYMENT',
        'ESCROW_HOLD',
        'DISPATCHED',
        'DELIVERED',
        'DISPUTED',
        'COMPLETED',
        'CANCELLED',
      ],
      default: 'PENDING_PAYMENT',
    },

    logisticsTripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      default: null,
    },
  },
  { timestamps: true }
);

// Indexes
orderSchema.index({ buyerId: 1, orderStatus: 1 });
orderSchema.index({ 'items.farmerId': 1 });
orderSchema.index({ 'deliveryAddress.location': '2dsphere' });

export default mongoose.model('Order', orderSchema);