const validator = require('validator');

/**
 * Validate user input for registration
 * @param {Object} data - User registration data
 * @returns {Object} - Object containing errors and isValid flag
 */
const validateRegister = (data) => {
  const errors = {};

  // Name validation
  if (!data.name || validator.isEmpty(data.name)) {
    errors.name = 'Name is required';
  }

  // Email validation
  if (!data.email || validator.isEmpty(data.email)) {
    errors.email = 'Email is required';
  } else if (!validator.isEmail(data.email)) {
    errors.email = 'Email is invalid';
  }

  // Password validation
  if (!data.password || validator.isEmpty(data.password)) {
    errors.password = 'Password is required';
  } else if (!validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = 'Password must be between 6 and 30 characters';
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0
  };
};

/**
 * Validate task input
 * @param {Object} data - Task data
 * @returns {Object} - Object containing errors and isValid flag
 */
const validateTask = (data) => {
  const errors = {};

  // Title validation
  if (!data.title || validator.isEmpty(data.title)) {
    errors.title = 'Task title is required';
  }

  // Status validation
  if (data.status) {
    const validStatuses = ['à faire', 'en cours', 'terminée'];
    if (!validStatuses.includes(data.status)) {
      errors.status = 'Status must be one of: à faire, en cours, terminée';
    }
  }

  // AssignedTo validation
  if (!data.assignedTo) {
    errors.assignedTo = 'Task must be assigned to a user';
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0
  };
};

module.exports = {
  validateRegister,
  validateTask
};
