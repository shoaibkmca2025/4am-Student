import mongoose from 'mongoose';

const confessionPostSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    message: { type: String, required: true, trim: true, maxlength: 1000 },
    mood: { type: String, default: 'neutral' },
    likes: { type: Number, default: 0, min: 0 },
    isAnonymous: { type: Boolean, default: true }
  },
  { timestamps: true }
);

const ConfessionPost = mongoose.models.ConfessionPost || mongoose.model('ConfessionPost', confessionPostSchema);

export default ConfessionPost;
