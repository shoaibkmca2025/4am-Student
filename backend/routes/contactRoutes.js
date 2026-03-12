import express from 'express';
import { body } from 'express-validator';
import ContactMessage from '../models/ContactMessage.js';
import { contactLimiter } from '../middleware/rateLimiter.js';
import validate from '../middleware/validate.js';

const router = express.Router();

router.post('/', contactLimiter, [
  body('name').trim().isLength({ max: 100 }).withMessage('Name too long'),
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('interest').optional().trim().isLength({ max: 100 }),
  body('message').trim().notEmpty().withMessage('Message is required').isLength({ max: 2000 }).withMessage('Message too long'),
  validate
], async (req, res, next) => {
  try {
    const { name, email, interest, message } = req.body;
    await ContactMessage.create({ name: name || '', email, interest: interest || '', message });
    return res.status(201).json({ ok: true, message: 'Message sent successfully' });
  } catch (err) {
    next(err);
  }
});

export default router;

