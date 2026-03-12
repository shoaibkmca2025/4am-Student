import mongoose from 'mongoose';

const userAssessmentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    assessmentId: { type: Number, required: true, index: true },
    title: { type: String, default: '' },
    status: { type: String, enum: ['Not Started', 'In Progress', 'Completed'], default: 'Completed' },
    score: { type: String, default: '' },
    timestamp: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

userAssessmentSchema.index({ userId: 1, assessmentId: 1 }, { unique: true });

const UserAssessment =
  mongoose.models.UserAssessment || mongoose.model('UserAssessment', userAssessmentSchema);

export default UserAssessment;

