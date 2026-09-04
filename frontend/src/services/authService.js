/**
 * Frontend helper for user input validation.
 */
export const validateRegistrationInput = ({ name, password, role, phone, phoneNumber }) => {
  const validRoles = ['farmer', 'buyer', 'fpo', 'logistics', 'admin', 'consumer', 'bulk_buyer', 'driver'];
  const userPhone = phone || phoneNumber;
  
  if (!name || !userPhone) {
    return { isValid: false, message: 'Name and phone number are required.' };
  }
  if (role && !validRoles.includes(String(role).toLowerCase())) {
    return { isValid: false, message: 'Invalid user role selected.' };
  }
  if (password && password.length < 4) {
    return { isValid: false, message: 'Password must be at least 4 characters long.' };
  }
  return { isValid: true };
};
