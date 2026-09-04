import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      sparse: true,
    },
    password: {
      type: String,
    },
    phone: {
      type: String,
      trim: true,
      sparse: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      set: (v) => (v ? String(v).toUpperCase() : 'FARMER'),
      get: (v) => (v ? String(v).toUpperCase() : 'FARMER'),
      default: 'FARMER',
    },
    languagePreference: {
      type: String,
      default: 'hi',
    },
    location: {
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
        villageOrCity: { type: String, default: '' },
        district: { type: String, default: '' },
        state: { type: String, default: '' },
        pincode: { type: String, default: '' },
      },
    },
    fpoDetails: {
      fpoName: String,
      registrationNumber: String,
      memberCount: Number,
    },
    driverDetails: {
      licenseNumber: String,
      vehicleNumber: String,
      vehicleType: String,
    },
    avatarUrl: {
      type: String,
      default: '',
    },
    bankDetails: {
      bankName: String,
      accountNumber: String,
      ifscCode: String,
      upiId: String,
    },
    documents: [
      {
        documentType: String,
        documentName: String,
        documentUrl: String,
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
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
    kycDocuments: {
      aadhaarHash: String,
      documentUrl: String,
    },
  },
  {
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true },
  }
);

// Hash password before saving if modified
userSchema.pre('save', async function () {
  if (this.phone && !this.phoneNumber) {
    this.phoneNumber = this.phone;
  }
  if (this.phoneNumber && !this.phone) {
    this.phone = this.phoneNumber;
  }

  if (!this.isModified('password') || !this.password) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return true; // If user created without password, allow phone auth
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
