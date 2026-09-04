// Format numbers to Indian Rupee (INR) currency format (e.g., ₹12,500)
export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format weight in kilograms or metric tonnes
export const formatWeight = (weightInKg) => {
  if (!weightInKg && weightInKg !== 0) return '0 kg';
  if (weightInKg >= 1000) {
    return `${(weightInKg / 1000).toFixed(2)} Tonnes`;
  }
  return `${weightInKg.toLocaleString('en-IN')} kg`;
};

// Format distance in meters or kilometers
export const formatDistance = (meters) => {
  if (!meters && meters !== 0) return '0 km';
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  return `${(meters / 1000).toFixed(1)} km`;
};

// Format Date object or ISO string to readable localized date
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

// Format relative time (e.g., "5 mins ago")
export const formatTimeAgo = (dateString) => {
  if (!dateString) return '';
  const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};
