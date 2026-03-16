import express from 'express';
import { isValidObjectId } from 'mongoose';
import InterviewSession from '../models/InterviewSession.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

const clampScore = (value) => Math.max(0, Math.min(100, Math.round(value)));

const tokenize = (value) =>
  (value || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);

const hasLetters = (token) => /[a-z]/.test(token);

const isLikelyGibberishToken = (token) => {
  const normalized = (token || '').toLowerCase();
  if (!normalized) return true;
  if (/\d/.test(normalized)) return true;
  if (!hasLetters(normalized)) return true;

  const vowels = normalized.match(/[aeiou]/g)?.length || 0;
  if (vowels === 0) return true;

  return /[bcdfghjklmnpqrstvwxyz]{5,}/.test(normalized);
};

const scoreAnswer = (answerText, expectedKeyPoints = []) => {
  const trimmed = (answerText || '').trim();
  const words = tokenize(trimmed);
  const lexicalWords = words.filter(hasLetters);
  const likelyGibberishWords = lexicalWords.filter(isLikelyGibberishToken);
  const meaningfulWordsCount = lexicalWords.length - likelyGibberishWords.length;
  const meaningfulRatio = words.length ? meaningfulWordsCount / words.length : 0;
  const lowered = trimmed.toLowerCase();

  const keyPoints = expectedKeyPoints.filter(Boolean);
  const matchedPoints = keyPoints.filter((point) => lowered.includes(point.toLowerCase())).length;
  const relevanceRaw = keyPoints.length ? (matchedPoints / keyPoints.length) * 100 : 70;

  const sentenceCount = trimmed.split(/[.!?]+/).map((s) => s.trim()).filter(Boolean).length;
  const hasFillerOveruse = /\b(um|uh|like|you know)\b/g.test(lowered);
  const clarityRaw = Math.min(100, 15 + words.length * 1.3 + sentenceCount * 8 - (hasFillerOveruse ? 10 : 0));

  const hasSituation = /\b(problem|challenge|situation|task)\b/.test(lowered);
  const hasAction = /\b(action|implemented|built|designed|led|developed|resolved)\b/.test(lowered);
  const hasResult = /\b(result|impact|improved|increased|reduced|learned|outcome|%)\b/.test(lowered);
  const starCoverage = [hasSituation, hasAction, hasResult].filter(Boolean).length;
  const completenessRaw = Math.min(100, 10 + Math.min(words.length, 140) * 0.5 + starCoverage * 18);

  const clarity = clampScore(clarityRaw);
  const relevance = clampScore(relevanceRaw);
  const completeness = clampScore(completenessRaw);

  let qualityPenalty = 0;
  if (words.length >= 4 && meaningfulRatio < 0.6) {
    qualityPenalty += Math.round((0.6 - meaningfulRatio) * 40);
  }
  if (likelyGibberishWords.length >= 2) {
    qualityPenalty += Math.min(15, likelyGibberishWords.length * 2);
  }
  if (relevance < 20 && meaningfulRatio < 0.55) {
    qualityPenalty += 18;
  }

  const score = clampScore(clarity * 0.3 + relevance * 0.4 + completeness * 0.3 - qualityPenalty);

  const strengths = [];
  const improvements = [];

  if (relevance >= 75) strengths.push('Strong relevance to the question');
  else improvements.push('Address more of the expected key points in your answer');

  if (clarity >= 70) strengths.push('Clear and understandable explanation');
  else improvements.push('Use shorter, clearer sentences to improve clarity');

  if (completeness >= 70) strengths.push('Good completeness and structure');
  else improvements.push('Use STAR structure: Situation, Action, Result');

  if (meaningfulRatio < 0.6) improvements.push('Use clear, real words and concrete examples instead of random text');

  if (words.length < 25) improvements.push('Add more details and examples to strengthen your answer');

  const feedback = strengths.length
    ? `${strengths.join('. ')}.`
    : 'Your answer is a good start, but it needs more structure and detail.';

  return {
    score,
    criteria: { clarity, relevance, completeness },
    feedback,
    improvements: [...new Set(improvements)].slice(0, 3)
  };
};

const buildSessionSummary = (answers = []) => {
  if (!answers.length) {
    return { finalScore: 0, summaryFeedback: 'No answers submitted in this session.' };
  }

  const average = answers.reduce((sum, row) => sum + (row.score || 0), 0) / answers.length;
  const finalScore = clampScore(average);

  let summaryFeedback = 'Good effort. Keep practicing with specific examples.';
  if (finalScore >= 85) summaryFeedback = 'Excellent interview performance with strong communication and structure.';
  else if (finalScore >= 70) summaryFeedback = 'Solid interview performance. Add more measurable outcomes for stronger impact.';
  else if (finalScore >= 55) summaryFeedback = 'Fair performance. Focus on relevance and clearer STAR-based responses.';

  return { finalScore, summaryFeedback };
};

router.get('/sessions', requireAuth, requireRole(['student']), async (req, res, next) => {
  try {
    const sessions = await InterviewSession.find({ userId: req.user._id }).sort({ createdAt: -1 });
    return res.json({ sessions });
  } catch (err) {
    next(err);
  }
});

router.get('/history', requireAuth, requireRole(['student']), async (req, res, next) => {
  try {
    const sessions = await InterviewSession.find({ userId: req.user._id, status: 'completed' })
      .sort({ updatedAt: -1 })
      .select('_id createdAt updatedAt finalScore summaryFeedback answers');

    const interviews = sessions.map((session) => ({
      id: session._id,
      date: session.updatedAt || session.createdAt,
      score: clampScore(session.finalScore || 0),
      feedback: session.summaryFeedback || 'Interview completed.',
      answersCount: Array.isArray(session.answers) ? session.answers.length : 0
    }));

    return res.json({ interviews });
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
    if (!transcript) {
      return res.status(400).json({ message: 'Answer cannot be empty.' });
    }

    if (!Array.isArray(session.answers)) session.answers = [];

    const activeQuestion = session.questions?.[session.currentQuestionIndex];
    const evaluation = scoreAnswer(transcript, activeQuestion?.expectedKeyPoints || []);

    session.transcript.push(`Q: ${activeQuestion?.text || ''}`);
    session.transcript.push(`A: ${transcript}`);
    session.answers.push({
      questionId: activeQuestion?.id || '',
      questionText: activeQuestion?.text || '',
      answerText: transcript,
      criteria: evaluation.criteria,
      score: evaluation.score,
      feedback: evaluation.feedback,
      improvements: evaluation.improvements,
      answeredAt: new Date()
    });

    const summary = buildSessionSummary(Array.isArray(session.answers) ? session.answers : []);
    session.finalScore = summary.finalScore;
    session.summaryFeedback = summary.summaryFeedback;
    await session.save();

    return res.json({
      feedback: {
        score: evaluation.score,
        criteria: evaluation.criteria,
        feedback: evaluation.feedback,
        improvements: evaluation.improvements
      }
    });
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
      const summary = buildSessionSummary(Array.isArray(session.answers) ? session.answers : []);
      session.finalScore = summary.finalScore;
      session.summaryFeedback = summary.summaryFeedback;
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
    const summary = buildSessionSummary(Array.isArray(session.answers) ? session.answers : []);
    session.finalScore = summary.finalScore;
    session.summaryFeedback = summary.summaryFeedback;
    await session.save();
    return res.json({ ok: true, session });
  } catch (err) {
    next(err);
  }
});

export default router;
