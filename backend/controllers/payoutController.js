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

// @desc    Request bank transfer withdrawal (Farmer, Driver, FPO)
// @route   POST /api/payouts/request
// @access  Private (Farmer, Driver, FPO, Admin)
export const requestBankTransfer = async (req, res) => {
  try {
    const { amount, transferMethod = 'Direct Bank Transfer', bankDetails } = req.body;
    const requestedAmount = Number(amount || 0);

    if (requestedAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Transfer amount must be greater than zero' });
    }

    const payout = await Payout.create({
      farmerId: req.user.id,
      amount: requestedAmount,
      payoutMethod: transferMethod,
      paymentDetails: bankDetails || req.user.bankDetails || {},
      status: 'INITIATED',
      transactionReference: `WITHDRAW-${Date.now()}`,
    });

    res.status(201).json({
      success: true,
      message: 'Bank transfer request submitted successfully. Processing with bank server.',
      data: payout,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};