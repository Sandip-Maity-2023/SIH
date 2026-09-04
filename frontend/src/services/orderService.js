/**
 * Business logic for direct farmer-to-buyer transactions and fulfillment.
 */

export const ORDER_STATUS = {
  PENDING_PAYMENT: 'PENDING_PAYMENT',
  ESCROW_HOLD: 'ESCROW_HOLD',
  DISPATCHED: 'DISPATCHED',
  DELIVERED: 'DELIVERED',
  DISPUTED: 'DISPUTED',
  COMPLETED: 'COMPLETED'
};

/**
 * Calculates total pricing including logistics and zero-middleman service fee.
 */
export const calculateOrderTotal = (unitPrice, quantity, distanceKm = 0) => {
  const subtotal = unitPrice * quantity;
  const platformFee = subtotal * 0.02; // Flat 2% KRISHI infrastructure fee
  const estimatedLogisticsFee = distanceKm > 0 ? Math.max(150, distanceKm * 12) : 0;
  
  const grandTotal = subtotal + platformFee + estimatedLogisticsFee;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    platformFee: Math.round(platformFee * 100) / 100,
    logisticsFee: Math.round(estimatedLogisticsFee * 100) / 100,
    grandTotal: Math.round(grandTotal * 100) / 100
  };
};

/**
 * Validates whether requested quantity is available in farmer produce inventory.
 */
export const validateInventoryAvailability = (produce, requestedQty) => {
  if (!produce || !produce.isAvailable) {
    return { valid: false, message: 'Produce batch is no longer available.' };
  }
  if (produce.quantityAvailable < requestedQty) {
    return { 
      valid: false, 
      message: `Requested quantity (${requestedQty} kg) exceeds available stock (${produce.quantityAvailable} kg).` 
    };
  }
  return { valid: true };
};

/**
 * Updates order state safely across fulfillment lifecycle.
 */
export const updateOrderStatus = (currentStatus, targetStatus) => {
  const allowedTransitions = {
    [ORDER_STATUS.PENDING_PAYMENT]: [ORDER_STATUS.ESCROW_HOLD],
    [ORDER_STATUS.ESCROW_HOLD]: [ORDER_STATUS.DISPATCHED, ORDER_STATUS.DISPUTED],
    [ORDER_STATUS.DISPATCHED]: [ORDER_STATUS.DELIVERED, ORDER_STATUS.DISPUTED],
    [ORDER_STATUS.DELIVERED]: [ORDER_STATUS.COMPLETED, ORDER_STATUS.DISPUTED],
    [ORDER_STATUS.DISPUTED]: [ORDER_STATUS.COMPLETED, ORDER_STATUS.ESCROW_HOLD]
  };

  if (!allowedTransitions[currentStatus]?.includes(targetStatus)) {
    throw new Error(`Invalid status transition from ${currentStatus} to ${targetStatus}`);
  }

  return targetStatus;
};
