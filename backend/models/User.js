import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, default: '' },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['student', 'company', 'admin'], default: 'student', index: true },
    avatar: { type: String, default: '' },
    bio: { type: String, default: '', maxlength: 500 },
    phone: { type: String, default: '', trim: true },
    location: { type: String, default: '', trim: true },
    website: { type: String, default: '', trim: true },
    skills: [{ type: String, trim: true }],
    savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
    preferences: {
      emailNotifications: { type: Boolean, default: true },
      darkMode: { type: Boolean, default: true },
      language: { type: String, default: 'en' }
    },
    // Password reset
    resetTokenHash: { type: String },
    resetTokenExpiry: { type: Date },
    // Account status
    isActive: { type: Boolean, default: true },
    lastLoginAt: { type: Date }
  },
  { timestamps: true }
);

// Remove sensitive fields from JSON output
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  delete obj.resetTokenHash;
  delete obj.resetTokenExpiry;
  return obj;
};

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;

