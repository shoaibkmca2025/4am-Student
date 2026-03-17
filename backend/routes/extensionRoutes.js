import express from 'express';
import { isValidObjectId } from 'mongoose';
import { requireAuth, requireRole } from '../middleware/auth.js';
import StudyLog from '../models/StudyLog.js';
import GamificationProfile from '../models/GamificationProfile.js';
import PomodoroRoom from '../models/PomodoroRoom.js';
import ConfessionPost from '../models/ConfessionPost.js';
import MarketplaceListing from '../models/MarketplaceListing.js';
import Wallet from '../models/Wallet.js';
import WalletTransaction from '../models/WalletTransaction.js';
import MemoryQuizAttempt from '../models/MemoryQuizAttempt.js';
import User from '../models/User.js';

const router = express.Router();

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const startOfDay = (date) => new Date(new Date(date).setHours(0, 0, 0, 0));
const updateStreak = (profile, referenceDate = new Date()) => {
  const today = startOfDay(referenceDate);
  const last = profile.lastStudyDate ? startOfDay(profile.lastStudyDate) : null;

  if (!last) {
    profile.streakDays = Math.max(profile.streakDays || 0, 1);
  } else {
    const diffDays = (today - last) / (1000 * 60 * 60 * 24);
    if (diffDays === 1) profile.streakDays += 1;
    else if (diffDays > 1) profile.streakDays = 1;
  }

  // Always record the latest day we touched the streak so it persists across logins.
  profile.lastStudyDate = today;
};

const WEEKLY_CHALLENGES = [
  { challengeId: 'study-300', title: 'Study 300 minutes this week', target: 300, rewardPoints: 60 },
  { challengeId: 'focus-4', title: 'Complete 4 focus sessions', target: 4, rewardPoints: 40 },
  { challengeId: 'quiz-3', title: 'Complete 3 memory booster quizzes', target: 3, rewardPoints: 50 }
];

const BADGE_CATALOG = [
  { code: 'starter', title: 'Starter Scholar', condition: (p) => p.totalPoints >= 50 },
  { code: 'streak-3', title: '3-Day Streak', condition: (p) => p.streakDays >= 3 },
  { code: 'streak-7', title: '7-Day Streak', condition: (p) => p.streakDays >= 7 },
  { code: 'focus-master', title: 'Focus Master', condition: (p) => p.totalPoints >= 400 }
];

const QUIZ_BANK = {
  memory: [
    { id: 'm1', q: 'What improves long-term memory the most?', options: ['Cramming', 'Spaced repetition', 'Multitasking', 'Skipping sleep'], answer: 1 },
    { id: 'm2', q: 'Best short recall method?', options: ['Passive reading', 'Active recall', 'Highlighting everything', 'Background TV'], answer: 1 },
    { id: 'm3', q: 'Pomodoro focus block is usually?', options: ['10 min', '25 min', '45 min', '90 min'], answer: 1 },
    { id: 'm4', q: 'Focus increases when phone is?', options: ['On desk', 'Face up', 'Out of reach', 'On vibrate'], answer: 2 },
    { id: 'm5', q: 'Weekly review helps with?', options: ['Forgetfulness', 'Retention', 'Procrastination', 'None'], answer: 1 }
  ]
};

const KNOWLEDGE_BITS = [
  'The brain consolidates memory better during deep sleep.',
  'Studying in 25-minute blocks improves attention span for many students.',
  'Explaining a concept out loud boosts understanding and recall.',
  'Frequent low-stakes quizzes are better than one long revision marathon.',
  'Writing key ideas by hand can improve comprehension and retention.'
];

const ensureProfile = async (userId) => {
  let profile = await GamificationProfile.findOne({ userId });
  if (!profile) {
    profile = await GamificationProfile.create({
      userId,
      weeklyChallenges: WEEKLY_CHALLENGES.map((row) => ({ ...row, progress: 0, completed: false }))
    });
  }
  if (!Array.isArray(profile.weeklyChallenges) || profile.weeklyChallenges.length === 0) {
    profile.weeklyChallenges = WEEKLY_CHALLENGES.map((row) => ({ ...row, progress: 0, completed: false }));
  }
  return profile;
};

const ensureWallet = async (userId) => {
  let wallet = await Wallet.findOne({ userId });
  if (!wallet) wallet = await Wallet.create({ userId, balance: 0, totalEarnings: 0, totalSpent: 0 });
  return wallet;
};

