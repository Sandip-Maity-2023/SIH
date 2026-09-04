/**
 * Calculates Haversine distance between two sets of [longitude, latitude] coordinates in Kilometers.
 */
const calculateHaversineDistance = (coords1, coords2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const [lon1, lat1] = coords1;
  const [lon2, lat2] = coords2;

  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in KM
};

/**
 * Optimizes pickup waypoints using a Nearest-Neighbor TSP approximation.
 * @param {Array} waypoints - Array of objects containing location coordinates: { id, coordinates: [lng, lat], address }
 * @param {Array} startLocation - Starting coordinates of driver [longitude, latitude]
 * @returns {Object} Optimized waypoints, total distance, and estimated duration
 */
const optimizePickupRoute = (waypoints = [], startLocation = [73.7898, 20.0063]) => {
  if (!waypoints || waypoints.length === 0) {
    return { optimizedWaypoints: [], totalDistanceKm: 0, estimatedDurationMinutes: 0 };
  }

  const unvisited = [...waypoints];
  const optimizedWaypoints = [];
  let currentCoords = startLocation;
  let totalDistanceKm = 0;

  while (unvisited.length > 0) {
    let nearestIndex = 0;
    let shortestDistance = Infinity;

    for (let i = 0; i < unvisited.length; i++) {
      const dist = calculateHaversineDistance(
        currentCoords,
        unvisited[i].location?.coordinates || unvisited[i].coordinates
      );
      if (dist < shortestDistance) {
        shortestDistance = dist;
        nearestIndex = i;
      }
    }

    const nextPoint = unvisited.splice(nearestIndex, 1)[0];
    totalDistanceKm += shortestDistance;
    currentCoords = nextPoint.location?.coordinates || nextPoint.coordinates;

    optimizedWaypoints.push({
      ...nextPoint,
      sequenceOrder: optimizedWaypoints.length + 1,
      distanceFromPreviousKm: Number(shortestDistance.toFixed(2)),
    });
  }

  // Assume average rural transit speed of 30 km/h + 15 mins pickup time per waypoint
  const estimatedTravelHours = totalDistanceKm / 30;
  const estimatedDurationMinutes = Math.round(estimatedTravelHours * 60 + waypoints.length * 15);

  return {
    optimizedWaypoints,
    totalDistanceKm: Number(totalDistanceKm.toFixed(2)),
    estimatedDurationMinutes,
  };
};

export {
  calculateHaversineDistance,
  optimizePickupRoute,
};

export default optimizePickupRoute;
