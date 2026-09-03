const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const initializeSocketService = require('./services/socketService');

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);

// 1. Initialize Socket.io via socketService
const io = initializeSocketService(server);

// Attach WebSockets instance to Express app so controllers can use req.app.get('io')
app.set('io', io);

// 2. HTTP CORS & Express Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Serve uploaded files (crop images, voice recordings) statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 4. Mount API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/crops', require('./routes/cropRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/logistics', require('./routes/logisticsRoutes'));

// 5. Central Error Handler Middleware (Must be registered after routes)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(
      `Port ${PORT} is already in use. Stop the existing backend server or set a different PORT in backend/.env.`
    );
    process.exit(1);
  }

  console.error('Server failed to start:', error.message);
  process.exit(1);
});

const startServer = async () => {
  await connectDB();

  if (process.env.NODE_ENV !== 'production') {
    const seedDemoData = require('./utils/seedDemoData');
    await seedDemoData();
  }

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer().catch((error) => {
  console.error('Server startup failed:', error.message);
  process.exit(1);
});
