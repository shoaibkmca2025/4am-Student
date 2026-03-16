import mongoose from 'mongoose';

const memoryQuizAttemptSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    topic: { type: String, required: true },
    score: { type: Number, required: true, min: 0, max: 100 },
    totalQuestions: { type: Number, default: 5, min: 1 },
    correctAnswers: { type: Number, default: 0, min: 0 }
  },
  { timestamps: true }
);

const MemoryQuizAttempt =
  mongoose.models.MemoryQuizAttempt || mongoose.model('MemoryQuizAttempt', memoryQuizAttemptSchema);

export default MemoryQuizAttempt;
