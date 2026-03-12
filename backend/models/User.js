import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, default: '' },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['student', 'company'], default: 'student' },
    savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
    preferences: {
      emailNotifications: { type: Boolean, default: true },
      darkMode: { type: Boolean, default: true }
    }
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;

