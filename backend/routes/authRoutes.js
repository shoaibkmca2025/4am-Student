import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

const getJwtSecret = () => {
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.trim()) return process.env.JWT_SECRET.trim();
  if ((process.env.NODE_ENV || 'development') !== 'production') return 'dev_jwt_secret_change_me';
  return '';
};

const signToken = (userId) => {
  const secret = getJwtSecret();
  if (!secret) throw new Error('JWT secret not configured');
  return jwt.sign({ sub: userId }, secret, { expiresIn: '7d' });
};

router.post('/register', async (req, res, next) => {
  try {
    const name = typeof req.body?.name === 'string' ? req.body.name.trim() : '';
    const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const password = typeof req.body?.password === 'string' ? req.body.password : '';
    const role = req.body?.role === 'company' ? 'company' : 'student';

    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });
    if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already registered' });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash, role });
    const token = signToken(user._id.toString());

    return res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, preferences: user.preferences }
    });
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const password = typeof req.body?.password === 'string' ? req.body.password : '';

    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });

    const user = await User.findOne({ email });
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

export default router;

