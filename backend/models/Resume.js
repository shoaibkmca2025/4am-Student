import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    data: { type: mongoose.Schema.Types.Mixed, default: {} }
  },
  { timestamps: true }
);

const Resume = mongoose.models.Resume || mongoose.model('Resume', resumeSchema);

export default Resume;

