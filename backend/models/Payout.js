import mongoose from 'mongoose';

const payoutSchema = new mongoose.Schema(
  {
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    amount: {
      type: Number,
      required: [true, 'Payout amount is required'],
      min: [0, 'Amount cannot be negative'],
    },
    currency: {
      type: String,
      default: 'INR',
    },
    payoutMethod: {
      type: String,
      enum: ['UPI', 'BANK_TRANSFER', 'WALLET'],
      required: true,
    },
    paymentDetails: {
      upiId: String,
      accountNumber: String,
      ifscCode: String,
      bankName: String,
    },
    transactionReference: {
      type: String, // Bank UTR or Gateway Transaction ID
      unique: true,
      sparse: true,
    },
    status: {
      type: String,
      enum: ['INITIATED', 'PROCESSING', 'COMPLETED', 'FAILED', 'HELD_IN_ESCROW'],
      default: 'HELD_IN_ESCROW',
    },
    failureReason: String,
    processedAt: Date,
  },
  { timestamps: true }
);

payoutSchema.index({ farmerId: 1, status: 1 });

export default mongoose.model('Payout', payoutSchema);
