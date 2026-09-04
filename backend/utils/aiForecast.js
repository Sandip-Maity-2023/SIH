/**
 * Utility functions for crop demand forecasting and inventory velocity analytics.
 */

/**
 * Predicts short-term demand trends for a given crop category and district.
 * 
 * @param {Array} historicalOrders - Array of historical completed order objects.
 * @param {String} cropCategory - Target crop category (e.g., 'Vegetables', 'Grains').
 * @param {String} district - Target delivery district.
 * @returns {Object} Forecasted demand metrics and trend rating.
 */
export const forecastCropDemand = (historicalOrders = [], cropCategory, district) => {
  // Filter orders matching criteria from the past 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const relevantOrders = historicalOrders.filter((order) => {
    const isMatchingDistrict = !district || order.deliveryAddress?.district?.toLowerCase() === district.toLowerCase();
    const isRecent = new Date(order.createdAt) >= thirtyDaysAgo;
    const isCompleted = order.orderStatus === 'COMPLETED';

    return isMatchingDistrict && isRecent && isCompleted;
  });

  // Calculate aggregate volume in Kilograms
  const totalVolumeKg = relevantOrders.reduce((acc, order) => {
    const categoryVolume = order.items
      ?.filter((item) => !cropCategory || item.cropCategory === cropCategory)
      .reduce((sum, item) => sum + item.quantityKg, 0) || 0;
    return acc + categoryVolume;
  }, 0);

  // Determine trend status based on monthly volume thresholds
  let demandTrend = 'STABLE';
  let forecastMultiplier = 1.0;

  if (totalVolumeKg > 5000) {
    demandTrend = 'HIGH_DEMAND';
    forecastMultiplier = 1.25;
  } else if (totalVolumeKg > 1500) {
    demandTrend = 'MODERATE_DEMAND';
    forecastMultiplier = 1.10;
  } else if (totalVolumeKg < 300) {
    demandTrend = 'LOW_DEMAND';
    forecastMultiplier = 0.85;
  }

  const projectedNextMonthVolume = Math.round(totalVolumeKg * forecastMultiplier);

  return {
    cropCategory: cropCategory || 'All Categories',
    district: district || 'All Districts',
    sampleSizeOrders: relevantOrders.length,
    historicalVolume30DaysKg: totalVolumeKg,
    projectedDemandNextMonthKg: projectedNextMonthVolume,
    demandTrend,
    confidenceScorePercent: Math.min(85, 50 + relevantOrders.length * 2), // Confidence scales with data size
  };
};

/**
 * Calculates estimated stock clearance time for a newly listed crop batch.
 * 
 * @param {Number} stockQuantityKg - Available crop quantity in KG.
 * @param {Number} averageDailySalesKg - Historical average daily sales velocity.
 * @returns {Object} Days to sell out estimation.
 */
export const calculateInventoryTurnoverDays = (stockQuantityKg, averageDailySalesKg) => {
  if (!averageDailySalesKg || averageDailySalesKg <= 0) {
    return { estimatedDaysToClear: null, alert: 'Insufficient sales velocity data' };
  }

  const estimatedDaysToClear = Math.ceil(stockQuantityKg / averageDailySalesKg);

  return {
    stockQuantityKg,
    averageDailySalesKg,
    estimatedDaysToClear,
    isHighRiskSpoilage: estimatedDaysToClear > 10, // Highlight batches taking >10 days to sell
  };
};