const unlockBadges = (profile) => {
  const unlockedCodes = new Set((profile.badges || []).map((b) => b.code));
  BADGE_CATALOG.forEach((badge) => {
    if (!unlockedCodes.has(badge.code) && badge.condition(profile)) {
      profile.badges.push({ code: badge.code, title: badge.title, unlockedAt: new Date() });
    }
  });
};

router.use(requireAuth, requireRole(['student']));

// MODULE 1: Gamified Learning
router.get('/gamified/overview', async (req, res, next) => {
  try {
    const profile = await ensureProfile(req.user._id);
    updateStreak(profile);
    await profile.save();

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    const weeklyLogs = await StudyLog.find({
      userId: req.user._id,
      date: { $gte: startOfDay(sevenDaysAgo) }
    }).sort({ date: 1 });

    const weeklyStudyMinutes = weeklyLogs.reduce((sum, row) => sum + (row.studyMinutes || 0), 0);

    const leaderboardRows = await GamificationProfile.find()
      .sort({ totalPoints: -1, streakDays: -1 })
      .limit(10)
      .populate('userId', 'name');

    const leaderboard = leaderboardRows.map((row, index) => ({
      rank: index + 1,
      userName: row.userId?.name || 'Student',
      points: row.totalPoints,
      streakDays: row.streakDays
    }));

    const attempts = await MemoryQuizAttempt.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      profile,
      weeklyStudyMinutes,
      leaderboard,
      challenges: profile.weeklyChallenges,
      badges: profile.badges,
      memoryBooster: {
        topic: 'memory',
        questions: QUIZ_BANK.memory,
        recentAttempts: attempts
      }
    });
  } catch (err) {
    next(err);
  }
});

router.post('/gamified/study-log', async (req, res, next) => {
  try {
    const minutes = clamp(Number(req.body?.minutes || 0), 0, 1000);
    const source = req.body?.source === 'pomodoro' ? 'pomodoro' : 'manual';
    const date = startOfDay(req.body?.date || new Date());

    const log = await StudyLog.findOneAndUpdate(
      { userId: req.user._id, date },
      {
        $setOnInsert: {
          userId: req.user._id,
          date,
          distractionMinutes: 0,
          socialMediaMinutes: 0
        },
        $inc: { studyMinutes: minutes },
        $set: { source }
      },
      { new: true, upsert: true }
    );

    const focusScore = clamp(Math.round((log.studyMinutes / Math.max(log.studyMinutes + log.distractionMinutes, 1)) * 100), 0, 100);
    const productivityScore = clamp(Math.round((log.studyMinutes / 180) * 100), 0, 100);
    log.focusScore = focusScore;
    log.productivityScore = productivityScore;
    await log.save();

    const profile = await ensureProfile(req.user._id);
    updateStreak(profile);
    profile.totalPoints += Math.max(5, Math.round(minutes / 5));
    profile.level = Math.max(1, Math.floor(profile.totalPoints / 100) + 1);

    profile.weeklyChallenges = profile.weeklyChallenges.map((row) => {
      if (row.challengeId === 'study-300') {
        row.progress = clamp((row.progress || 0) + minutes, 0, row.target);
        if (!row.completed && row.progress >= row.target) {
          row.completed = true;
          profile.totalPoints += row.rewardPoints;
        }
      }
      if (row.challengeId === 'focus-4' && source === 'pomodoro') {
        row.progress = clamp((row.progress || 0) + 1, 0, row.target);
        if (!row.completed && row.progress >= row.target) {
          row.completed = true;
          profile.totalPoints += row.rewardPoints;
        }
      }
      return row;
    });

    unlockBadges(profile);
    await profile.save();

    res.status(201).json({ log, profile });
  } catch (err) {
    next(err);
  }
});

router.post('/gamified/memory-quiz/attempt', async (req, res, next) => {
  try {
    const topic = String(req.body?.topic || 'memory');
    const totalQuestions = clamp(Number(req.body?.totalQuestions || 5), 1, 20);
    const correctAnswers = clamp(Number(req.body?.correctAnswers || 0), 0, totalQuestions);
    const score = clamp(Math.round((correctAnswers / totalQuestions) * 100), 0, 100);

    const attempt = await MemoryQuizAttempt.create({
      userId: req.user._id,
      topic,
      score,
      totalQuestions,
      correctAnswers
    });

    const profile = await ensureProfile(req.user._id);
    profile.totalPoints += Math.max(5, Math.round(score / 2));

    profile.weeklyChallenges = profile.weeklyChallenges.map((row) => {
      if (row.challengeId === 'quiz-3') {
        row.progress = clamp((row.progress || 0) + 1, 0, row.target);
        if (!row.completed && row.progress >= row.target) {
          row.completed = true;
          profile.totalPoints += row.rewardPoints;
        }
      }
      return row;
    });

    unlockBadges(profile);
    await profile.save();

    res.status(201).json({ attempt, profile });
  } catch (err) {
    next(err);
  }
});

