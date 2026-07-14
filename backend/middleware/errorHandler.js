/**
 * Global Express error handling middleware.
 * Catches various operational errors and formats them into consistent API responses.
 * 
 * @param {Error} err - The error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const errorHandler = (err, req, res, next) => {
  // Default status code and message for unhandled errors
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Server error';
  let errors = null;

  // Handle Mongoose ValidationError
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
    // Extract field-by-field error messages
    errors = Object.values(err.errors).map((val) => val.message);
  }

  // Handle Mongoose CastError (e.g., invalid ObjectId in request params)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    message = 'Resource not found';
  }

  // Handle MongoDB duplicate key error
  if (err.code === 11000) {
    statusCode = 409;
    message = 'Email already exists';
  }

  // Handle JWT token errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Not authorized, token failed';
  }

  // Check if we're in development mode to optionally send the stack trace
  const isDev = process.env.NODE_ENV === 'development';

  // Send the formatted error response
  res.status(statusCode).json({
    success: false,
    message,
    errors,
    ...(isDev && { stack: err.stack }), // In development: include err.stack, In production: never send stack traces
  });
};
