const CropLot = require('../models/CropLot');
const LogisticsTrip = require('../models/LogisticsTrip');
const User = require('../models/User');

const point = (longitude, latitude, address = {}) => ({
  type: 'Point',
  coordinates: [longitude, latitude],
  address,
});

const farmPoint = (longitude, latitude, farmAddress = '') => ({
  type: 'Point',
  coordinates: [longitude, latitude],
  farmAddress,
});

const upsertUser = (phone, data) =>
  User.findOneAndUpdate(
    { phone },
    { $setOnInsert: { phone, ...data } },
    { returnDocument: 'after', upsert: true, setDefaultsOnInsert: true }
  );

const seedDemoData = async () => {
  const cropCount = await CropLot.estimatedDocumentCount();
  const tripCount = await LogisticsTrip.estimatedDocumentCount();

  const farmer = await upsertUser('9999990001', {
    name: 'Ram Patil',
    email: 'farmer@agridirect.test',
    role: 'FARMER',
    languagePreference: 'mr',
    location: point(73.7898, 20.0063, {
      villageOrCity: 'Nashik',
      district: 'Nashik',
      state: 'Maharashtra',
      pincode: '422001',
    }),
  });

  const fpo = await upsertUser('9999990002', {
    name: 'Nashik Fresh FPO',
    email: 'fpo@agridirect.test',
    role: 'FPO',
    languagePreference: 'mr',
    location: point(73.8037, 20.0128, {
      villageOrCity: 'Nashik',
      district: 'Nashik',
      state: 'Maharashtra',
    }),
    fpoDetails: {
      registrationNumber: 'FPO-DEMO-001',
      memberCount: 240,
      operationalDistricts: ['Nashik', 'Pune'],
    },
  });

  const driver = await upsertUser('9999990003', {
    name: 'Suresh Driver',
    email: 'driver@agridirect.test',
    role: 'DRIVER',
    languagePreference: 'hi',
    location: point(73.8002, 20.0201, {
      villageOrCity: 'Nashik',
      district: 'Nashik',
      state: 'Maharashtra',
    }),
    driverDetails: {
      licenseNumber: 'MH15DEMO1234',
      vehicleType: 'COLD_VAN',
      vehicleCapacityKg: 1800,
      vehicleNumber: 'MH15 CD 2048',
    },
  });

  if (cropCount === 0) {
    await CropLot.insertMany([
      {
        farmerId: farmer._id,
        cropName: 'Tomato',
        category: 'VEGETABLE',
        quantityKg: 850,
        expectedPricePerKg: 28,
        harvestDate: new Date(),
        images: ['https://images.unsplash.com/photo-1546470427-e26264be0b0d?auto=format&fit=crop&w=900&q=80'],
        aiQualityGrade: { grade: 'A', confidenceScore: 0.94, defectsDetected: [], evaluatedAt: new Date() },
        pickupLocation: farmPoint(73.7898, 20.0063, 'Panchavati Farm Gate, Nashik'),
      },
      {
        farmerId: farmer._id,
        fpoId: fpo._id,
        cropName: 'Grapes',
        category: 'FRUIT',
        quantityKg: 620,
        expectedPricePerKg: 72,
        harvestDate: new Date(),
        images: ['https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=900&q=80'],
        aiQualityGrade: { grade: 'A', confidenceScore: 0.91, defectsDetected: [], evaluatedAt: new Date() },
        pickupLocation: farmPoint(73.8069, 20.0321, 'Dindori Road Collection Point'),
      },
      {
        farmerId: farmer._id,
        cropName: 'Onion',
        category: 'VEGETABLE',
        quantityKg: 1200,
        expectedPricePerKg: 22,
        harvestDate: new Date(),
        images: ['https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=900&q=80'],
        aiQualityGrade: {
          grade: 'B',
          confidenceScore: 0.87,
          defectsDetected: ['minor_size_variation'],
          evaluatedAt: new Date(),
        },
        pickupLocation: farmPoint(73.842, 20.052, 'Lasalgaon Farm Cluster'),
      },
    ]);
    console.log('Demo crop listings seeded');
  }

  if (tripCount === 0) {
    await LogisticsTrip.create({
      driverId: driver._id,
      vehicleNumber: 'MH15 CD 2048',
      optimizedWaypoints: [
        {
          stopSequence: 1,
          stopType: 'PICKUP_FARM',
          location: farmPoint(73.7898, 20.0063),
          addressText: 'Panchavati Farm Gate, Nashik',
          pickupOtp: '1234',
        },
        {
          stopSequence: 2,
          stopType: 'PICKUP_FARM',
          location: farmPoint(73.8069, 20.0321),
          addressText: 'Dindori Road Collection Point',
          pickupOtp: '2345',
        },
        {
          stopSequence: 3,
          stopType: 'DELIVERY_BUYER',
          location: farmPoint(73.8300, 20.0500),
          addressText: 'Buyer Warehouse, Nashik',
        },
      ],
      totalDistanceKm: 34.2,
      estimatedDurationMinutes: 96,
      currentLocation: {
        type: 'Point',
        coordinates: [73.7898, 20.0063],
        lastUpdatedAt: new Date(),
      },
      tripStatus: 'DISPATCHED',
    });
    console.log('Demo logistics trip seeded');
  }
};

module.exports = seedDemoData;
