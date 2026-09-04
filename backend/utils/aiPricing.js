/**
 * Utility functions for dynamic crop price suggestions and mandi benchmark comparisons.
 */

// Baseline price multipliers according to quality grades
const GRADE_MULTIPLIERS = {
  A_PREMIUM: 1.15,        // +15% premium for top-tier quality
  B_STANDARD: 1.00,       // Baseline fair market price
  C_BULK_PROCESSING: 0.85 // -15% discount for bulk or processing grade
};

/**
 * Calculates recommended selling price per KG for a farmer's produce listing.
 * 
 * @param {Object} params
 * @param {Number} params.baseMarketPrice - Baseline mandi/DOCA market rate per KG.
 * @param {String} params.grade - Produce grade ('A_PREMIUM', 'B_STANDARD', 'C_BULK_PROCESSING').
 * @param {Number} params.quantityKg - Available batch size in KG.
 * @param {String} params.demandTrend - Current market demand trend ('HIGH_DEMAND', 'MODERATE_DEMAND', 'LOW_DEMAND').
 * @param {Boolean} params.isPerishableUrgent - True if batch needs rapid clearance to avoid spoilage.
 * @returns {Object} Price recommendation breakdowns.
 */
export const calculateSuggestedPrice = ({
  baseMarketPrice,
  grade = 'B_STANDARD',
  quantityKg = 100,
  demandTrend = 'STABLE',
  isPerishableUrgent = false,
}) => {
  if (!baseMarketPrice || baseMarketPrice <= 0) {
    throw new Error('Valid base market price per KG is required for price calculation.');
  }

  let suggestedPrice = baseMarketPrice;

  // 1. Quality Grade Adjustment
  const gradeMultiplier = GRADE_MULTIPLIERS[grade] || 1.0;
  suggestedPrice *= gradeMultiplier;

  // 2. Demand Factor Adjustment
  if (demandTrend === 'HIGH_DEMAND') {
    suggestedPrice *= 1.08; // +8% for high demand
  } else if (demandTrend === 'LOW_DEMAND') {
    suggestedPrice *= 0.92; // -8% for oversupplied market
  }

  // 3. Bulk Order Discount Adjustment (For batches >= 1,000 KG / 10 Quintals)
  if (quantityKg >= 1000) {
    suggestedPrice *= 0.95; // -5% bulk incentive
  }

  // 4. Perishable Spoilage Clearance Discount
  if (isPerishableUrgent) {
    suggestedPrice *= 0.88; // -12% quick clearance discount
  }

  // Round off to 2 decimal places
  const finalSuggestedPrice = Math.round(suggestedPrice * 100) / 100;
  const minRecommendedPrice = Math.round(finalSuggestedPrice * 0.90 * 100) / 100;
  const maxRecommendedPrice = Math.round(finalSuggestedPrice * 1.10 * 100) / 100;

  return {
    baseMarketPrice,
    suggestedPricePerKg: finalSuggestedPrice,
    recommendedPriceRange: {
      min: minRecommendedPrice,
      max: maxRecommendedPrice,
    },
    appliedFactors: {
      gradeMultiplier,
      demandTrend,
      bulkDiscountApplied: quantityKg >= 1000,
      spoilageDiscountApplied: isPerishableUrgent,
    },
  };
};

/**
 * Compares a farmer's set listing price against prevailing market ranges.
 * 
 * @param {Number} listingPrice - Farmer's configured price per KG.
 * @param {Number} baseMarketPrice - Official benchmark market rate per KG.
 * @returns {Object} Price competitiveness indicator.
 */
export const EvaluatePriceCompetitiveness = (listingPrice, baseMarketPrice) => {
  const percentageDiff = ((listingPrice - baseMarketPrice) / baseMarketPrice) * 100;

  if (percentageDiff > 20) {
    return {
      status: 'OVERPRICED',
      badgeColor: 'red',
      message: 'Price is significantly above average mandi rates. May experience slower sales.',
    };
  } else if (percentageDiff < -15) {
    return {
      status: 'VERY_COMPETITIVE',
      badgeColor: 'emerald',
      message: 'Great value pricing! Expected to sell out quickly.',
    };
  }

  return {
    status: 'FAIR_MARKET',
    badgeColor: 'blue',
    message: 'Price is well-aligned with current market benchmarks.',
  };
};