import express from 'express';
import { isValidObjectId } from 'mongoose';
import { body, query } from 'express-validator';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import Resume from '../models/Resume.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import { createNotification } from '../utils/notifications.js';

const router = express.Router();

// List jobs with pagination, search, and filters
router.get('/', [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 50 }).toInt(),
  query('search').optional().trim(),
  query('type').optional().trim(),
  query('location').optional().trim(),
  validate
], async (req, res, next) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 20;
    const skip = (page - 1) * limit;

    const filter = { isActive: true };
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      filter.$or = [
        { title: searchRegex },
        { companyName: searchRegex },
        { requirements: { $elemMatch: { $regex: searchRegex } } },
        { description: searchRegex }
      ];
    }
    if (req.query.type) filter.type = req.query.type;
    if (req.query.location) {
      filter.location = new RegExp(req.query.location.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    }

    const [jobs, total] = await Promise.all([
      Job.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Job.countDocuments(filter)
    ]);

    return res.json({
      jobs,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });
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
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 20));
    const skip = (page - 1) * limit;

    const [jobs, total] = await Promise.all([
      Job.find({ companyId: req.user._id }).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Job.countDocuments({ companyId: req.user._id })
    ]);

    return res.json({ jobs, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (err) {
    next(err);
  }
});

router.post('/', requireAuth, requireRole(['company']), [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 200 }),
  body('companyName').optional().trim().isLength({ max: 200 }),
  body('location').optional().trim().isLength({ max: 200 }),
  body('type').optional().trim().isIn(['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote']),
  body('description').optional().trim().isLength({ max: 5000 }),
  body('salaryRange').optional().trim().isLength({ max: 100 }),
  body('requirements').optional().isArray(),
  validate
], async (req, res, next) => {
  try {
    const { title, location, type, description, salaryRange, requirements } = req.body;
    const companyName = req.body.companyName || req.user.name || 'Company';

    const job = await Job.create({
      companyId: req.user._id,
      title,
      companyName,
      location: location || '',
      type: type || 'Full-time',
      description: description || '',
      salaryRange: salaryRange || '',
      requirements: Array.isArray(requirements) ? requirements.filter(Boolean).map(String) : []
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

router.post('/:id/apply', requireAuth, requireRole(['student']), [
  body('coverLetter').optional().trim().isLength({ max: 5000 }),
  validate
], async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid job ID' });

    const job = await Job.findById(req.params.id);
    if (!job || !job.isActive) return res.status(404).json({ message: 'Job not found' });

    // Check if already applied
    const existingApp = await Application.findOne({ jobId: job._id, studentId: req.user._id });
    if (existingApp) return res.status(409).json({ message: 'Already applied to this job' });

    const coverLetter = req.body.coverLetter || '';
    const resumeDoc = await Resume.findOne({ userId: req.user._id });

    const app = await Application.create({
      jobId: job._id,
      studentId: req.user._id,
      coverLetter,
      resumeSnapshot: resumeDoc?.data || {}
    });

    // Notify the company
    await createNotification({
      userId: job.companyId,
      title: 'New Application',
      message: `A student applied to "${job.title}"`,
      type: 'info',
      link: `/jobs/${job._id}/applications`
    });

    // Notify the student
    await createNotification({
      userId: req.user._id,
      title: 'Application Submitted',
      message: `You applied to "${job.title}" at ${job.companyName}`,
      type: 'success'
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

    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 20));
    const skip = (page - 1) * limit;

    const [applications, total] = await Promise.all([
      Application.find({ jobId: job._id }).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Application.countDocuments({ jobId: job._id })
    ]);

    return res.json({ applications, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (err) {
    next(err);
  }
});

export default router;
