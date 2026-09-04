import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import dotenv from 'dotenv';
import passport from 'passport';
import { Server } from 'socket.io';

import connectDB from './config/db.js';
import errorHandler from './middleware/errorHandler.js';
import setupTrackingSocket from './socket/trackingSocket.js';
import configurePassport from './config/passport.js';
import logger from './utils/logger.js';
import seedDemoData from './utils/seedDemoData.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import produceRoutes from './routes/produceRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import logisticsRoutes from './routes/logisticsRoutes.js';
import disputeRoutes from './routes/disputeRoutes.js';
import payoutRoutes from './routes/payoutRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

// Load environment variables
dotenv.config();

// ES Module dirname resolution
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

// 1. Initialize Socket.io Server & Setup Tracking Sockets
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

setupTrackingSocket(io);

// Attach WebSockets instance to Express app for access in controllers via req.app.get('io')
app.set('io', io);

// 2. HTTP CORS & Express Parsing Middlewares (500MB limit to eliminate PayloadTooLarge errors completely)
app.use(cors());
app.use(express.json({ limit: '500mb', parameterLimit: 1000000 }));
app.use(express.urlencoded({ limit: '500mb', extended: true, parameterLimit: 1000000 }));

// Body parser error middleware handler
app.use((err, req, res, next) => {
  if (err.type === 'entity.too.large' || err.status === 413) {
    return res.status(413).json({
      success: false,
      message: 'Uploaded payload is too large. Processing upload...',
    });
  }
  next(err);
});

// 3. Initialize Passport Authentication
app.use(passport.initialize());
configurePassport(passport);

// 4. Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 5. Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/produce', produceRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/logistics', logisticsRoutes);
app.use('/api/disputes', disputeRoutes);
app.use('/api/payouts', payoutRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);

// 6. Central Error Handler Middleware (Must be registered after routes)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    logger.error(
      `Port ${PORT} is already in use. Stop the existing backend server or set a different PORT in backend/.env.`
    );
    process.exit(1);
  }

  logger.error('Server failed to start:', error.message);
  process.exit(1);
});

const startServer = async () => {
  await connectDB();

  if (process.env.NODE_ENV !== 'production') {
    try {
      await seedDemoData();
    } catch (err) {
      logger.warn(`Seed data execution failed: ${err.message}`);
    }
  }

  server.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
};

startServer().catch((error) => {
  logger.error('Server startup failed:', error.message);
  process.exit(1);
});
