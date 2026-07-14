import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Middleware to protect routes by verifying the presence and validity of a JWT.
 */
export const protect = async (req, res, next) => {
  try {
    let token;

    // Check if token exists in Authorization header: 'Bearer <token>'
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // If token missing: 401 "No token provided, access denied"
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided, access denied'
      });
    }

    try {
      // Verify token with jwt.verify(token, process.env.JWT_SECRET)
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user in database: User.findById(decoded.id).select('-password')
      const user = await User.findById(decoded.id).select('-password');

      // If user not found: 401 "User belonging to this token no longer exists"
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User belonging to this token no longer exists'
        });
      }

      // Attach user to req.user
      req.user = user;
      next();
    } catch (error) {
      // If token expired: 401 "Token has expired, please login again"
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token has expired, please login again'
        });
      }
      
      // If token invalid: 401 "Token is invalid"
      return res.status(401).json({
        success: false,
        message: 'Token is invalid'
      });
    }
  } catch (error) {
    next(error);
  }
};