// MODULE 2: AI Study Mirror
router.get('/study-mirror/analytics', async (req, res, next) => {
  try {
    const days = clamp(Number(req.query.days || 14), 1, 90);
    const from = new Date();
    from.setDate(from.getDate() - (days - 1));

    const logs = await StudyLog.find({ userId: req.user._id, date: { $gte: startOfDay(from) } }).sort({ date: 1 });

    const daily = logs.map((row) => ({
      date: row.date,
      studyHours: Number(((row.studyMinutes || 0) / 60).toFixed(2)),
      distractionHours: Number((((row.distractionMinutes || 0) + (row.socialMediaMinutes || 0)) / 60).toFixed(2)),
      focusScore: row.focusScore || 0,
      productivityScore: row.productivityScore || 0
    }));

    const weeklyStudyMinutes = logs.reduce((sum, row) => sum + (row.studyMinutes || 0), 0);
    const avgFocus = logs.length
      ? Math.round(logs.reduce((sum, row) => sum + (row.focusScore || 0), 0) / logs.length)
      : 0;

    res.json({
      summary: {
        days,
        totalStudyHours: Number((weeklyStudyMinutes / 60).toFixed(2)),
        averageFocusScore: avgFocus,
        productivityIndex: clamp(Math.round(avgFocus * 0.7 + (weeklyStudyMinutes / Math.max(days * 2, 1)) * 30), 0, 100)
      },
      daily
    });
  } catch (err) {
    next(err);
  }
});

// MODULE 3: Pomodoro Virtual Study Room
router.get('/pomodoro/rooms', async (req, res, next) => {
  try {
    const rooms = await PomodoroRoom.find({ isActive: true }).sort({ updatedAt: -1 }).limit(30);
    res.json({ rooms });
  } catch (err) {
    next(err);
  }
});

router.post('/pomodoro/rooms', async (req, res, next) => {
  try {
    const name = String(req.body?.name || '').trim();
    if (!name) return res.status(400).json({ message: 'Room name is required.' });

    const room = await PomodoroRoom.create({
      name,
      ownerId: req.user._id,
      allowCamera: !!req.body?.allowCamera,
      type: req.body?.type === 'live-study' ? 'live-study' : 'silent'
    });

    res.status(201).json({ room });
  } catch (err) {
    next(err);
  }
});

router.post('/pomodoro/rooms/:id/join', async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid room id.' });
    const room = await PomodoroRoom.findById(req.params.id);
    if (!room || !room.isActive) return res.status(404).json({ message: 'Room not found.' });

    room.activeUsers += 1;
    await room.save();
    res.json({ room });
  } catch (err) {
    next(err);
  }
});

router.post('/pomodoro/rooms/:id/leave', async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid room id.' });
    const room = await PomodoroRoom.findById(req.params.id);
    if (!room || !room.isActive) return res.status(404).json({ message: 'Room not found.' });

    room.activeUsers = Math.max(0, room.activeUsers - 1);
    await room.save();
    res.json({ room });
  } catch (err) {
    next(err);
  }
});

router.post('/pomodoro/session/complete', async (req, res, next) => {
  try {
    const focusMinutes = clamp(Number(req.body?.focusMinutes || 25), 1, 120);

    const today = startOfDay(new Date());
    const log = await StudyLog.findOneAndUpdate(
      { userId: req.user._id, date: today },
      {
        $setOnInsert: {
          userId: req.user._id,
          date: today,
          distractionMinutes: 0,
          socialMediaMinutes: 0
        },
        $inc: { studyMinutes: focusMinutes },
        $set: { source: 'pomodoro' }
      },
      { new: true, upsert: true }
    );

    log.focusScore = clamp(Math.round((log.studyMinutes / Math.max(log.studyMinutes + log.distractionMinutes, 1)) * 100), 0, 100);
    log.productivityScore = clamp(Math.round((log.studyMinutes / 180) * 100), 0, 100);
    await log.save();

    const profile = await ensureProfile(req.user._id);
    profile.totalPoints += Math.round(focusMinutes / 2);
    profile.level = Math.max(1, Math.floor(profile.totalPoints / 100) + 1);

    profile.weeklyChallenges = profile.weeklyChallenges.map((row) => {
      if (row.challengeId === 'focus-4') {
        row.progress = clamp((row.progress || 0) + 1, 0, row.target);
        if (!row.completed && row.progress >= row.target) {
          row.completed = true;
          profile.totalPoints += row.rewardPoints;
        }
      }
      return row;
    });

    unlockBadges(profile);
    await profile.save();

    res.status(201).json({ log, profile });
  } catch (err) {
    next(err);
  }
});

