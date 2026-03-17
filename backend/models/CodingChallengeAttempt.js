import mongoose from 'mongoose';

const codingChallengeAttemptSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    challengeId: { type: String, required: true, index: true },
    status: { type: String, enum: ['passed', 'failed', 'incomplete'], default: 'incomplete' },
    passedTests: { type: Number, default: 0, min: 0 },
    totalTests: { type: Number, default: 0, min: 0 },
    runtimeMs: { type: Number, default: 0, min: 0 },
    code: { type: String, default: '' }
  },
  { timestamps: true }
);

const CodingChallengeAttempt =
  mongoose.models.CodingChallengeAttempt || mongoose.model('CodingChallengeAttempt', codingChallengeAttemptSchema);

export default CodingChallengeAttempt;
