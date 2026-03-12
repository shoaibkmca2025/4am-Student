import express from 'express';
import UserAssessment from '../models/UserAssessment.js';
import Assessment from '../models/Assessment.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const rows = await UserAssessment.find({ userId: req.user._id }).sort({ updatedAt: -1 });
    return res.json({ assessments: rows });
  } catch (err) {
    next(err);
  }
});

router.put('/me/:assessmentId', requireAuth, async (req, res, next) => {
  try {
    const assessmentId = Number(req.params.assessmentId);
    if (!Number.isFinite(assessmentId)) return res.status(400).json({ message: 'Invalid assessment id' });

    const status =
      req.body?.status === 'Completed' || req.body?.status === 'In Progress' || req.body?.status === 'Not Started'
        ? req.body.status
        : 'Completed';
    const score = typeof req.body?.score === 'string' || typeof req.body?.score === 'number' ? String(req.body.score) : '';
    const timestamp = req.body?.timestamp ? new Date(req.body.timestamp) : new Date();

    const meta = await Assessment.findOne({ id: assessmentId }).select('title');

    const updated = await UserAssessment.findOneAndUpdate(
      { userId: req.user._id, assessmentId },
      { userId: req.user._id, assessmentId, title: meta?.title || '', status, score, timestamp },
      { upsert: true, returnDocument: 'after' }
    );

    return res.json({ assessment: updated });
  } catch (err) {
    next(err);
  }
});

export default router;
