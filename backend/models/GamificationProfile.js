import mongoose from 'mongoose';

const badgeSchema = new mongoose.Schema(
  {
    code: { type: String, required: true },
    title: { type: String, required: true },
    unlockedAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const challengeProgressSchema = new mongoose.Schema(
  {
    challengeId: { type: String, required: true },
    title: { type: String, required: true },
    target: { type: Number, required: true, min: 1 },
    progress: { type: Number, default: 0, min: 0 },
    completed: { type: Boolean, default: false },
    rewardPoints: { type: Number, default: 0, min: 0 }
  },
  { _id: false }
);

const gamificationProfileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    streakDays: { type: Number, default: 0, min: 0 },
    totalPoints: { type: Number, default: 0, min: 0 },
    level: { type: Number, default: 1, min: 1 },
    lastStudyDate: { type: Date },
    badges: { type: [badgeSchema], default: [] },
    weeklyChallenges: { type: [challengeProgressSchema], default: [] }
  },
  { timestamps: true }
);

const GamificationProfile =
  mongoose.models.GamificationProfile || mongoose.model('GamificationProfile', gamificationProfileSchema);

export default GamificationProfile;
