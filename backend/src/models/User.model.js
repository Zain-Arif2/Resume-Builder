import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { ROLES, PLANS, SUBSCRIPTION_STATUS, DEFAULT_FREE_CREDITS } from '../constants/index.js';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      select: false,
    },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.USER,
    },

    // ─── Subscription / Credit System ───────────────────
    plan: {
      type: String,
      enum: Object.values(PLANS),
      default: PLANS.FREE,
    },
    resumeCredits: {
      type: Number,
      default: DEFAULT_FREE_CREDITS,
      min: 0,
    },
    totalResumeGenerated: {
      type: Number,
      default: 0,
      min: 0,
    },
    subscriptionStatus: {
      type: String,
      enum: Object.values(SUBSCRIPTION_STATUS),
      default: SUBSCRIPTION_STATUS.INACTIVE,
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: { type: String, select: false },
    emailVerificationExpires: { type: Date, select: false },
    passwordResetToken: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },
    refreshTokens: [
      {
        token: { type: String, select: false },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    isActive: { type: Boolean, default: true },
    lastLoginAt: Date,
  },
  { timestamps: true }
);

userSchema.index({ email: 1 });

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.toSafeObject = function toSafeObject() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshTokens;
  delete obj.emailVerificationToken;
  delete obj.passwordResetToken;
  return obj;
};

export const User = mongoose.model('User', userSchema);
