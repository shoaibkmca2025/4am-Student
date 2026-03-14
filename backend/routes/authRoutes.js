import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { body } from 'express-validator';
import User from '../models/User.js';
import { requireAuth } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import validate from '../middleware/validate.js';
import { createNotification } from '../utils/notifications.js';
import { sendPasswordResetEmail } from '../utils/email.js';

const router = express.Router();

const getJwtSecret = () => {
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.trim()) return process.env.JWT_SECRET.trim();
  if ((process.env.NODE_ENV || 'development') !== 'production') return 'dev_jwt_secret_change_me';
  return '';
};

const signToken = (userId) => {
  const secret = getJwtSecret();
  if (!secret) throw new Error('JWT secret not configured');
  return jwt.sign({ sub: userId }, secret, { expiresIn: '1h' });
};

const createResetToken = () => {
  const token = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  return { token, tokenHash };
};

const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }).withMessage('Name too long'),
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/).withMessage('Password must contain an uppercase letter')
    .matches(/[a-z]/).withMessage('Password must contain a lowercase letter')
    .matches(/\d/).withMessage('Password must contain a number'),
  body('role').optional().isIn(['student', 'company']).withMessage('Invalid role'),
  validate
];

router.post('/register', authLimiter, registerValidation, async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const role = req.body.role === 'company' ? 'company' : 'student';

    const existing = await User.findOne({ email }).select('_id').lean();
    if (existing) return res.status(409).json({ message: 'Email already registered' });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name: name.trim(), email, passwordHash, role });
    const token = signToken(user._id.toString());

    // Send response first, create notification in background
    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, preferences: user.preferences }
    });

    createNotification({
      userId: user._id,
      title: 'Welcome to 4AM!',
      message: 'Your account has been created successfully. Start exploring!',
      type: 'success'
    }).catch(() => {});
  } catch (err) {
    next(err);
  }
});

const loginValidation = [
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  validate
];

router.post('/login', authLimiter, loginValidation, async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('_id name email role passwordHash preferences').lean();
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const token = signToken(user._id.toString());

    return res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, preferences: user.preferences }
    });
  } catch (err) {
    next(err);
  }
});

router.get('/me', requireAuth, async (req, res) => {
  return res.json({ user: req.user });
});

router.post('/forgot-password', authLimiter, [
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  validate
], async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    // Always return success to prevent email enumeration
    if (!user) return res.json({ message: 'If the email exists, a reset link has been sent.' });

    const { token, tokenHash } = createResetToken();
    const resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000);

    user.resetTokenHash = tokenHash;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    try {
      await sendPasswordResetEmail({
        to: user.email,
        name: user.name,
        token,
        expiresInMinutes: 15
      });
      return res.json({ message: 'If the email exists, a reset link has been sent.' });
    } catch (emailErr) {
      // Reset token should not remain active if email dispatch failed.
      user.resetTokenHash = undefined;
      user.resetTokenExpiry = undefined;
      await user.save();

      console.error('Failed to send password reset email:', emailErr?.message || emailErr);
      return res.status(503).json({ message: 'Unable to send reset email right now. Please try again later.' });
    }
  } catch (err) {
    next(err);
  }
});

router.post('/reset-password', authLimiter, [
  body('token').notEmpty().withMessage('Reset token is required'),
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/).withMessage('Password must contain an uppercase letter')
    .matches(/[a-z]/).withMessage('Password must contain a lowercase letter')
    .matches(/\d/).withMessage('Password must contain a number'),
  validate
], async (req, res, next) => {
  try {
    const { token, password } = req.body;
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetTokenHash: tokenHash,
      resetTokenExpiry: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    user.passwordHash = await bcrypt.hash(password, 12);
    user.resetTokenHash = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    return res.json({ message: 'Password reset successfully' });
  } catch (err) {
    next(err);
  }
});

export default router;

