import express from 'express';
import bcrypt from 'bcryptjs';
import { isValidObjectId } from 'mongoose';
import { body } from 'express-validator';
import User from '../models/User.js';
import Resume from '../models/Resume.js';
import UserAssessment from '../models/UserAssessment.js';
import Application from '../models/Application.js';
import InterviewSession from '../models/InterviewSession.js';
import { requireAuth } from '../middleware/auth.js';
import validate from '../middleware/validate.js';

const router = express.Router();

router.get('/me', requireAuth, async (req, res) => {
  return res.json({ user: req.user });
});

router.put('/me', requireAuth, [
  body('name').optional().trim().isLength({ max: 100 }),
  body('email').optional().trim().isEmail().normalizeEmail(),
  body('bio').optional().trim().isLength({ max: 500 }),
  body('phone').optional().trim().isLength({ max: 20 }),
  body('location').optional().trim().isLength({ max: 200 }),
  body('website').optional().trim().isLength({ max: 200 }),
  body('skills').optional().isArray({ max: 50 }),
  validate
], async (req, res, next) => {
  try {
    const { name, email, bio, phone, location, website, skills } = req.body;

    if (email && email !== req.user.email) {
      const existing = await User.findOne({ email });
      if (existing) return res.status(409).json({ message: 'Email already registered' });
    }

    const update = {};
    if (typeof name === 'string') update.name = name;
    if (typeof email === 'string') update.email = email;
    if (typeof bio === 'string') update.bio = bio;
    if (typeof phone === 'string') update.phone = phone;
    if (typeof location === 'string') update.location = location;
    if (typeof website === 'string') update.website = website;
    if (Array.isArray(skills)) update.skills = skills.filter(Boolean).map(String).slice(0, 50);

    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { $set: update },
      { returnDocument: 'after' }
    ).select('-passwordHash -resetToken -resetTokenExpiry');
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
    const language = typeof req.body?.language === 'string' ? req.body.language.trim() : undefined;

    const update = {};
    if (typeof emailNotifications === 'boolean') update['preferences.emailNotifications'] = emailNotifications;
    if (typeof darkMode === 'boolean') update['preferences.darkMode'] = darkMode;
    if (typeof language === 'string') update['preferences.language'] = language;

    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { $set: update },
      { returnDocument: 'after' }
    ).select('-passwordHash -resetToken -resetTokenExpiry');
    return res.json({ user: updated });
  } catch (err) {
    next(err);
  }
});

router.put('/me/password', requireAuth, [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/).withMessage('Password must contain an uppercase letter')
    .matches(/[a-z]/).withMessage('Password must contain a lowercase letter')
    .matches(/\d/).withMessage('Password must contain a number'),
  validate
], async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const ok = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!ok) return res.status(401).json({ message: 'Current password is incorrect' });

    user.passwordHash = await bcrypt.hash(newPassword, 12);
    await user.save();

    return res.json({ ok: true, message: 'Password updated successfully' });
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
    ).select('-passwordHash -resetToken -resetTokenExpiry');

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
    ).select('-passwordHash -resetToken -resetTokenExpiry');

    return res.json({ user: updated });
  } catch (err) {
    next(err);
  }
});

export default router;
