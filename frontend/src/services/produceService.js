/**
 * Service for managing farm produce listings, quality grading, and direct market pricing.
 */

export const PRODUCE_GRADES = ['A_PREMIUM', 'B_STANDARD', 'C_BULK_PROCESSING'];

/**
 * Validates and formats a produce batch listing before database entry.
 */
export const formatProduceListing = (data, farmerId) => {
  const { name, category, pricePerKg, quantityAvailable, unit, grade, location, image } = data;

  if (!name || !category || !pricePerKg || !quantityAvailable || !location) {
    throw new Error('Please fill in all mandatory crop batch fields.');
  }

  return {
    farmerId,
    name: name.trim(),
    category,
    pricePerKg: parseFloat(pricePerKg),
    quantityAvailable: parseFloat(quantityAvailable),
    unit: unit || 'kg',
    grade: PRODUCE_GRADES.includes(grade) ? grade : 'B_STANDARD',
    location,
    image: image || null,
    isAvailable: true,
    createdAt: new Date()
  };
};

/**
 * Filter and search logic for produce listings.
 */
export const filterProduceListings = (listings, { category, maxPrice, minGrade, searchQuery }) => {
  return listings.filter((item) => {
    if (category && category !== 'All' && item.category !== category) return false;
    if (maxPrice && item.pricePerKg > parseFloat(maxPrice)) return false;
    if (minGrade && item.grade !== minGrade) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesName = item.name.toLowerCase().includes(query);
      const matchesCategory = item.category.toLowerCase().includes(query);
      if (!matchesName && !matchesCategory) return false;
    }
    return true;
  });
};
