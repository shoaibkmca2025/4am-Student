import express from 'express';
import { isValidObjectId } from 'mongoose';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import Resume from '../models/Resume.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const jobs = await Job.find({ isActive: true }).sort({ createdAt: -1 }).limit(200);
    return res.json({ jobs });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid job ID' });

    const job = await Job.findById(req.params.id);
    if (!job || !job.isActive) return res.status(404).json({ message: 'Job not found' });
    return res.json({ job });
  } catch (err) {
    next(err);
  }
});

router.get('/me/mine', requireAuth, requireRole(['company']), async (req, res, next) => {
  try {
    const jobs = await Job.find({ companyId: req.user._id }).sort({ createdAt: -1 }).limit(200);
    return res.json({ jobs });
  } catch (err) {
    next(err);
  }
});

router.post('/', requireAuth, requireRole(['company']), async (req, res, next) => {
  try {
    const title = typeof req.body?.title === 'string' ? req.body.title.trim() : '';
    const companyName = typeof req.body?.companyName === 'string' ? req.body.companyName.trim() : req.user.name || 'Company';
    const location = typeof req.body?.location === 'string' ? req.body.location.trim() : '';
    const type = typeof req.body?.type === 'string' ? req.body.type.trim() : 'Full-time';
    const description = typeof req.body?.description === 'string' ? req.body.description.trim() : '';
    const salaryRange = typeof req.body?.salaryRange === 'string' ? req.body.salaryRange.trim() : '';
    const requirements = Array.isArray(req.body?.requirements) ? req.body.requirements.filter(Boolean).map(String) : [];

    if (!title) return res.status(400).json({ message: 'Title is required' });

    const job = await Job.create({
      companyId: req.user._id,
      title,
      companyName,
      location,
      type,
      description,
      salaryRange,
      requirements
    });

    return res.status(201).json({ job });
  } catch (err) {
    next(err);
  }
});

router.put('/:id', requireAuth, requireRole(['company']), async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid job ID' });

    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (job.companyId.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Forbidden' });

    const update = {};
    if (typeof req.body?.title === 'string') update.title = req.body.title.trim();
    if (typeof req.body?.companyName === 'string') update.companyName = req.body.companyName.trim();
    if (typeof req.body?.location === 'string') update.location = req.body.location.trim();
    if (typeof req.body?.type === 'string') update.type = req.body.type.trim();
    if (typeof req.body?.description === 'string') update.description = req.body.description.trim();
    if (typeof req.body?.salaryRange === 'string') update.salaryRange = req.body.salaryRange.trim();
    if (typeof req.body?.isActive === 'boolean') update.isActive = req.body.isActive;
    if (Array.isArray(req.body?.requirements)) update.requirements = req.body.requirements.filter(Boolean).map(String);

    const updated = await Job.findByIdAndUpdate(req.params.id, update, { returnDocument: 'after' });
    return res.json({ job: updated });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', requireAuth, requireRole(['company']), async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid job ID' });

    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (job.companyId.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Forbidden' });

    job.isActive = false;
    await job.save();
    return res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

router.post('/:id/apply', requireAuth, requireRole(['student']), async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid job ID' });

    const job = await Job.findById(req.params.id);
    if (!job || !job.isActive) return res.status(404).json({ message: 'Job not found' });

    const coverLetter = typeof req.body?.coverLetter === 'string' ? req.body.coverLetter.trim() : '';
    const resumeDoc = await Resume.findOne({ userId: req.user._id });

    const app = await Application.create({
      jobId: job._id,
      studentId: req.user._id,
      coverLetter,
      resumeSnapshot: resumeDoc?.data || {}
    });

    return res.status(201).json({ application: app });
  } catch (err) {
    if (String(err?.code) === '11000') return res.status(409).json({ message: 'Already applied' });
    next(err);
  }
});

router.get('/:id/applications', requireAuth, requireRole(['company']), async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid job ID' });

    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (job.companyId.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Forbidden' });

    const applications = await Application.find({ jobId: job._id }).sort({ createdAt: -1 }).limit(500);
    return res.json({ applications });
  } catch (err) {
    next(err);
  }
});

export default router;
