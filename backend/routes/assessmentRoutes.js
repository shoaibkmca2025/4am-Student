import express from 'express';
import Assessment from '../models/Assessment.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get all assessments
// @route   GET /api/assessments
// @access  Private
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const assessments = await Assessment.find({}).select('-questions'); // Exclude questions for list view
    return res.json(assessments);
  } catch (err) {
    next(err);
  }
});

// @desc    Get assessment by ID
// @route   GET /api/assessments/:id
// @access  Private
router.get('/:id', requireAuth, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ message: 'Invalid ID' });

    const assessment = await Assessment.findOne({ id });
    if (!assessment) return res.status(404).json({ message: 'Assessment not found' });

    return res.json(assessment);
  } catch (err) {
    next(err);
  }
});

export default router;
