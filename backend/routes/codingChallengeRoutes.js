import express from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import CodingChallengeAttempt from '../models/CodingChallengeAttempt.js';
import codingChallenges from '../data/codingChallenges.js';

const router = express.Router();

router.use(requireAuth, requireRole(['student']));

router.get('/challenges', (req, res) => {
  const list = codingChallenges.map(({ testCases, ...rest }) => rest);
  res.json({ challenges: list });
});

router.get('/challenges/:id', (req, res) => {
  const challenge = codingChallenges.find((c) => c.id === req.params.id);
  if (!challenge) return res.status(404).json({ message: 'Challenge not found' });
  res.json({ challenge });
});

router.post('/attempts', async (req, res, next) => {
  try {
    const { challengeId, code, clientResult } = req.body || {};
    const challenge = codingChallenges.find((c) => c.id === challengeId);
    if (!challenge) return res.status(400).json({ message: 'Invalid challengeId' });

    const passedTests = Number(clientResult?.passed || 0);
    const totalTests = Number(clientResult?.total || challenge.testCases.length || 0);
    const runtimeMs = Number(clientResult?.timeMs || 0);

    const attempt = await CodingChallengeAttempt.create({
      userId: req.user._id,
      challengeId,
      status: passedTests === totalTests && totalTests > 0 ? 'passed' : 'failed',
      passedTests,
      totalTests,
      runtimeMs,
      code: typeof code === 'string' ? code.slice(0, 5000) : ''
    });

    res.status(201).json({
      attempt: {
        id: attempt._id,
        challengeId,
        status: attempt.status,
        passedTests: attempt.passedTests,
        totalTests: attempt.totalTests,
        runtimeMs: attempt.runtimeMs,
        createdAt: attempt.createdAt
      }
    });
  } catch (err) {
    next(err);
  }
});

router.get('/attempts/me', async (req, res, next) => {
  try {
    const attempts = await CodingChallengeAttempt.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json({ attempts });
  } catch (err) {
    next(err);
  }
});

export default router;
