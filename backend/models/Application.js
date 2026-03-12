import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true, index: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    status: { type: String, enum: ['Submitted', 'Reviewed', 'Interview', 'Rejected', 'Offered'], default: 'Submitted' },
    coverLetter: { type: String, default: '' },
    resumeSnapshot: { type: mongoose.Schema.Types.Mixed, default: {} }
  },
  { timestamps: true }
);

applicationSchema.index({ jobId: 1, studentId: 1 }, { unique: true });

const Application = mongoose.models.Application || mongoose.model('Application', applicationSchema);

export default Application;

