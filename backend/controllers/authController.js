
// const User = require('../models/User');
// const jwt = require('jsonwebtoken');

// // Helper to generate JWT Token
// const generateToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET , {          
//     expiresIn: '30d',
//   });
// };

// //|| 'sih_secret_key_123'

// const normalizeLocation = (location = {}) => {
//   if (Array.isArray(location.coordinates) && location.coordinates.length === 2) {
//     return location;
//   }

//   return {
//     type: 'Point',
//     coordinates: [Number(location.longitude) || 73.7898, Number(location.latitude) || 20.0063],
//     address: {
//       villageOrCity: location.villageOrCity || location.city || '',
//       district: location.district || '',
//       state: location.state || '',
//       pincode: location.pincode || '',
//     },
//   };
// };

// const buildUserPayload = (user) => ({
//     _id: user._id,
//     name: user.name,
//     phone: user.phone,
//     email: user.email,
//     role: user.role,
//     location: user.location,
//     token: generateToken(user._id),
// });

// // @desc    Register a new user (Farmer, Buyer, FPO, Driver)
// // @route   POST /api/auth/register
// exports.registerUser = async (req, res) => {
//   try {
//     const { name, phone, email, role, languagePreference, location, fpoDetails, driverDetails } = req.body;

//     const userExists = await User.findOne({ phone });
//     if (userExists) {
//       return res.status(400).json({ success: false, message: 'User with this phone number already exists' });
//     }

//     const user = await User.create({
//       name,
//       phone,
//       email,
//       role: role || 'FARMER',
//       languagePreference: languagePreference || 'hi',
//       location: normalizeLocation(location),
//       fpoDetails: role === 'FPO' ? fpoDetails : undefined,
//       driverDetails: role === 'DRIVER' ? driverDetails : undefined,
//     });

//     res.status(201).json({
//       success: true,
//       data: buildUserPayload(user),
//       user: buildUserPayload(user),
//       token: generateToken(user._id),
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // @desc    Login user via phone number
// // @route   POST /api/auth/login
// exports.loginUser = async (req, res) => {
//   try {
//     const { phone } = req.body;

//     const user = await User.findOne({ phone });
//     if (!user) {
//       return res.status(404).json({ success: false, message: 'User not found. Please register first.' });
//     }

//     res.status(200).json({
//       success: true,
//       data: buildUserPayload(user),
//       user: buildUserPayload(user),
//       token: generateToken(user._id),
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // @desc    Get user profile
// // @route   GET /api/auth/profile
// exports.getUserProfile = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select('-kycDocuments.aadhaarHash');
//     if (!user) {
//       return res.status(404).json({ success: false, message: 'User not found' });
//     }
//     res.status(200).json({ success: true, data: user });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Helper to generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

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
  fullName: user.name,
  phone: user.phone || user.phoneNumber,
  phoneNumber: user.phoneNumber || user.phone,
  email: user.email,
  role: user.role,
  location: user.location,
  avatarUrl: user.avatarUrl || '',
  bankDetails: user.bankDetails || {},
  documents: user.documents || [],
  kycVerified: user.kycVerified || false,
  token: generateToken(user._id),
});

// @desc    Register a new user (Farmer, Buyer, FPO, Driver)
// @route   POST /api/auth/register
export const registerUser = async (req, res) => {
  try {
    const { name, phone, phoneNumber, email, password, role, languagePreference, location, fpoDetails, driverDetails } = req.body;
    const targetPhone = phone || phoneNumber;

    if (!targetPhone) {
      return res.status(400).json({ success: false, message: 'Phone number is required' });
    }

    const userExists = await User.findOne({
      $or: [{ phone: targetPhone }, { phoneNumber: targetPhone }],
    });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User with this phone number already exists' });
    }

    const normalizedRole = (role || 'FARMER').toUpperCase();

    const user = await User.create({
      name,
      phone: targetPhone,
      phoneNumber: targetPhone,
      email: email || undefined,
      password: password || undefined,
      role: normalizedRole,
      languagePreference: languagePreference || 'hi',
      location: normalizeLocation(location),
      fpoDetails: normalizedRole === 'FPO' ? fpoDetails : undefined,
      driverDetails: normalizedRole === 'DRIVER' || normalizedRole === 'LOGISTICS' ? driverDetails : undefined,
      documents: req.body.documents || (req.body.kycDocument ? [req.body.kycDocument] : []),
      kycVerified: Boolean((req.body.documents && req.body.documents.length) || req.body.kycDocument),
    });

    const payload = buildUserPayload(user);

    res.status(201).json({
      success: true,
      data: payload,
      user: payload,
      token: payload.token,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Login user via phone number or email and optional password
// @route   POST /api/auth/login
export const loginUser = async (req, res) => {
  try {
    const { phone, phoneNumber, email, password } = req.body;
    const targetPhone = phone || phoneNumber;

    let query = {};
    if (targetPhone) {
      query = { $or: [{ phone: targetPhone }, { phoneNumber: targetPhone }] };
    } else if (email) {
      query = { email: email.toLowerCase() };
    } else {
      return res.status(400).json({ success: false, message: 'Phone number or email is required for login' });
    }

    const user = await User.findOne(query);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found. Please register first.' });
    }

    if (password && user.password) {
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
    }

    const payload = buildUserPayload(user);

    res.status(200).json({
      success: true,
      data: payload,
      user: payload,
      token: payload.token,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-kycDocuments.aadhaarHash');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const payload = buildUserPayload(user);
    res.status(200).json({ success: true, data: user, user: payload });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
export const updateUserProfile = async (req, res) => {
  try {
    const { name, fullName, phone, email, languagePreference, location, avatarUrl, bankDetails, documents } = req.body;

    const updates = {
      ...(name || fullName ? { name: name || fullName } : {}),
      ...(phone ? { phone, phoneNumber: phone } : {}),
      ...(email ? { email } : {}),
      ...(languagePreference ? { languagePreference } : {}),
      ...(location ? { location: normalizeLocation(location) } : {}),
      ...(avatarUrl !== undefined ? { avatarUrl } : {}),
      ...(bankDetails ? { bankDetails } : {}),
      ...(documents ? { documents } : {}),
    };

    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true,
    }).select('-kycDocuments.aadhaarHash');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const payload = buildUserPayload(user);
    return res.status(200).json({ success: true, data: user, user: payload });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};