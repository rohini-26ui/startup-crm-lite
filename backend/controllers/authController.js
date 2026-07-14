import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

/**
 * Helper function to generate a JWT token. (Not a route handler)
 * 
 * @param {string} userId - The ID of the user
 * @returns {string} Signed JWT token
 */
export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

/**
 * Register a new user.
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if email already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({
        success: false,
        message: 'Email already exists'
      });
    }

    // Create new User document
    // (Assuming User model will hash the password via a pre-save hook, 
    // or we hash it here. Following standard Mongoose practices, it's typically in pre-save.)
    const user = await User.create({
      name,
      email,
      password
    });

    // Generate JWT
    const token = generateToken(user._id);

    // Remove password field before returning
    const userResponse = user.toObject();
    delete userResponse.password;

    // Return 201 with token and user (without password)
    res.status(201).json({
      success: true,
      token,
      user: userResponse
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Login a user.
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user by email and include password explicitly
    const user = await User.findOne({ email }).select('+password');

    // If not found or password wrong: 401 "Invalid credentials"
    // Note: NEVER say which one is wrong for security reasons
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // If user.isActive is false: 403 "Account is deactivated"
    if (user.isActive === false) {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    // Generate JWT
    const token = generateToken(user._id);

    // Remove password field before returning
    const userResponse = user.toObject();
    delete userResponse.password;

    // Return 200 with token and user
    res.status(200).json({
      success: true,
      token,
      user: userResponse
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get the profile of the currently authenticated user.
 */
export const getProfile = async (req, res, next) => {
  try {
    // Return req.user (already attached by protect middleware, and password already excluded)
    res.status(200).json({
      success: true,
      user: req.user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update the profile of the currently authenticated user.
 */
export const updateProfile = async (req, res, next) => {
  try {
    const { name, oldPassword, newPassword } = req.body;

    // Fetch user with password included so we can verify the old password if needed
    const user = await User.findById(req.user._id).select('+password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Allow updating name only (email changes need verification flow)
    if (name) {
      user.name = name;
    }

    // If new password provided: validate old password first, then hash new one
    if (newPassword) {
      if (!oldPassword) {
        return res.status(400).json({
          success: false,
          message: 'Please provide your current password to set a new one'
        });
      }

      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid old password'
        });
      }

      // Hash the new password and update
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    // Save and return updated user
    await user.save();

    // Remove password field before returning
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      success: true,
      user: userResponse
    });
  } catch (error) {
    next(error);
  }
};
