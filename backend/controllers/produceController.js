import Produce from '../models/Produce.js';

// @desc    Create a new produce listing
// @route   POST /api/produce
// @access  Private (Farmer / FPO)
export const createProduce = async (req, res) => {
  try {
    const {
      cropName,
      title,
      category,
      cropCategory,
      variety,
      grade,
      quantityKg,
      quantityAvailable,
      expectedPricePerKg,
      pricePerKg,
      harvestDate,
      images,
      image,
      aiQualityGrade,
      voiceNoteUrl,
      pickupLocation,
      location,
      fpoId,
    } = req.body;

    const finalCropName = cropName || title || 'Fresh Produce';
    const finalCategory = category || cropCategory || 'VEGETABLE';
    const finalPrice = Number(expectedPricePerKg || pricePerKg || 0);
    const finalQuantity = Number(quantityKg || quantityAvailable || 0);

    const normLocation = (loc) => {
      if (loc && typeof loc === 'object' && Array.isArray(loc.coordinates) && loc.coordinates.length === 2) {
        return {
          type: 'Point',
          coordinates: [Number(loc.coordinates[0]) || 73.7898, Number(loc.coordinates[1]) || 20.0063],
          address: {
            villageOrCity: loc.farmAddress || loc.address?.villageOrCity || '',
            district: loc.district || loc.address?.district || '',
            state: loc.state || loc.address?.state || '',
            pincode: loc.pincode || loc.address?.pincode || '',
          },
        };
      }
      return {
        type: 'Point',
        coordinates: [88.2325, 22.8122],
        address: {
          villageOrCity: typeof loc === 'string' ? loc : 'Singur Farm Cluster',
          district: 'Hooghly',
          state: 'West Bengal',
          pincode: '712409',
        },
      };
    };

    const produce = await Produce.create({
      farmerId: req.user.id,
      fpoId: fpoId || undefined,
      cropName: finalCropName,
      title: finalCropName,
      category: finalCategory,
      cropCategory: finalCategory,
      variety: variety || 'Standard',
      grade: grade || 'Grade A',
      quantityKg: finalQuantity,
      pricePerKg: finalPrice,
      expectedPricePerKg: finalPrice,
      harvestDate: harvestDate ? new Date(harvestDate) : new Date(),
      images: Array.isArray(images) ? images : (image ? [image] : []),
      aiQualityGrade: typeof aiQualityGrade === 'object' ? aiQualityGrade : { grade: aiQualityGrade || grade || 'A_PREMIUM' },
      voiceNoteUrl,
      pickupLocation: normLocation(pickupLocation || location || req.user?.location),
      status: 'AVAILABLE',
      isAvailable: true,
    });

    return res.status(201).json({ success: true, data: produce });
  } catch (error) {
    console.error('Error creating produce listing:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all available produce listings (with search & filtering)
// @route   GET /api/produce
// @access  Public
export const getAllProduce = async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, status } = req.query;

    let query = {};

    if (status) {
      query.status = status;
    } else {
      query.$or = [{ status: 'AVAILABLE' }, { isAvailable: true }];
    }

    if (category && category !== 'All') {
      query.$and = query.$and || [];
      query.$and.push({
        $or: [{ category: category }, { cropCategory: category }],
      });
    }

    if (search) {
      const searchRegex = { $regex: search, $options: 'i' };
      query.$and = query.$and || [];
      query.$and.push({
        $or: [{ cropName: searchRegex }, { title: searchRegex }, { variety: searchRegex }],
      });
    }

    if (minPrice || maxPrice) {
      const priceFilter = {};
      if (minPrice) priceFilter.$gte = Number(minPrice);
      if (maxPrice) priceFilter.$lte = Number(maxPrice);

      query.$and = query.$and || [];
      query.$and.push({
        $or: [{ expectedPricePerKg: priceFilter }, { pricePerKg: priceFilter }],
      });
    }

    const produceListings = await Produce.find(query)
      .populate('farmerId', 'name phone location')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: produceListings.length, data: produceListings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single produce listing details
// @route   GET /api/produce/:id
// @access  Public
export const getProduceById = async (req, res) => {
  try {
    const produce = await Produce.findById(req.params.id)
      .populate('farmerId', 'name phone location')
      .populate('bids.buyerId', 'name phone');

    if (!produce) {
      return res.status(404).json({ success: false, message: 'Produce listing not found' });
    }

    res.status(200).json({ success: true, data: produce });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update produce listing details
// @route   PUT /api/produce/:id
// @access  Private (Farmer owner only)
export const updateProduce = async (req, res) => {
  try {
    let produce = await Produce.findById(req.params.id);

    if (!produce) {
      return res.status(404).json({ success: false, message: 'Produce listing not found' });
    }

    if (produce.farmerId.toString() !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Unauthorized to edit this listing' });
    }

    produce = await Produce.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: produce });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a produce listing
// @route   DELETE /api/produce/:id
// @access  Private (Farmer owner / Admin)
export const deleteProduce = async (req, res) => {
  try {
    const produce = await Produce.findById(req.params.id);

    if (!produce) {
      return res.status(404).json({ success: false, message: 'Produce listing not found' });
    }

    if (produce.farmerId.toString() !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Unauthorized to delete this listing' });
    }

    await produce.deleteOne();

    res.status(200).json({ success: true, message: 'Produce listing removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Submit a bid on a produce lot
// @route   POST /api/produce/:id/bids
// @access  Private (Buyer)
export const placeBid = async (req, res) => {
  try {
    const { bidAmountPerKg, quantityKg, message } = req.body;

    const produce = await Produce.findById(req.params.id);
    if (!produce) {
      return res.status(404).json({ success: false, message: 'Produce listing not found' });
    }

    if (produce.status !== 'AVAILABLE') {
      return res.status(400).json({ success: false, message: 'Bidding closed for this lot' });
    }

    const newBid = {
      buyerId: req.user.id,
      bidAmountPerKg,
      quantityKg,
      message,
    };

    produce.bids.push(newBid);
    await produce.save();

    res.status(201).json({ success: true, data: produce });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};