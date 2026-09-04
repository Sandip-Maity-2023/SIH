import Payout from '../models/Payout.js';
import User from '../models/User.js';

// @desc    Initiate a payout to a farmer
// @route   POST /api/payouts
// @access  Private/Admin
export const initiatePayout = async (req, res) => {
  try {
    const { farmerId, orderId, amount, payoutMethod, paymentDetails } = req.body;

    const farmer = await User.findById(farmerId);
    if (!farmer) {
      return res.status(404).json({ success: false, message: 'Farmer account not found' });
    }

    const payout = await Payout.create({
      farmerId,
      orderId,
      amount,
      payoutMethod,
      paymentDetails,
      status: 'INITIATED',
    });

    res.status(201).json({ success: true, data: payout });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get payout ledger history for logged in user or admin
// @route   GET /api/payouts
// @access  Private
export const getPayouts = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'FARMER') {
      query.farmerId = req.user.id;
    }

    const payouts = await Payout.find(query)
      .populate('farmerId', 'name phone')
      .populate('orderId', 'totalAmount status')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: payouts.length, data: payouts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update payout status (Completed / Failed / Processing)
// @route   PUT /api/payouts/:id/status
// @access  Private/Admin
export const updatePayoutStatus = async (req, res) => {
  try {
    const { status, transactionReference, failureReason } = req.body;

    const payout = await Payout.findById(req.params.id);
    if (!payout) {
      return res.status(404).json({ success: false, message: 'Payout record not found' });
    }

    payout.status = status || payout.status;
    if (transactionReference) payout.transactionReference = transactionReference;
    if (failureReason) payout.failureReason = failureReason;
    if (status === 'COMPLETED') payout.processedAt = new Date();

    await payout.save();

    res.status(200).json({ success: true, data: payout });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};