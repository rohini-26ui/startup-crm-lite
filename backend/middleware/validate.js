import { validationResult } from 'express-validator';

/**
 * Middleware that runs express-validator checks and collects errors.
 * 
 * @param {Array} validations - Array of express-validator rules
 */
export const validate = (validations) => {
  return async (req, res, next) => {
    // Run all validations
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    
    // If no errors: calls next()
    if (errors.isEmpty()) {
      return next();
    }

    // If errors exist: return 400 with { success: false, errors: [{ field, message }] }
    const formattedErrors = errors.array().map(err => ({
      field: err.path || err.param,
      message: err.msg
    }));

    return res.status(400).json({
      success: false,
      errors: formattedErrors
    });
  };
};
