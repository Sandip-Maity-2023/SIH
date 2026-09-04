
const CropLot = require('../models/Crop');

const formatCrop = (crop) => {
  const obj = crop.toObject ? crop.toObject() : crop;
  const address = obj.pickupLocation?.farmAddress || '';
  const farmerAddress = obj.farmerId?.location?.address || {};

  return {
    ...obj,
    cropType: obj.cropName,
    pricePerKg: obj.expectedPricePerKg,
    qualityGrade: obj.aiQualityGrade?.grade,
    farmer: obj.farmerId,
    location: {
      district: farmerAddress.district || address.split(',').pop()?.trim() || '',
      state: farmerAddress.state || 'Maharashtra',
      address,
    },
    isOrganic: obj.category === 'VEGETABLE' && obj.aiQualityGrade?.grade === 'A',
    shelfLifeDays: obj.category === 'FRUIT' ? 7 : 12,
  };
};

// @desc    Create a new crop listing (Farmer / FPO)
// @route   POST /api/crops
exports.createCropLot = async (req, res) => {
  try {
    const { cropName, cropType, category, quantityKg, expectedPricePerKg, pricePerKg, harvestDate, images, pickupLocation, location, voiceNoteUrl, fpoId } = req.body;
    const userAddress = req.user.location?.address || {};
    const normalizedLocation = pickupLocation || {
      type: 'Point',
      coordinates: req.user.location?.coordinates || [73.7898, 20.0063],
      farmAddress: location?.address || [userAddress.villageOrCity, userAddress.district, userAddress.state].filter(Boolean).join(', '),
    };

    const cropLot = await CropLot.create({
      farmerId: req.user.id,
      fpoId: fpoId || undefined,
      cropName: cropName || cropType,
      category,
      quantityKg,
      expectedPricePerKg: expectedPricePerKg || pricePerKg,
      harvestDate: harvestDate || new Date(),
      images,
      pickupLocation: normalizedLocation,
      voiceNoteUrl,
    });

    res.status(201).json({ success: true, data: formatCrop(cropLot), crop: formatCrop(cropLot) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all available crop listings with optional filters & spatial search
// @route   GET /api/crops
exports.getCropLots = async (req, res) => {
  try {
    const { category, grade, isPooled, longitude, latitude, radiusKm } = req.query;
    let query = { status: 'AVAILABLE' };

    if (category) query.category = category;
    if (grade) query['aiQualityGrade.grade'] = grade;
    if (isPooled === 'true' || isPooled === true) query.fpoId = { $exists: true };
    if (isPooled === 'false' || isPooled === false) query.status = 'AVAILABLE';

    // Nearby location filter if coordinates provided
    if (longitude && latitude) {
      const radiusInMeters = (radiusKm || 50) * 1000;
      query.pickupLocation = {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(longitude), parseFloat(latitude)] },
          $maxDistance: radiusInMeters,
        },
      };
    }

    const crops = await CropLot.find(query)
      .populate('farmerId', 'name phone location')
      .populate('fpoId', 'name fpoDetails')
      .sort({ createdAt: -1 });

    const formattedCrops = crops.map(formatCrop);

    res.status(200).json({
      success: true,
      count: formattedCrops.length,
      data: formattedCrops,
      crops: formattedCrops,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single crop lot details
// @route   GET /api/crops/:id
exports.getCropLotById = async (req, res) => {
  try {
    const crop = await CropLot.findById(req.params.id)
      .populate('farmerId', 'name phone location')
      .populate('fpoId', 'name fpoDetails');

    if (!crop) {
      return res.status(404).json({ success: false, message: 'Crop lot not found' });
    }

    res.status(200).json({ success: true, data: formatCrop(crop), crop: formatCrop(crop) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Pool multiple crop lots into an FPO collection
// @route   PUT /api/crops/pool
exports.poolCropLots = async (req, res) => {
  try {
    const { cropLotIds, lotIds, fpoId } = req.body;
    const idsToPool = cropLotIds || lotIds || [];

    await CropLot.updateMany(
      { _id: { $in: idsToPool } },
      { $set: { ...(fpoId ? { fpoId } : {}), status: 'POOLED' } }
    );

    res.status(200).json({ success: true, message: 'Crop lots successfully pooled under FPO' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.placeBid = async (req, res) => {
  try {
    const { bidAmountPerKg, quantityKg, message } = req.body;
    const crop = await CropLot.findById(req.params.id);

    if (!crop) {
      return res.status(404).json({ success: false, message: 'Crop lot not found' });
    }

    if (!['AVAILABLE', 'POOLED'].includes(crop.status)) {
      return res.status(400).json({ success: false, message: 'Crop lot is not open for bidding' });
    }

    const bid = {
      buyerId: req.user.id,
      bidAmountPerKg,
      quantityKg: quantityKg || crop.quantityKg,
      message,
      status: 'PENDING',
    };

    crop.bids.push(bid);
    await crop.save();
    await crop.populate('bids.buyerId', 'name phone role');

    const savedBid = crop.bids[crop.bids.length - 1];
    const io = req.app.get('io');
    if (io) {
      io.to(`auction_${crop._id}`).emit('newBidReceived', {
        cropLotId: crop._id,
        bid: savedBid,
      });
    }

    res.status(201).json({ success: true, data: savedBid, bid: savedBid });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateBidStatus = async (req, res) => {
  try {
    const { status, counterAmountPerKg } = req.body;
    const crop = await CropLot.findById(req.params.cropId);

    if (!crop) {
      return res.status(404).json({ success: false, message: 'Crop lot not found' });
    }

    if (crop.farmerId.toString() !== req.user.id && crop.fpoId?.toString() !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Only the farmer or FPO can manage bids for this lot' });
    }

    const bid = crop.bids.id(req.params.bidId);
    if (!bid) {
      return res.status(404).json({ success: false, message: 'Bid not found' });
    }

    bid.status = status;
    if (counterAmountPerKg) bid.counterAmountPerKg = counterAmountPerKg;

    if (status === 'ACCEPTED') {
      crop.status = 'LOCKED_IN_ORDER';
      crop.bids.forEach((item) => {
        if (item._id.toString() !== bid._id.toString() && item.status === 'PENDING') {
          item.status = 'REJECTED';
        }
      });
    }

    await crop.save();

    const io = req.app.get('io');
    if (io) {
      io.to(`auction_${crop._id}`).emit('bidStatusUpdated', {
        cropLotId: crop._id,
        bid,
      });
    }

    res.status(200).json({ success: true, data: bid, bid });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
