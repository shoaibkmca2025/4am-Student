import mongoose from 'mongoose';

const pomodoroRoomSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, enum: ['silent', 'live-study'], default: 'silent' },
    allowCamera: { type: Boolean, default: false },
    activeUsers: { type: Number, default: 1, min: 0 },
    currentPhase: { type: String, enum: ['focus', 'break'], default: 'focus' },
    phaseEndsAt: { type: Date, default: () => new Date(Date.now() + 25 * 60 * 1000) },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

const PomodoroRoom = mongoose.models.PomodoroRoom || mongoose.model('PomodoroRoom', pomodoroRoomSchema);

export default PomodoroRoom;
