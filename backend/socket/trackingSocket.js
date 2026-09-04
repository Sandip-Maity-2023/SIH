/**
 * Socket.IO Handler for Real-Time Logistics Tracking
 */
const setupTrackingSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    /**
     * Join a specific logistics/trip room to receive real-time updates
     */
    socket.on('joinTripRoom', (payload) => {
      const tripId = typeof payload === 'string' ? payload : payload?.tripId;
      if (tripId) {
        socket.join(tripId);
        console.log(`Socket ${socket.id} joined room: ${tripId}`);
        socket.emit('joinedRoom', { success: true, tripId });
      }
    });

    /**
     * Driver updates current GPS position
     */
    socket.on('updateLocation', ({ tripId, latitude, longitude, speed, heading }) => {
      if (!tripId || latitude === undefined || longitude === undefined) {
        return socket.emit('error', { message: 'Invalid location payload' });
      }

      const locationData = {
        tripId,
        coordinates: [longitude, latitude], // GeoJSON standard [lng, lat]
        speed: speed || 0,
        heading: heading || 0,
        timestamp: new Date().toISOString(),
      };

      // Broadcast updated location to everyone listening in the trip room
      io.to(tripId).emit('driverLocationUpdate', locationData);
    });

    /**
     * Leave trip tracking room
     */
    socket.on('leaveTripRoom', (payload) => {
      const tripId = typeof payload === 'string' ? payload : payload?.tripId;
      if (tripId) {
        socket.leave(tripId);
        console.log(`Socket ${socket.id} left room: ${tripId}`);
      }
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
};

export default setupTrackingSocket;