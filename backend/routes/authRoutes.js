import express from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validate.js';
import { protect } from '../middleware/auth.js';
import {
  register,
  login,
  getProfile,
  updateProfile
} from '../controllers/authController.js';

const router = express.Router();

// NOTE: In production, consider adding express-rate-limit to /register and /login endpoints
// to prevent brute-force and credential stuffing attacks.
// Example: app.use('/api/auth/login', rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// Define validation rules for register (name, email, password)
const registerRules = [
  body('name').notEmpty().withMessage('Name is required').trim(),
  body('email').isEmail().withMessage('Please include a valid email').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

// Define validation rules for login (email, password)
const loginRules = [
  body('email').isEmail().withMessage('Please include a valid email').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required')
];

// Wire up the routes
// 1. Register route
router.post('/register', validate(registerRules), register);

// 2. Login route
router.post('/login', validate(loginRules), login);

// 3. Get profile route (Protected)
router.get('/profile', protect, getProfile);

// 4. Update profile route (Protected)
router.put('/profile', protect, updateProfile);

export default router;