// MODULE 4: Study vs Distraction Tracker
router.post('/distraction/log', async (req, res, next) => {
  try {
    const date = startOfDay(req.body?.date || new Date());
    const studyMinutes = clamp(Number(req.body?.studyMinutes || 0), 0, 1000);
    const socialMediaMinutes = clamp(Number(req.body?.socialMediaMinutes || 0), 0, 1000);
    const otherDistractionMinutes = clamp(Number(req.body?.otherDistractionMinutes || 0), 0, 1000);
    const distractionMinutes = socialMediaMinutes + otherDistractionMinutes;

    const log = await StudyLog.findOneAndUpdate(
      { userId: req.user._id, date },
      {
        $setOnInsert: { userId: req.user._id, date },
        $set: {
          studyMinutes,
          socialMediaMinutes,
          distractionMinutes,
          focusScore: clamp(Math.round((studyMinutes / Math.max(studyMinutes + distractionMinutes, 1)) * 100), 0, 100),
          productivityScore: clamp(Math.round((studyMinutes / 180) * 100), 0, 100),
          source: 'manual'
        }
      },
      { new: true, upsert: true }
    );

    res.status(201).json({ log });
  } catch (err) {
    next(err);
  }
});

router.get('/distraction/report', async (req, res, next) => {
  try {
    const days = clamp(Number(req.query.days || 14), 1, 90);
    const from = new Date();
    from.setDate(from.getDate() - (days - 1));

    const logs = await StudyLog.find({ userId: req.user._id, date: { $gte: startOfDay(from) } }).sort({ date: 1 });

    const totalStudy = logs.reduce((sum, row) => sum + (row.studyMinutes || 0), 0);
    const totalSocial = logs.reduce((sum, row) => sum + (row.socialMediaMinutes || 0), 0);
    const totalDistraction = logs.reduce((sum, row) => sum + (row.distractionMinutes || 0), 0);

    res.json({
      summary: {
        studyHours: Number((totalStudy / 60).toFixed(2)),
        socialHours: Number((totalSocial / 60).toFixed(2)),
        distractionHours: Number((totalDistraction / 60).toFixed(2)),
        focusScore: clamp(Math.round((totalStudy / Math.max(totalStudy + totalDistraction, 1)) * 100), 0, 100)
      },
      daily: logs.map((row) => ({
        date: row.date,
        studyMinutes: row.studyMinutes,
        socialMediaMinutes: row.socialMediaMinutes,
        distractionMinutes: row.distractionMinutes,
        focusScore: row.focusScore,
        productivityScore: row.productivityScore
      }))
    });
  } catch (err) {
    next(err);
  }
});

// MODULE 5 + 6: AI Learning + Viral Tools
const buildAssignment = ({ topic, level, length }) => {
  const safeTopic = topic || 'General Studies';
  const safeLevel = level || 'Undergraduate';
  const safeLength = Number(length || 700);
  return {
    title: `${safeTopic} Assignment Draft (${safeLevel})`,
    outline: [
      `Introduction to ${safeTopic}`,
      `Core concepts and real-world applications`,
      'Case example and analysis',
      'Challenges, ethics, and opportunities',
      'Conclusion with recommendations'
    ],
    content: `Write approximately ${safeLength} words covering the topic ${safeTopic}. Include at least one data-backed example, one critique paragraph, and one practical recommendation.`,
    checklist: ['Clear thesis statement', 'At least 3 references', 'Actionable conclusion']
  };
};

