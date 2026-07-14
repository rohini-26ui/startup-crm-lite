import express from 'express';
import { body } from 'express-validator';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  getLeads,
  createLead,
  getLeadById,
  updateLead,
  updateLeadStatus,
  deleteLead,
  getLeadStats,
  getMonthlyStats,
  searchLeads
} from '../controllers/leadController.js';

const router = express.Router();

// Apply protect middleware to ALL routes in this file
router.use(protect);

// Define valid enums according to the Lead model
const validStatuses = ['New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost'];
const validSources = ['Website', 'Referral', 'LinkedIn', 'Cold Call', 'Email Campaign', 'Other'];

// Validation rules for creating or updating a lead
const leadValidationRules = [
  body('name')
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('company')
    .notEmpty().withMessage('Company is required'),
  body('email')
    .isEmail().withMessage('Must be a valid email format'),
  body('status')
    .optional()
    .isIn(validStatuses).withMessage(`Status must be one of: ${validStatuses.join(', ')}`),
  body('source')
    .optional()
    .isIn(validSources).withMessage(`Source must be one of: ${validSources.join(', ')}`)
];

// Validation rules for updating lead status exclusively
const statusValidationRules = [
  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(validStatuses).withMessage(`Status must be one of: ${validStatuses.join(', ')}`)
];

// Define stats endpoints BEFORE /:id to prevent routing collisions
// (e.g. "stats" being interpreted as an ID)
router.get('/stats', getLeadStats);
router.get('/stats/monthly', getMonthlyStats);
router.get('/search', searchLeads);

// Define standard CRUD routes
router.route('/')
  .get(getLeads)
  .post(validate(leadValidationRules), createLead);

router.route('/:id')
  .get(getLeadById)
  .put(validate(leadValidationRules), updateLead)
  .delete(deleteLead);

// Custom endpoint for specifically updating a lead's status
router.patch('/:id/status', validate(statusValidationRules), updateLeadStatus);

export default router;
