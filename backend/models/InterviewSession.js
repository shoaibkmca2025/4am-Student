import mongoose from 'mongoose';

const interviewSessionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    status: { type: String, enum: ['active', 'paused', 'completed'], default: 'active' },
    currentQuestionIndex: { type: Number, default: 0 },
    questions: { type: [mongoose.Schema.Types.Mixed], default: [] },
    transcript: { type: [String], default: [] }
  },
  { timestamps: true }
);

const InterviewSession =
  mongoose.models.InterviewSession || mongoose.model('InterviewSession', interviewSessionSchema);

export default InterviewSession;