const buildNotes = ({ topic }) => {
  const safeTopic = topic || 'Productivity';
  return {
    topic: safeTopic,
    notes: [
      `${safeTopic}: key definition and why it matters`,
      'Top 3 foundational principles',
      'Common mistakes and how to avoid them',
      'Quick revision summary (5 bullet points)'
    ],
    flashcards: [
      { front: `Define ${safeTopic}`, back: `${safeTopic} is a concept that can be explained with core principles and real-world examples.` },
      { front: `Why is ${safeTopic} important?`, back: 'It helps improve outcomes, decision-making, and long-term performance.' }
    ]
  };
};

const buildPresentation = ({ topic }) => {
  const safeTopic = topic || 'Study Skills';
  return {
    title: `${safeTopic} - Presentation Deck`,
    slides: [
      'Title and objective',
      'Problem statement',
      'Current landscape and evidence',
      'Proposed framework',
      'Implementation plan',
      'Expected outcomes',
      'Q&A'
    ]
  };
};

const buildHomeworkHelp = ({ question }) => {
  const prompt = String(question || '').trim() || 'How to approach this homework effectively?';
  return {
    question: prompt,
    strategy: [
      'Break the question into smaller sub-problems.',
      'List known facts, formulas, or constraints.',
      'Solve one part at a time and verify each step.',
      'Summarize the final answer in clear language.'
    ],
    workedHint: `Start by identifying keywords in: "${prompt}" and map them to the relevant concept before calculating.`
  };
};

router.post('/ai-tools/assignment-generator', async (req, res) => {
  res.json({ result: buildAssignment(req.body || {}) });
});

router.post('/ai-tools/notes-generator', async (req, res) => {
  res.json({ result: buildNotes(req.body || {}) });
});

router.post('/ai-tools/presentation-generator', async (req, res) => {
  res.json({ result: buildPresentation(req.body || {}) });
});

router.post('/ai-tools/homework-helper', async (req, res) => {
  res.json({ result: buildHomeworkHelp(req.body || {}) });
});

router.get('/viral/random-knowledge', async (req, res) => {
  const random = KNOWLEDGE_BITS[Math.floor(Math.random() * KNOWLEDGE_BITS.length)];
  res.json({ fact: random });
});

router.post('/viral/exam-panic-sheet', async (req, res) => {
  const subject = String(req.body?.subject || 'General Subject');
  res.json({
    subject,
    quickRevisionSheet: {
      mustKnow: [`Top 5 ${subject} concepts`, 'Formula/definition list', 'Common exam traps'],
      lastHourPlan: ['20m concept review', '20m active recall', '20m rapid question drill'],
      confidenceBoost: 'You do not need perfection. Prioritize high-yield concepts and clear structure.'
    }
  });
});

router.post('/viral/procrastination-alarm', async (req, res) => {
  const minutes = clamp(Number(req.body?.minutes || 30), 5, 180);
  const message = String(req.body?.message || 'Back to focus time!');
  res.status(201).json({
    alarm: {
      triggerAfterMinutes: minutes,
      message,
      createdAt: new Date()
    }
  });
});

// MODULE 7: Community
router.get('/community/confessions', async (req, res, next) => {
  try {
    const posts = await ConfessionPost.find().sort({ createdAt: -1 }).limit(50);
    res.json({
      posts: posts.map((p) => ({
        id: p._id,
        message: p.message,
        mood: p.mood,
        likes: p.likes,
        createdAt: p.createdAt,
        author: 'Anonymous'
      }))
    });
  } catch (err) {
    next(err);
  }
});

router.post('/community/confessions', async (req, res, next) => {
  try {
    const message = String(req.body?.message || '').trim();
    const mood = String(req.body?.mood || 'neutral');
    if (!message) return res.status(400).json({ message: 'Confession message is required.' });

    const post = await ConfessionPost.create({
      userId: req.user._id,
      message,
      mood,
      isAnonymous: true
    });

    res.status(201).json({ post });
  } catch (err) {
    next(err);
  }
});

router.get('/community/global-map', async (req, res, next) => {
  try {
    const users = await User.find({ role: 'student' }).select('name location').limit(200).lean();
    const points = users.map((row, idx) => ({
      id: idx + 1,
      label: row.location || 'Unknown',
      // Placeholder coordinates for visualization-only global presence.
      lat: clamp(-60 + (idx % 12) * 10, -85, 85),
      lng: clamp(-170 + (idx % 18) * 20, -180, 180),
      onlineCount: 1
    }));

    res.json({ onlineStudents: users.length, points });
  } catch (err) {
    next(err);
  }
});

