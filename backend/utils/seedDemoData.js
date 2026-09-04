import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Produce from '../models/Produce.js';
import Order from '../models/Order.js';
import logger from './logger.js';

export const seedDemoData = async () => {
  try {
    const existingProduce = await Produce.countDocuments();
    if (existingProduce > 0) {
      logger.info('Database already contains produce data. Skipping seed.');
      return;
    }

    logger.info('Seeding demo produce listings...');

    // Find or create a demo farmer
    let farmer = await User.findOne({ role: 'farmer' });

    if (!farmer) {
      logger.info('No farmer user found. Creating a default demo farmer...');
      const hashedPassword = await bcrypt.hash('Farmer@123', 10);

      farmer = await User.create({
        name: 'Ramesh Patel',
        email: 'farmer.demo@example.com',
        password: hashedPassword,
        role: 'farmer',
        phoneNumber: '9876543210',
        kycVerified: true,
      });

      logger.info(`Demo farmer created: ${farmer.email}`);
    }

    const demoProduceList = [
      {
        farmerId: farmer._id,
        title: 'Organic Alphonso Mangoes',
        cropCategory: 'Fruits',
        variety: 'Alphonso',
        grade: 'A_PREMIUM',
        quantityKg: 500,
        pricePerKg: 120,
        district: 'Ratnagiri',
        state: 'Maharashtra',
        isAvailable: true,
      },
      {
        farmerId: farmer._id,
        title: 'Fresh Red Onions',
        cropCategory: 'Vegetables',
        variety: 'Nasik Red',
        grade: 'B_STANDARD',
        quantityKg: 2000,
        pricePerKg: 28,
        district: 'Nashik',
        state: 'Maharashtra',
        isAvailable: true,
      },
    ];

    await Produce.insertMany(demoProduceList);
    logger.info('Demo produce data seeded successfully!');
  } catch (error) {
    logger.error(`Error executing seed script: ${error.message}`);
  }
};

export default seedDemoData;