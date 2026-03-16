import mongoose from 'mongoose';

const studyLogSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    date: { type: Date, required: true, index: true },
    studyMinutes: { type: Number, default: 0, min: 0 },
    distractionMinutes: { type: Number, default: 0, min: 0 },
    socialMediaMinutes: { type: Number, default: 0, min: 0 },
    focusScore: { type: Number, default: 0, min: 0, max: 100 },
    productivityScore: { type: Number, default: 0, min: 0, max: 100 },
    source: { type: String, enum: ['manual', 'pomodoro', 'auto'], default: 'manual' }
  },
  { timestamps: true }
);

studyLogSchema.index({ userId: 1, date: 1 }, { unique: true });

const StudyLog = mongoose.models.StudyLog || mongoose.model('StudyLog', studyLogSchema);

export default StudyLog;
