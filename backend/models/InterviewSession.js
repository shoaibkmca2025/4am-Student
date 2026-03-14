import mongoose from 'mongoose';

const interviewSessionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    status: { type: String, enum: ['active', 'paused', 'completed'], default: 'active' },
    currentQuestionIndex: { type: Number, default: 0 },
    questions: { type: [mongoose.Schema.Types.Mixed], default: [] },
    transcript: { type: [String], default: [] },
    answers: {
      type: [
        {
          questionId: { type: String, default: '' },
          questionText: { type: String, default: '' },
          answerText: { type: String, default: '' },
          criteria: {
            clarity: { type: Number, default: 0 },
            relevance: { type: Number, default: 0 },
            completeness: { type: Number, default: 0 }
          },
          score: { type: Number, default: 0 },
          feedback: { type: String, default: '' },
          improvements: { type: [String], default: [] },
          answeredAt: { type: Date, default: Date.now }
        }
      ],
      default: []
    },
    finalScore: { type: Number, default: 0 },
    summaryFeedback: { type: String, default: '' }
  },
  { timestamps: true }
);

const InterviewSession =
  mongoose.models.InterviewSession || mongoose.model('InterviewSession', interviewSessionSchema);

export default InterviewSession;

