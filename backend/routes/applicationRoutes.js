import express from 'express';
import { isValidObjectId } from 'mongoose';
import { body } from 'express-validator';
import Application from '../models/Application.js';
import Job from '../models/Job.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import { createNotification } from '../utils/notifications.js';

const router = express.Router();

// Student: get my applications
router.get('/me', requireAuth, requireRole(['student']), async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 20));
    const skip = (page - 1) * limit;

    const [applications, total] = await Promise.all([
      Application.find({ studentId: req.user._id })
        .populate('jobId', 'title companyName location type')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Application.countDocuments({ studentId: req.user._id })
    ]);

    return res.json({ applications, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (err) {
    next(err);
  }
});

// Company: get recent applications across all their jobs
router.get('/company/recent', requireAuth, requireRole(['company']), async (req, res, next) => {
  try {
    const jobs = await Job.find({ companyId: req.user._id }).select('_id').limit(500);
    const jobIds = jobs.map((j) => j._id);

    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 20));
    const skip = (page - 1) * limit;

    const [applications, total] = await Promise.all([
      Application.find({ jobId: { $in: jobIds } })
        .populate('jobId', 'title companyName')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Application.countDocuments({ jobId: { $in: jobIds } })
    ]);

    return res.json({ applications, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (err) {
    next(err);
  }
});

// Company: update application status (review, interview, reject, offer)
router.patch('/:id/status', requireAuth, requireRole(['company']), [
  body('status').isIn(['Reviewed', 'Interview', 'Rejected', 'Offered']).withMessage('Invalid status'),
  validate
], async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid application ID' });

    const application = await Application.findById(req.params.id).populate('jobId', 'companyId title');
    if (!application) return res.status(404).json({ message: 'Application not found' });

    // Verify the company owns the job
    if (application.jobId.companyId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    application.status = req.body.status;
    await application.save();

    // Notify the student
    const statusMessages = {
      Reviewed: 'Your application is being reviewed',
      Interview: 'You have been selected for an interview!',
      Rejected: 'Your application was not selected this time',
      Offered: 'Congratulations! You received a job offer!'
    };

    await createNotification({
      userId: application.studentId,
      title: `Application ${req.body.status}`,
      message: `${statusMessages[req.body.status]} for "${application.jobId.title}"`,
      type: req.body.status === 'Rejected' ? 'warning' : 'success'
    });

    return res.json({ application });
  } catch (err) {
    next(err);
  }
});

// Student: withdraw application
router.delete('/:id', requireAuth, requireRole(['student']), async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid application ID' });

    const application = await Application.findById(req.params.id);
    if (!application) return res.status(404).json({ message: 'Application not found' });
    if (application.studentId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await Application.deleteOne({ _id: application._id });
    return res.json({ ok: true, message: 'Application withdrawn' });
  } catch (err) {
    next(err);
  }
});

export default router;

