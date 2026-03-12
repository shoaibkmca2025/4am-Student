import express from 'express';
import Resume from '../models/Resume.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const doc = await Resume.findOne({ userId: req.user._id });
    return res.json({ resume: doc?.data || null });
  } catch (err) {
    next(err);
  }
});

router.put('/me', requireAuth, async (req, res, next) => {
  try {
    const data = req.body?.data ?? req.body ?? {};
    const updated = await Resume.findOneAndUpdate(
      { userId: req.user._id },
      { data },
      { upsert: true, returnDocument: 'after' }
    );
    return res.json({ resume: updated.data });
  } catch (err) {
    next(err);
  }
});

export default router;
