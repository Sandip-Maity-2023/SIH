import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true, // Automatically creates an index on email: 1
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    role: {
      type: String,
      enum: ['farmer', 'buyer', 'logistics', 'fpo', 'admin'],
      default: 'buyer',
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    kycVerified: {
      type: Boolean,
      default: false,
    },
    kycRemarks: {
      type: String,
      default: '',
    },
    kycVerifiedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Removed redundant userSchema.index({ email: 1 }); to eliminate Mongoose startup warning

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
