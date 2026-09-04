
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify JWT token and attach user to request object
exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract token from Bearer header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET 
      );

      //|| 'sih_secret_key_123'
      
      // Attach user object to request (excluding KYC sensitive hashes)
      req.user = await User.findById(decoded.id).select(
        '-kycDocuments.aadhaarHash'
      );

      if (!req.user) {
        return res
          .status(401)
          .json({ success: false, message: 'User no longer exists' });
      }

      next();
    } catch (error) {
      return res
        .status(401)
        .json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: 'Not authorized, no token provided' });
  }
};

// Middleware for Role-Based Access Control (RBAC)
// Usage example: authorize('FARMER', 'FPO')
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${
          req.user ? req.user.role : 'Guest'
        }' is not authorized to access this route`,
      });
    }
    next();
  };
};
