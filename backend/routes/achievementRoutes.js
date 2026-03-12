import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import UserAssessment from '../models/UserAssessment.js';
import Resume from '../models/Resume.js';
import InterviewSession from '../models/InterviewSession.js';
import Application from '../models/Application.js';

const router = express.Router();

const BADGES_METADATA = [
  { id: 'resume', title: 'Resume Pro', icon: '📄', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20', desc: 'Created a perfect resume' },
  { id: 'interview', title: 'Interview Ace', icon: '🎤', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20', desc: 'Completed 5 mock interviews' },
  { id: 'code', title: 'Code Warrior', icon: '🐍', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', desc: 'Solved 10 coding problems' },
  { id: 'streak', title: 'Streak Master', icon: '🔥', color: 'text-orange-400 bg-orange-500/10 border-orange-500/20', desc: 'Maintained a 7-day streak' }, // Placeholder logic
  { id: 'bug', title: 'Bug Hunter', icon: '🐛', color: 'text-red-400 bg-red-500/10 border-red-500/20', desc: 'Found and fixed 10 bugs' }, // Placeholder logic
  { id: 'team', title: 'Team Player', icon: '🤝', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20', desc: 'Collaborated on 3 projects' }, // Placeholder logic
  { id: 'fast', title: 'Fast Learner', icon: '⚡', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20', desc: 'Completed a course in 1 week' }, // Placeholder logic
  { id: 'top', title: 'Top 1%', icon: '🏆', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20', desc: 'Reached Level 10' },
  { id: 'early', title: 'Early Bird', icon: '🌅', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20', desc: 'Completed a task before 8 AM' }, // Placeholder logic
  { id: 'night', title: 'Night Owl', icon: '🦉', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20', desc: 'Studied after midnight' }, // Placeholder logic
  { id: 'mentor', title: 'Mentor', icon: '🎓', color: 'text-pink-400 bg-pink-500/10 border-pink-500/20', desc: 'Helped 5 other students' }, // Placeholder logic
  { id: 'blog', title: 'Blogger', icon: '✍️', color: 'text-teal-400 bg-teal-500/10 border-teal-500/20', desc: 'Wrote a technical article' }, // Placeholder logic
];

// @desc    Get user's achievements and stats
// @route   GET /api/achievements
// @access  Private
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Fetch all relevant data in parallel
    const [resume, assessments, interviews, applications] = await Promise.all([
      Resume.findOne({ userId }),
      UserAssessment.find({ userId }),
      InterviewSession.find({ userId }),
      Application.find({ studentId: userId })
    ]);

    // Calculate Stats
    const assessmentCount = assessments.length;
    const interviewCount = interviews.length;
    const applicationCount = applications.length;
    const hasResume = !!resume;

    // Level Calculation (Simple Formula)
    // 100 XP per assessment, 50 XP per interview, 20 XP per application
    const xp = (assessmentCount * 100) + (interviewCount * 50) + (applicationCount * 20) + (hasResume ? 200 : 0);
    const level = Math.floor(xp / 1000) + 1;

    // Badge Logic
    const badges = BADGES_METADATA.map(badge => {
      let isUnlocked = false;
      switch (badge.id) {
        case 'resume':
          isUnlocked = hasResume;
          break;
        case 'interview':
          isUnlocked = interviewCount >= 5;
          break;
        case 'code':
          isUnlocked = assessmentCount >= 10;
          break;
        case 'top':
          isUnlocked = level >= 10;
          break;
        // For others, we can leave them locked or implement random logic for demo
        default:
          isUnlocked = false;
      }
      return { ...badge, unlocked: isUnlocked };
    });

    res.json({
      level,
      xp,
      maxXp: level * 1000,
      badges
    });
  } catch (err) {
    next(err);
  }
});

export default router;