router.get('/community/live-study-rooms', async (req, res, next) => {
  try {
    const rooms = await PomodoroRoom.find({ type: 'live-study', isActive: true }).sort({ updatedAt: -1 });
    res.json({ rooms });
  } catch (err) {
    next(err);
  }
});

// MODULE 8: Marketplace
router.get('/marketplace/listings', async (req, res, next) => {
  try {
    const category = String(req.query.category || '').trim();
    const query = { isActive: true };
    if (category) query.category = category;

    const listings = await MarketplaceListing.find(query)
      .sort({ createdAt: -1 })
      .populate('sellerId', 'name');

    res.json({
      listings: listings.map((row) => ({
        id: row._id,
        title: row.title,
        description: row.description,
        category: row.category,
        price: row.price,
        downloads: row.downloads,
        sellerName: row.sellerId?.name || 'Student Seller',
        createdAt: row.createdAt
      }))
    });
  } catch (err) {
    next(err);
  }
});

router.post('/marketplace/listings', async (req, res, next) => {
  try {
    const title = String(req.body?.title || '').trim();
    const description = String(req.body?.description || '').trim();
    const category = String(req.body?.category || '').trim();
    const price = clamp(Number(req.body?.price || 0), 0, 10000);

    if (!title || !category) {
      return res.status(400).json({ message: 'Title and category are required.' });
    }

    const listing = await MarketplaceListing.create({
      sellerId: req.user._id,
      title,
      description,
      category,
      price
    });

    res.status(201).json({ listing });
  } catch (err) {
    next(err);
  }
});

router.get('/marketplace/wallet', async (req, res, next) => {
  try {
    const wallet = await ensureWallet(req.user._id);
    const transactions = await WalletTransaction.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({ wallet, transactions });
  } catch (err) {
    next(err);
  }
});

router.post('/marketplace/wallet/top-up', async (req, res, next) => {
  try {
    const amount = clamp(Number(req.body?.amount || 0), 1, 10000);
    const wallet = await ensureWallet(req.user._id);

    wallet.balance += amount;
    await wallet.save();

    const tx = await WalletTransaction.create({
      walletId: wallet._id,
      userId: req.user._id,
      type: 'credit',
      amount,
      reason: 'Wallet top-up',
      referenceType: 'top-up'
    });

    res.status(201).json({ wallet, transaction: tx });
  } catch (err) {
    next(err);
  }
});

router.post('/marketplace/listings/:id/purchase', async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid listing id.' });

    const listing = await MarketplaceListing.findById(req.params.id);
    if (!listing || !listing.isActive) return res.status(404).json({ message: 'Listing not found.' });
    if (listing.sellerId.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot purchase your own listing.' });
    }

    const buyerWallet = await ensureWallet(req.user._id);
    if (buyerWallet.balance < listing.price) {
      return res.status(400).json({ message: 'Insufficient wallet balance.' });
    }

    const sellerWallet = await ensureWallet(listing.sellerId);

    buyerWallet.balance -= listing.price;
    buyerWallet.totalSpent += listing.price;

    sellerWallet.balance += listing.price;
    sellerWallet.totalEarnings += listing.price;

    listing.downloads += 1;

    await Promise.all([buyerWallet.save(), sellerWallet.save(), listing.save()]);

    const [buyerTx, sellerTx] = await Promise.all([
      WalletTransaction.create({
        walletId: buyerWallet._id,
        userId: req.user._id,
        type: 'debit',
        amount: listing.price,
        reason: `Purchased: ${listing.title}`,
        referenceType: 'listing',
        referenceId: String(listing._id)
      }),
      WalletTransaction.create({
        walletId: sellerWallet._id,
        userId: listing.sellerId,
        type: 'credit',
        amount: listing.price,
        reason: `Sold: ${listing.title}`,
        referenceType: 'listing',
        referenceId: String(listing._id)
      })
    ]);

    res.status(201).json({ listing, buyerWallet, buyerTransaction: buyerTx, sellerTransaction: sellerTx });
  } catch (err) {
    next(err);
  }
});

router.get('/marketplace/earnings', async (req, res, next) => {
  try {
    const wallet = await ensureWallet(req.user._id);
    const myListings = await MarketplaceListing.find({ sellerId: req.user._id });

    res.json({
      earnings: {
        totalEarnings: wallet.totalEarnings,
        balance: wallet.balance,
        totalListings: myListings.length,
        totalDownloads: myListings.reduce((sum, row) => sum + (row.downloads || 0), 0)
      }
    });
  } catch (err) {
    next(err);
  }
});

export default router;
