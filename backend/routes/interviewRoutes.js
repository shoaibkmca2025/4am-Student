import express from 'express';
import { isValidObjectId } from 'mongoose';
import InterviewSession from '../models/InterviewSession.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/sessions', requireAuth, requireRole(['student']), async (req, res, next) => {
  try {
    const sessions = await InterviewSession.find({ userId: req.user._id }).sort({ createdAt: -1 });
    return res.json({ sessions });
  } catch (err) {
    next(err);
  }
});

const QUESTIONS = [
  {
    id: 'q1',
    text: "Tell me about yourself and why you're interested in this role.",
    expectedKeyPoints: ['Background', 'Experience', 'Motivation']
  },
  {
    id: 'q2',
    text: 'Describe a challenging technical problem you solved recently.',
    expectedKeyPoints: ['Problem', 'Action', 'Result', 'technologies used']
  },
  {
    id: 'q3',
    text: 'How do you handle disagreements with team members?',
    expectedKeyPoints: ['Communication', 'Empathy', 'Resolution']
  }
];

router.post('/sessions', requireAuth, requireRole(['student']), async (req, res, next) => {
  try {
    const session = await InterviewSession.create({
      userId: req.user._id,
      status: 'active',
      currentQuestionIndex: 0,
      questions: QUESTIONS,
      transcript: []
    });
    return res.status(201).json({ session });
  } catch (err) {
    next(err);
  }
});

router.post('/sessions/:id/answer', requireAuth, requireRole(['student']), async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid session ID' });

    const session = await InterviewSession.findById(req.params.id);
    if (!session || session.userId.toString() !== req.user._id.toString()) return res.status(404).json({ message: 'Session not found' });
    if (session.status !== 'active') return res.status(400).json({ message: 'Session is not active' });

    const transcript = typeof req.body?.transcript === 'string' ? req.body.transcript.trim() : '';
    if (transcript) session.transcript.push(transcript);
    await session.save();

    const feedback = {
      score: 85,
      feedback: 'Good structure. Consider adding more measurable impact.',
      improvements: ['Quantify results', 'Keep answers concise', 'Use STAR method consistently']
    };

    return res.json({ feedback });
  } catch (err) {
    next(err);
  }
});

router.post('/sessions/:id/next', requireAuth, requireRole(['student']), async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid session ID' });

    const session = await InterviewSession.findById(req.params.id);
    if (!session || session.userId.toString() !== req.user._id.toString()) return res.status(404).json({ message: 'Session not found' });
    if (session.status !== 'active') return res.status(400).json({ message: 'Session is not active' });

    const nextIndex = session.currentQuestionIndex + 1;
    if (nextIndex >= session.questions.length) {
      session.status = 'completed';
      await session.save();
      return res.json({ question: null, session });
    }

    session.currentQuestionIndex = nextIndex;
    await session.save();
    return res.json({ question: session.questions[nextIndex], session });
  } catch (err) {
    next(err);
  }
});

router.post('/sessions/:id/end', requireAuth, requireRole(['student']), async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid session ID' });

    const session = await InterviewSession.findById(req.params.id);
    if (!session || session.userId.toString() !== req.user._id.toString()) return res.status(404).json({ message: 'Session not found' });
    session.status = 'completed';
    await session.save();
    return res.json({ ok: true, session });
  } catch (err) {
    next(err);
  }
});

export default router;
