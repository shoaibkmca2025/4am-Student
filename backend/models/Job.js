import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    companyName: { type: String, required: true, trim: true },
    location: { type: String, default: '', trim: true },
    type: { type: String, default: 'Full-time', trim: true },
    description: { type: String, default: '', trim: true },
    requirements: { type: [String], default: [] },
    salaryRange: { type: String, default: '', trim: true },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

jobSchema.virtual('applications', {
  ref: 'Application',
  localField: '_id',
  foreignField: 'jobId'
});

jobSchema.set('toObject', { virtuals: true });
jobSchema.set('toJSON', { virtuals: true });

const Job = mongoose.models.Job || mongoose.model('Job', jobSchema);

export default Job;

