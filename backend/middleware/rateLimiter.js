import rateLimit, { ipKeyGenerator } from 'express-rate-limit';

const defaultLimiterOptions = {
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => ipKeyGenerator(req.ip),
  handler: (req, res, _next, options) => {
    res.status(options.statusCode || 429).json({ message: options.message?.message || 'Too many requests' });
  }
};

export const authLimiter = rateLimit({
  ...defaultLimiterOptions,
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts per window
  message: { message: 'Too many attempts. Please try again later.' }
});

export const apiLimiter = rateLimit({
  ...defaultLimiterOptions,
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: 'Too many requests' }
});

export const contactLimiter = rateLimit({
  ...defaultLimiterOptions,
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: { message: 'Too many messages sent. Please try again later.' }
});
