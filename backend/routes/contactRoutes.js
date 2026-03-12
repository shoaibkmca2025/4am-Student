import express from 'express';
import ContactMessage from '../models/ContactMessage.js';

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const name = typeof req.body?.name === 'string' ? req.body.name.trim() : '';
    const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const interest = typeof req.body?.interest === 'string' ? req.body.interest.trim() : '';
    const message = typeof req.body?.message === 'string' ? req.body.message.trim() : '';

    if (!email || !message) return res.status(400).json({ message: 'Email and message are required' });

    await ContactMessage.create({ name, email, interest, message });
    return res.status(201).json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;

