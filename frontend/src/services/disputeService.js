/**
 * Service to manage marketplace disputes between buyers, farmers, and logistics.
 */

export const DISPUTE_STATUS = {
  OPEN: 'OPEN',
  UNDER_REVIEW: 'UNDER_REVIEW',
  RESOLVED_REFUND: 'RESOLVED_REFUND',
  RESOLVED_REJECTED: 'RESOLVED_REJECTED'
};

/**
 * Formats and creates a new dispute entry payload.
 */
export const createDisputePayload = ({ orderId, raisedBy, reason, description, evidenceUrls = [] }) => {
  if (!orderId || !raisedBy || !reason || !description) {
    throw new Error('Missing required fields to initiate a dispute.');
  }

  return {
    orderId,
    raisedBy,
    reason, // e.g., 'Grade Mismatch', 'Spoiled Produce', 'Delayed Delivery'
    description,
    evidenceUrls,
    status: DISPUTE_STATUS.OPEN,
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

/**
 * Evaluates resolution outcomes based on inspection results.
 */
export const calculateDisputeResolution = (dispute, inspectionGrade, agreedRefundPercentage = 100) => {
  if (dispute.status === DISPUTE_STATUS.RESOLVED_REFUND || dispute.status === DISPUTE_STATUS.RESOLVED_REJECTED) {
    throw new Error('This dispute has already been finalized.');
  }

  if (inspectionGrade === 'DEFECTIVE' || inspectionGrade === 'WRONG_ITEM') {
    return {
      status: DISPUTE_STATUS.RESOLVED_REFUND,
      refundPercentage: agreedRefundPercentage,
      resolutionNotes: `Dispute approved based on inspection grade: ${inspectionGrade}.`
    };
  }

  return {
    status: DISPUTE_STATUS.RESOLVED_REJECTED,
    refundPercentage: 0,
    resolutionNotes: 'Dispute rejected as produce quality matched certified listing grade.'
  };
};
