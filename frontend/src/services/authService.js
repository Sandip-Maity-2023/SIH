import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'krishi_jwt_secret_key_2026';
const JWT_EXPIRES_IN = '7d';

/**
 * Hashes a plain text password.
 */
export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

/**
 * Compares a plain text password with a hashed password.
 */
export const comparePassword = async (enteredPassword, hashedPassword) => {
  return await bcrypt.compare(enteredPassword, hashedPassword);
};

/**
 * Generates a Signed JWT Token for an authenticated user.
 */
export const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user._id, 
      role: user.role,
      kycVerified: user.kycVerified || false 
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

/**
 * Verifies a given JWT Token.
 */
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired authentication token.');
  }
};

/**
 * Validates user registration fields.
 */
export const validateRegistrationInput = ({ name, email, password, role, phone }) => {
  const validRoles = ['farmer', 'buyer', 'fpo', 'logistics', 'admin'];
  
  if (!name || !email || !password || !phone) {
    return { isValid: false, message: 'All required fields must be provided.' };
  }
  if (!validRoles.includes(role)) {
    return { isValid: false, message: 'Invalid user role selected.' };
  }
  if (password.length < 6) {
    return { isValid: false, message: 'Password must be at least 6 characters long.' };
  }
  return { isValid: true };
};