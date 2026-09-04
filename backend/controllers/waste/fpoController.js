
const PoolConsignment = require('../models/PoolConsignment');
const Crop = require('../models/Crop');
const logger = require('../../utils/logger');

/**
 * @desc    Pool multiple individual farmer crop lots into a single FPO bulk consignment
 * @route   POST /api/fpo/pool
 * @access  Private (FPO / Admin)
 */
exports.poolCropLots = async (req, res, next) => {
  try {
    const { cropIds, destination, pricePerKg, notes } = req.body;

    if (!cropIds || !Array.isArray(cropIds) || cropIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of crop IDs to pool.',
      });
    }

    // Fetch crops to verify existence and check if already pooled
    const crops = await Crop.find({ _id: { $in: cropIds } });

    if (crops.length !== cropIds.length) {
      return res.status(404).json({
        success: false,
        message: 'One or more specified crop lots were not found.',
      });
    }

    // Calculate total quantity and aggregate crop details
    const totalQuantity = crops.reduce((sum, crop) => sum + (crop.quantity || 0), 0);
    const cropType = crops[0].cropType || 'Aggregated Yield';

    // Create pooled consignment
    const consignment = await PoolConsignment.create({
      fpoId: req.user.id,
      cropType,
      crops: cropIds,
      totalQuantity,
      pricePerKg: pricePerKg || crops[0].pricePerKg,
      destination,
      notes,
      status: 'ready_for_pickup',
    });

    // Update status of individual crop lots to reflect pooling
    await Crop.updateMany(
      { _id: { $in: cropIds } },
      { $set: { status: 'pooled', consignmentId: consignment._id } }
    );

    logger.info(`Pooled consignment created: ${consignment._id} with ${cropIds.length} lots.`);

    res.status(201).json({
      success: true,
      message: 'Crop lots successfully pooled into consignment.',
      data: consignment,
    });
  } catch (error) {
    logger.error('Error in poolCropLots controller:', error.message);
    next(error);
  }
};

/**
 * @desc    Get all pooled consignments managed by the authenticated FPO
 * @route   GET /api/fpo/consignments
 * @access  Private (FPO / Farmer / Admin)
 */
exports.getPooledConsignments = async (req, res, next) => {
  try {
    const filter = req.user.role === 'fpo' ? { fpoId: req.user.id } : {};

    const consignments = await PoolConsignment.find(filter)
      .populate('crops')
      .populate('fpoId', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: consignments.length,
      data: consignments,
    });
  } catch (error) {
    logger.error('Error in getPooledConsignments controller:', error.message);
    next(error);
  }
};

/**
 * @desc    Get specific pooled consignment details by ID
 * @route   GET /api/fpo/consignments/:id
 * @access  Private
 */
exports.getConsignmentById = async (req, res, next) => {
  try {
    const consignment = await PoolConsignment.findById(req.params.id)
      .populate({
        path: 'crops',
        populate: { path: 'farmerId', select: 'name phone location' },
      })
      .populate('fpoId', 'name email phone');

    if (!consignment) {
      return res.status(404).json({
        success: false,
        message: 'Consignment not found.',
      });
    }

    res.status(200).json({
      success: true,
      data: consignment,
    });
  } catch (error) {
    logger.error('Error in getConsignmentById controller:', error.message);
    next(error);
  }
};

/**
 * @desc    Update consignment status
 * @route   PATCH /api/fpo/consignments/:id/status
 * @access  Private (FPO / Admin)
 */
exports.updateConsignmentStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const consignment = await PoolConsignment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!consignment) {
      return res.status(404).json({
        success: false,
        message: 'Consignment not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Consignment status updated successfully.',
      data: consignment,
    });
  } catch (error) {
    logger.error('Error in updateConsignmentStatus controller:', error.message);
    next(error);
  }
};