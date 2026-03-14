import jwt from 'jsonwebtoken';
import { isValidObjectId } from 'mongoose';
import User from '../models/User.js';

const getJwtSecret = () => {
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.trim()) return process.env.JWT_SECRET.trim();
  if ((process.env.NODE_ENV || 'development') !== 'production') return 'dev_jwt_secret_change_me';
  return '';
};

const USER_FIELDS = 'name email role bio phone location website skills savedJobs preferences isActive avatar';

export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const [scheme, rawToken] = authHeader.split(' ');
    const token = scheme === 'Bearer' && rawToken ? rawToken.trim() : '';
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    const secret = getJwtSecret();
    if (!secret) return res.status(500).json({ message: 'JWT secret not configured' });

    const payload = jwt.verify(token, secret, {
      algorithms: ['HS256'],
      ignoreExpiration: false
    });

    const userId = typeof payload?.sub === 'string' ? payload.sub : '';
    if (!userId || !isValidObjectId(userId)) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await User.findById(payload.sub).select(USER_FIELDS).lean();
    if (!user || user.isActive === false) return res.status(401).json({ message: 'Unauthorized' });

    user.id = user._id.toString();
    req.user = user;
    next();
  } catch (err) {
    if (err?.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

export const requireRole = (roles) => (req, res, next) => {
  const role = req.user?.role;
  if (!role || !roles.includes(role)) return res.status(403).json({ message: 'Forbidden' });
  next();
};

export const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};
