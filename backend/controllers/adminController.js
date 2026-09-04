import User from '../models/User.js';
import Produce from '../models/Produce.js';
import Order from '../models/Order.js';
import Dispute from '../models/Dispute.js';
import PlatformSetting from '../models/PlatformSetting.js';
import Vehicle from '../models/Vehicle.js';

// @desc    Get overall system analytics & metrics
// @route   GET /api/admin/analytics
// @access  Private/Admin
export const getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    // Role strings updated to match lower-case user schema standard
    const farmersCount = await User.countDocuments({ role: 'farmer' });
    const buyersCount = await User.countDocuments({ role: 'buyer' });
    const driverCount = await User.countDocuments({ role: 'logistics' });

    const totalProduceListings = await Produce.countDocuments();
    const activeProduceListings = await Produce.countDocuments({ isAvailable: true });

    // Dispute statuses updated to match system constants
    const openDisputes = await Dispute.countDocuments({
      status: { $in: ['OPEN', 'UNDER_REVIEW','RESOLVED_REFUNDED','REJECTED'] },
    });

    // Calculate total platform order revenue using corrected orderStatus field
    const revenueData = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'CANCELLED' } } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } },
    ]);

    const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    res.status(200).json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          farmers: farmersCount,
          buyers: buyersCount,
          drivers: driverCount,
        },
        produce: {
          total: totalProduceListings,
          active: activeProduceListings,
        },
        disputes: {
          open: openDisputes,
        },
        revenue: {
          total: totalRevenue,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get pending KYC verifications
// @route   GET /api/admin/kyc/pending
// @access  Private/Admin
export const getPendingKycUsers = async (req, res) => {
  try {
    const pendingUsers = await User.find({ kycVerified: false }).select('-password');
    res.status(200).json({ success: true, count: pendingUsers.length, data: pendingUsers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Verify or reject user KYC
// @route   PUT /api/admin/kyc/verify/:userId
// @access  Private/Admin
export const verifyUserKyc = async (req, res) => {
  try {
    const { status, remarks } = req.body; // status: 'VERIFIED' or 'REJECTED'

    if (!['VERIFIED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid verification status' });
    }

    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.kycVerified = status === 'VERIFIED';
    user.kycRemarks = remarks || '';
    user.kycVerifiedAt = new Date();

    await user.save();

    res.status(200).json({ success: true, message: `User KYC updated to ${status}`, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get platform settings
// @route   GET /api/admin/settings
// @access  Private/Admin
export const getSettings = async (req, res) => {
  try {
    const settings = await PlatformSetting.findOneAndUpdate(
      { key: 'default' },
      { $setOnInsert: { key: 'default' } },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update platform settings
// @route   PUT /api/admin/settings
// @access  Private/Admin
export const updateSettings = async (req, res) => {
  try {
    const allowedFields = [
      'platformCommissionPercent',
      'logisticsCostPerKm',
      'minimumLogisticsFee',
      'paymentGatewayFeePercent',
      'spoilageDelayPenaltyEnabled',
      'spoilageDelayPenaltyPerHour',
      'minimumBulkOrderQuintal',
      'aiPriceSuggestionEnabled',
      'routeOptimizationEnabled',
      'docaApiSyncInterval',
      'supportEmail',
    ];

    const updates = allowedFields.reduce((acc, field) => {
      if (req.body[field] !== undefined) acc[field] = req.body[field];
      return acc;
    }, {});

    const settings = await PlatformSetting.findOneAndUpdate(
      { key: 'default' },
      { $set: updates },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};