const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [80, 'Name cannot exceed 80 characters'],
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
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    school: {
      type: String,
      trim: true,
      default: '',
    },
    role: {
      type: String,
      enum: ['teacher', 'admin'],
      default: 'teacher',
    },

    // ── Subscription / Tier ──────────────────────────
    tier: {
      type: String,
      enum: ['free', 'monthly', 'annual'],
      default: 'free',
    },
    subscriptionExpiresAt: {
      type: Date,
      default: null,
    },
    subscriptionId: {
      type: String,
      default: null,
    },

    // ── Usage Tracking ───────────────────────────────
    freeGenerationsUsed: {
      type: Number,
      default: 0,
    },
    totalExamsGenerated: {
      type: Number,
      default: 0,
    },

    // ── Account ──────────────────────────────────────
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  { timestamps: true }
);

// ── Hash password before save ────────────────────────────
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// ── Instance methods ─────────────────────────────────────
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.isPremium = function () {
  if (this.tier === 'free') return false;
  if (!this.subscriptionExpiresAt) return false;
  return new Date() < this.subscriptionExpiresAt;
};

userSchema.methods.canGenerate = function () {
  if (this.isPremium()) return true;
  return this.freeGenerationsUsed < 10; // free tier: 10 exams
};

userSchema.methods.toPublicJSON = function () {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    school: this.school,
    role: this.role,
    tier: this.tier,
    isPremium: this.isPremium(),
    freeGenerationsUsed: this.freeGenerationsUsed,
    freeGenerationsLeft: Math.max(0, 10 - this.freeGenerationsUsed),
    totalExamsGenerated: this.totalExamsGenerated,
    subscriptionExpiresAt: this.subscriptionExpiresAt,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model('User', userSchema);
