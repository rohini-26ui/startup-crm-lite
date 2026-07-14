import mongoose from 'mongoose';

/**
 * Lead Schema definition
 */
export const leadSchema = new mongoose.Schema(
  {
    /**
     * The name of the lead or contact person.
     * Must be between 2 and 100 characters.
     */
    name: {
      type: String,
      required: [true, 'Lead name is required'],
      trim: true,
      minLength: [2, 'Name must be at least 2 characters long'],
      maxLength: [100, 'Name cannot exceed 100 characters'],
    },
    /**
     * The name of the company the lead belongs to.
     */
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    /**
     * The email address of the lead.
     * Must be a valid email format.
     */
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      validate: {
        validator: function (v) {
          return /^\S+@\S+\.\S+$/.test(v);
        },
        message: 'Email must be a valid email address',
      },
    },
    /**
     * The phone number of the lead.
     */
    phone: {
      type: String,
      trim: true,
    },
    /**
     * The current status of the lead in the CRM pipeline.
     */
    status: {
      type: String,
      enum: {
        values: ['New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost'],
        message: '{VALUE} is not a valid status',
      },
      default: 'New',
    },
    /**
     * The source from which the lead was acquired.
     */
    source: {
      type: String,
      enum: {
        values: ['Website', 'Referral', 'LinkedIn', 'Cold Call', 'Email Campaign', 'Other'],
        message: '{VALUE} is not a valid source',
      },
      default: 'Website',
    },
    /**
     * Any additional notes or information about the lead.
     * Maximum length is 1000 characters.
     */
    notes: {
      type: String,
      maxLength: [1000, 'Notes cannot exceed 1000 characters'],
    },
    /**
     * Estimated deal value.
     */
    value: {
      type: Number,
      default: 0,
    },
    /**
     * The user who owns or manages this lead.
     * References the User model.
     */
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Lead owner is required'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

/**
 * Virtual field to calculate the age of the lead in days
 * @returns {number} The number of days since the lead was created
 */
leadSchema.virtual('age').get(function () {
  if (!this.createdAt) return 0;
  const now = new Date();
  const diffTime = Math.abs(now - this.createdAt);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Compound index on owner and status for fast filtered queries
leadSchema.index({ owner: 1, status: 1 });

// Compound index on owner and createdAt for date range queries and analytics
leadSchema.index({ owner: 1, createdAt: -1 });

// Compound index on owner and source for source breakdown analytics
leadSchema.index({ owner: 1, source: 1 });

// Index on email for fast lookups
leadSchema.index({ email: 1 });

const Lead = mongoose.model('Lead', leadSchema);

export default Lead;
