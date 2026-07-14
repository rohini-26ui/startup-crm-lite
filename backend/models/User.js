import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * User Schema definition
 */
export const userSchema = new mongoose.Schema(
  {
    /**
     * The full name of the user.
     * Must be between 2 and 50 characters.
     */
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minLength: [2, 'Name must be at least 2 characters long'],
      maxLength: [50, 'Name cannot exceed 50 characters'],
    },
    /**
     * The email address of the user.
     * Used for authentication and notifications.
     * Must be a valid email format.
     */
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (v) {
          return /^\S+@\S+\.\S+$/.test(v);
        },
        message: 'Email must be a valid email address',
      },
    },
    /**
     * The hashed password of the user.
     * Plain text is never stored.
     */
    password: {
      type: String,
      required: [true, 'Password is required'],
      minLength: [6, 'Password must be at least 6 characters long'],
    },
    /**
     * The access level / role of the user.
     * Determines permissions within the application.
     */
    role: {
      type: String,
      enum: {
        values: ['admin', 'user'],
        message: '{VALUE} is not a valid role',
      },
      default: 'user',
    },
    /**
     * Indicates if the user account is active.
     */
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to hash password
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

/**
 * Instance method to compare candidate password with hashed password
 * @param {string} candidatePassword - The plain text password to check
 * @returns {Promise<boolean>} True if passwords match, otherwise false
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

/**
 * Override toJSON to remove password field from JSON output
 * @returns {Object} User object without password
 */
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const User = mongoose.model('User', userSchema);

export default User;
