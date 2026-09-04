const axios = require('axios');

const VRP_SERVICE_URL = process.env.VRP_OPTIMIZER_SERVICE_URL || 'http://127.0.0.1:8000/optimize-route';

/**
 * Sends pickup locations, vehicle capacity, and depot coordinates to the VRP engine.
 * @param {Object} routeData - Contains vehicles, pickups, depot, and capacity constraints.
 * @returns {Promise<Object>} Optimized route, total distance, and sequence of stops.
 */
const solveVRP = async (routeData) => {
  try {
    const response = await axios.post(VRP_SERVICE_URL, {
      depot: routeData.depot,               // { lat: Number, lng: Number }
      pickups: routeData.pickups,           // [{ id, lat, lng, weight }]
      vehicles: routeData.vehicles || [],   // [{ id, capacity }]
      max_distance_km: routeData.maxDistance || 500,
    }, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 10000,
    });

    return response.data;
  } catch (error) {
    console.error('VRP Service Optimization Error:', error.response?.data || error.message);
    
    // Fallback: If external VRP service is unreachable, return a basic sequential route
    return fallbackSequentialRoute(routeData);
  }
};

/**
 * Fallback route builder if external solver is offline
 */
const fallbackSequentialRoute = (routeData) => {
  const stops = (routeData.pickups || []).map((pickup, index) => ({
    sequence: index + 1,
    pickupId: pickup.id,
    coordinates: { lat: pickup.lat, lng: pickup.lng },
    weight: pickup.weight || 0,
  }));

  return {
    isFallback: true,
    totalDistanceKm: 0,
    optimizedStops: stops,
    message: 'Calculated using fallback sequential routing solver.',
  };
};

module.exports = {
  solveVRP,
};