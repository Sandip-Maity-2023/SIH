/**
 * Generates a unique, standardized Farmer ID.
 * Format: FAR-YYYY-XXXXXX (Year + 6 random digits)
 */
const generateFarmerId = () => {
  const year = new Date().getFullYear();
  const randomDigits = Math.floor(100000 + Math.random() * 900000); // 6-digit random number
  return `FAR-${year}-${randomDigits}`;
};

export { generateFarmerId };
export default generateFarmerId;
