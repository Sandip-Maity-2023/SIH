import Dispute from '../models/Dispute.js';
import Order from '../models/Order.js';

// @desc    Raise a new quality or delivery dispute
// @route   POST /api/disputes
// @access  Private
export const createDispute = async (req, res) => {
  try {
    const { orderId, targetUser, reason, description, evidenceImages, claimedAmount } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Associated order not found' });
    }

    const dispute = await Dispute.create({
      orderId,
      raisedBy: req.user.id,
      targetUser,
      reason,
      description,
      evidenceImages: evidenceImages || [],
      claimedAmount,
    });

    res.status(201).json({ success: true, data: dispute });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all disputes (Filtered by user or admin access)
// @route   GET /api/disputes
// @access  Private
export const getDisputes = async (req, res) => {
  try {
    let query = {};

    // Non-admin users see only disputes raised by or targeting them
    if (req.user.role !== 'ADMIN') {
      query = {
        $or: [{ raisedBy: req.user.id }, { targetUser: req.user.id }],
      };
    }

    const disputes = await Dispute.find(query)
      .populate('orderId', 'totalAmount status')
      .populate('raisedBy', 'name phone role')
      .populate('targetUser', 'name phone role')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: disputes.length, data: disputes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Resolve dispute & process refund details
// @route   PUT /api/disputes/:id/resolve
// @access  Private/Admin
export const resolveDispute = async (req, res) => {
  try {
    const { status, refundAmount, resolutionNotes } = req.body;

    const dispute = await Dispute.findById(req.params.id);
    if (!dispute) {
      return res.status(404).json({ success: false, message: 'Dispute record not found' });
    }

    dispute.status = status || dispute.status;
    dispute.refundAmount = refundAmount !== undefined ? refundAmount : dispute.refundAmount;
    dispute.resolutionNotes = resolutionNotes || dispute.resolutionNotes;
    dispute.resolvedBy = req.user.id;
    dispute.resolvedAt = new Date();

    await dispute.save();

    res.status(200).json({ success: true, message: 'Dispute updated successfully', data: dispute });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};