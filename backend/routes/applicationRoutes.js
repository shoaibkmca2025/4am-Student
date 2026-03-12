import express from 'express';
import Application from '../models/Application.js';
import Job from '../models/Job.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/me', requireAuth, requireRole(['student']), async (req, res, next) => {
  try {
    const applications = await Application.find({ studentId: req.user._id }).sort({ createdAt: -1 }).limit(500);
    return res.json({ applications });
  } catch (err) {
    next(err);
  }
});

router.get('/company/recent', requireAuth, requireRole(['company']), async (req, res, next) => {
  try {
    const jobs = await Job.find({ companyId: req.user._id }).select('_id').limit(500);
    const jobIds = jobs.map((j) => j._id);
    const applications = await Application.find({ jobId: { $in: jobIds } }).sort({ createdAt: -1 }).limit(100);
    return res.json({ applications });
  } catch (err) {
    next(err);
  }
});

export default router;

