import express from 'express';
import Assessment from '../models/Assessment.js';
import UserAssessment from '../models/UserAssessment.js';
import { requireAdmin, requireAuth } from '../middleware/auth.js';

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

// @desc    Create a new assessment
// @route   POST /api/assessments
// @access  Private (Admin)
router.post('/', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const {
      id: providedId,
      title,
      category,
      duration,
      questionsCount,
      difficulty,
      color,
      questions
    } = req.body || {};

    if (!title || !category || !duration || !difficulty) {
      return res.status(400).json({ message: 'title, category, duration and difficulty are required' });
    }

    if (!['Easy', 'Medium', 'Hard'].includes(difficulty)) {
      return res.status(400).json({ message: 'difficulty must be Easy, Medium, or Hard' });
    }

    let id = Number(providedId);
    if (!Number.isFinite(id)) {
      const lastAssessment = await Assessment.findOne({}).sort({ id: -1 }).select('id').lean();
      id = (lastAssessment?.id || 0) + 1;
    }

    const normalizedQuestions = Array.isArray(questions) ? questions : [];
    const resolvedQuestionsCount = Number.isFinite(Number(questionsCount))
      ? Number(questionsCount)
      : normalizedQuestions.length;

    const created = await Assessment.create({
      id,
      title,
      category,
      duration,
      questionsCount: resolvedQuestionsCount,
      difficulty,
      color: color || 'blue',
      questions: normalizedQuestions
    });

    return res.status(201).json(created);
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(409).json({ message: 'Assessment id already exists' });
    }
    next(err);
  }
});

// @desc    Delete assessment by ID
// @route   DELETE /api/assessments/:id
// @access  Private (Admin)
router.delete('/:id', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ message: 'Invalid ID' });

    const deleted = await Assessment.findOneAndDelete({ id });
    if (!deleted) return res.status(404).json({ message: 'Assessment not found' });

    await UserAssessment.deleteMany({ assessmentId: id });

    return res.json({ ok: true, message: 'Assessment deleted' });
  } catch (err) {
    next(err);
  }
});

// @desc    Get top students by average assessment score
// @route   GET /api/assessments/top-students
// @access  Private (Admin)
router.get('/top-students', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const limit = Math.min(Math.max(Number(req.query.limit) || 5, 1), 50);

    const topStudents = await UserAssessment.aggregate([
      {
        $match: {
          status: 'Completed',
          score: { $exists: true, $ne: '' }
        }
      },
      {
        $addFields: {
          normalizedScore: {
            $convert: {
              input: { $replaceAll: { input: '$score', find: '%', replacement: '' } },
              to: 'double',
              onError: null,
              onNull: null
            }
          }
        }
      },
      {
        $match: {
          normalizedScore: { $ne: null }
        }
      },
      {
        $group: {
          _id: '$userId',
          averageScore: { $avg: '$normalizedScore' },
          bestScore: { $max: '$normalizedScore' },
          completedAssessments: { $sum: 1 }
        }
      },
      { $sort: { averageScore: -1, completedAssessments: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          _id: 0,
          userId: '$user._id',
          name: '$user.name',
          email: '$user.email',
          averageScore: { $round: ['$averageScore', 1] },
          bestScore: { $round: ['$bestScore', 1] },
          completedAssessments: 1
        }
      }
    ]);

    return res.json({ students: topStudents });
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
