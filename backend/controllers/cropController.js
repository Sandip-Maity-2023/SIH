
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
    const { cropName, category, quantityKg, expectedPricePerKg, harvestDate, images, pickupLocation, voiceNoteUrl, fpoId } = req.body;

    const cropLot = await CropLot.create({
      farmerId: req.user.id,
      fpoId: fpoId || undefined,
      cropName,
      category,
      quantityKg,
      expectedPricePerKg,
      harvestDate,
      images,
      pickupLocation,
      voiceNoteUrl,
    });

    res.status(201).json({ success: true, data: cropLot });
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
