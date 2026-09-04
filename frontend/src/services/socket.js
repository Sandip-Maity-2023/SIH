import { Server } from 'socket.io';

let io = null;

/**
 * Initializes the Socket.IO server attached to the HTTP server instance.
 */
export const initSocketServer = (server) => {
  io = new Server(server, {
    cors: {
      origin: '*', // Adjust according to frontend origin in production
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log(`[KRISHI Socket] Client connected: ${socket.id}`);

    // Join room based on User ID
    socket.on('join_user_room', (userId) => {
      socket.join(`user_${userId}`);
      console.log(`[KRISHI Socket] User ${userId} joined personal room.`);
    });

    // Join room for specific Order real-time tracking
    socket.on('join_order_room', (orderId) => {
      socket.join(`order_${orderId}`);
      console.log(`[KRISHI Socket] Socket ${socket.id} joined order room: ${orderId}`);
    });

    // Relay live GPS updates from logistics driver
    socket.on('update_location', ({ orderId, latitude, longitude }) => {
      io.to(`order_${orderId}`).emit('location_updated', {
        orderId,
        latitude,
        longitude,
        timestamp: new Date()
      });
    });

    // Handle direct buyer-farmer chat messages
    socket.on('send_message', ({ orderId, senderId, message }) => {
      io.to(`order_${orderId}`).emit('receive_message', {
        orderId,
        senderId,
        message,
        timestamp: new Date()
      });
    });

    socket.on('disconnect', () => {
      console.log(`[KRISHI Socket] Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

/**
 * Emits an event to a specific user across all their open sockets.
 */
export const sendNotificationToUser = (userId, eventName, payload) => {
  if (!io) {
    console.warn('[KRISHI Socket] Socket server not initialized.');
    return;
  }
  io.to(`user_${userId}`).emit(eventName, payload);
};

/**
 * Broadcasts order status changes to all interested parties in an order room.
 */
export const broadcastOrderStatusChange = (orderId, newStatus, trackingData = {}) => {
  if (!io) return;
  io.to(`order_${orderId}`).emit('order_status_updated', {
    orderId,
    status: newStatus,
    trackingData,
    timestamp: new Date()
  });
};
