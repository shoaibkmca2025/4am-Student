import rateLimit from 'express-rate-limit';
import { ApiResponse } from '../utils/ApiResponse';

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    res.status(429).json(ApiResponse.error('Too many requests, please try again later'));
  },
});

export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    res.status(429).json(ApiResponse.error('Too many requests, please try again later'));
  },
});
