import express from 'express';
import bcrypt from 'bcryptjs';
import { isValidObjectId } from 'mongoose';
import User from '../models/User.js';
import Resume from '../models/Resume.js';
import UserAssessment from '../models/UserAssessment.js';
import Application from '../models/Application.js';
import InterviewSession from '../models/InterviewSession.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/me', requireAuth, async (req, res) => {
  return res.json({ user: req.user });
});

router.put('/me', requireAuth, async (req, res, next) => {
  try {
    const name = typeof req.body?.name === 'string' ? req.body.name.trim() : undefined;
    const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : undefined;

    if (email && email !== req.user.email) {
      const existing = await User.findOne({ email });
      if (existing) return res.status(409).json({ message: 'Email already registered' });
    }

    const update = {};
    if (typeof name === 'string') update.name = name;
    if (typeof email === 'string') update.email = email;

    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { $set: update },
      { returnDocument: 'after' }
    ).select('-passwordHash');
    return res.json({ user: updated });
  } catch (err) {
    next(err);
  }
});

router.put('/me/preferences', requireAuth, async (req, res, next) => {
  try {
    const emailNotifications =
      typeof req.body?.emailNotifications === 'boolean' ? req.body.emailNotifications : undefined;
    const darkMode = typeof req.body?.darkMode === 'boolean' ? req.body.darkMode : undefined;

    const update = {};
    if (typeof emailNotifications === 'boolean') update['preferences.emailNotifications'] = emailNotifications;
    if (typeof darkMode === 'boolean') update['preferences.darkMode'] = darkMode;

    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { $set: update },
      { returnDocument: 'after' }
    ).select('-passwordHash');
    return res.json({ user: updated });
  } catch (err) {
    next(err);
  }
});

router.put('/me/password', requireAuth, async (req, res, next) => {
  try {
    const currentPassword = typeof req.body?.currentPassword === 'string' ? req.body.currentPassword : '';
    const newPassword = typeof req.body?.newPassword === 'string' ? req.body.newPassword : '';
    if (!currentPassword || !newPassword) return res.status(400).json({ message: 'Missing password fields' });
    if (newPassword.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const ok = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

router.delete('/me', requireAuth, async (req, res, next) => {
  try {
    const userId = req.user._id;
    await Promise.all([
      Resume.deleteOne({ userId }),
      UserAssessment.deleteMany({ userId }),
      Application.deleteMany({ studentId: userId }),
      InterviewSession.deleteMany({ userId })
    ]);
    await User.deleteOne({ _id: userId });
    return res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

router.post('/me/saved-jobs', requireAuth, async (req, res, next) => {
  try {
    const jobId = typeof req.body?.jobId === 'string' ? req.body.jobId : '';
    if (!jobId) return res.status(400).json({ message: 'Job ID is required' });
    if (!isValidObjectId(jobId)) return res.status(400).json({ message: 'Invalid job ID' });

    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { $addToSet: { savedJobs: jobId } },
      { returnDocument: 'after' }
    ).select('-passwordHash');

    return res.json({ user: updated });
  } catch (err) {
    next(err);
  }
});

router.delete('/me/saved-jobs/:jobId', requireAuth, async (req, res, next) => {
  try {
    const { jobId } = req.params;
    if (!jobId) return res.status(400).json({ message: 'Job ID is required' });
    if (!isValidObjectId(jobId)) return res.status(400).json({ message: 'Invalid job ID' });

    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { savedJobs: jobId } },
      { returnDocument: 'after' }
    ).select('-passwordHash');

    return res.json({ user: updated });
  } catch (err) {
    next(err);
  }
});

export default router;
