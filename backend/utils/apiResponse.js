/**
 * Helper function for sending a consistent success response.
 * 
 * @param {Object} res - Express response object
 * @param {any} data - The payload to send
 * @param {string} message - A descriptive success message
 * @param {number} statusCode - HTTP status code (default: 200)
 */
export const successResponse = (res, data, message, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Helper function for sending a consistent error response.
 * 
 * @param {Object} res - Express response object
 * @param {string} message - A descriptive error message
 * @param {number} statusCode - HTTP status code (default: 500)
 * @param {any} errors - Additional error details (default: null)
 */
export const errorResponse = (res, message, statusCode = 500, errors = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};

/**
 * Helper function for sending a paginated response.
 * 
 * @param {Object} res - Express response object
 * @param {Array} data - Array of paginated data items
 * @param {number} total - Total number of items across all pages
 * @param {number} page - Current page number
 * @param {number} limit - Number of items per page
 */
export const paginatedResponse = (res, data, total, page, limit) => {
  return res.status(200).json({
    success: true,
    data,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  });
};
