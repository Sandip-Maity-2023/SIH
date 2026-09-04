
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Helper to generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET , {          
    expiresIn: '30d',
  });
};

//|| 'sih_secret_key_123'

const normalizeLocation = (location = {}) => {
  if (Array.isArray(location.coordinates) && location.coordinates.length === 2) {
    return location;
  }

  return {
    type: 'Point',
    coordinates: [Number(location.longitude) || 73.7898, Number(location.latitude) || 20.0063],
    address: {
      villageOrCity: location.villageOrCity || location.city || '',
      district: location.district || '',
      state: location.state || '',
      pincode: location.pincode || '',
    },
  };
};

const buildUserPayload = (user) => ({
    _id: user._id,
    name: user.name,
    phone: user.phone,
    email: user.email,
    role: user.role,
    location: user.location,
    token: generateToken(user._id),
});

// @desc    Register a new user (Farmer, Buyer, FPO, Driver)
// @route   POST /api/auth/register
exports.registerUser = async (req, res) => {
  try {
    const { name, phone, email, role, languagePreference, location, fpoDetails, driverDetails } = req.body;

    const userExists = await User.findOne({ phone });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User with this phone number already exists' });
    }

    const user = await User.create({
      name,
      phone,
      email,
      role: role || 'FARMER',
      languagePreference: languagePreference || 'hi',
      location: normalizeLocation(location),
      fpoDetails: role === 'FPO' ? fpoDetails : undefined,
      driverDetails: role === 'DRIVER' ? driverDetails : undefined,
    });

    res.status(201).json({
      success: true,
      data: buildUserPayload(user),
      user: buildUserPayload(user),
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Login user via phone number
// @route   POST /api/auth/login
exports.loginUser = async (req, res) => {
  try {
    const { phone } = req.body;

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found. Please register first.' });
    }

    res.status(200).json({
      success: true,
      data: buildUserPayload(user),
      user: buildUserPayload(user),
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-kycDocuments.aadhaarHash');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
