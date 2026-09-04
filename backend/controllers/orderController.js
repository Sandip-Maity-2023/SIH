
const Order = require('../models/Order');
const CropLot = require('../models/Crop');

// @desc    Place a new B2B/Bulk purchase order with Escrow locking
// @route   POST /api/orders
exports.createOrder = async (req, res) => {
  try {
    const { items, deliveryAddress, totalAmount, transactionReference } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No items provided in order' });
    }

    // 1. Verify availability and lock crop lots
    const cropLotIds = items.map((item) => item.cropLotId);
    const availableCrops = await CropLot.find({ _id: { $in: cropLotIds }, status: { $in: ['AVAILABLE', 'POOLED'] } });

    if (availableCrops.length !== cropLotIds.length) {
      return res.status(400).json({ success: false, message: 'One or more crop lots are no longer available' });
    }

    // 2. Create Order in Pending/Escrow Locked status
    const order = await Order.create({
      buyerId: req.user.id,
      items,
      totalAmount,
      deliveryAddress,
      paymentDetails: {
        escrowStatus: 'LOCKED_IN_ESCROW',
        transactionReference,
        paidAt: new Date(),
      },
      orderStatus: 'PLACED',
    });

    // 3. Update status of ordered crop lots to LOCKED_IN_ORDER
    await CropLot.updateMany(
      { _id: { $in: cropLotIds } },
      { $set: { status: 'LOCKED_IN_ORDER' } }
    );

    res.status(201).json({ success: true, data: order, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get orders for current logged-in user (Buyer or Farmer)
// @route   GET /api/orders
exports.getUserOrders = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'BUYER') {
      query.buyerId = req.user.id;
    } else if (req.user.role === 'FARMER') {
      query['items.farmerId'] = req.user.id;
    }

    const orders = await Order.find(query)
      .populate('buyerId', 'name phone')
      .populate('items.cropLotId')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: orders.length, data: orders, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Release Escrow funds to farmer upon verified delivery
// @route   PUT /api/orders/:id/release-escrow
exports.releaseEscrow = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (!['DELIVERED', 'LOGISTICS_ASSIGNED', 'IN_TRANSIT', 'PLACED', 'CONFIRMED'].includes(order.orderStatus)) {
      return res.status(400).json({ success: false, message: 'Order is not eligible for escrow release' });
    }

    order.orderStatus = 'DELIVERED';
    order.paymentDetails.escrowStatus = 'RELEASED_TO_FARMER';
    await order.save();

    // Mark crop lots as completely SOLD
    const cropLotIds = order.items.map((item) => item.cropLotId);
    await CropLot.updateMany({ _id: { $in: cropLotIds } }, { $set: { status: 'SOLD' } });

    res.status(200).json({ success: true, message: 'Escrow payment released to farmers successfully', data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
