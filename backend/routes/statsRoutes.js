import express from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import UserAssessment from '../models/UserAssessment.js';
import Application from '../models/Application.js';
import InterviewSession from '../models/InterviewSession.js';
import Job from '../models/Job.js';
import User from '../models/User.js';

const router = express.Router();

// Student dashboard stats
router.get('/student', requireAuth, requireRole(['student']), async (req, res, next) => {
  try {
    const userId = req.user._id;

    const [assessments, applicationCounts, interviewCounts] = await Promise.all([
      UserAssessment.find({ userId }).select('status score').lean(),
      Application.aggregate([
        { $match: { studentId: userId } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      InterviewSession.aggregate([
        { $match: { userId } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ])
    ]);

    const completedAssessments = assessments.filter(a => a.status === 'Completed').length;
    const avgScore = assessments.length
      ? Math.round(assessments.reduce((sum, a) => sum + (parseInt(a.score) || 0), 0) / assessments.length)
      : 0;

    const applicationsByStatus = {};
    let totalApplications = 0;
    for (const { _id, count } of applicationCounts) {
      applicationsByStatus[_id] = count;
      totalApplications += count;
    }

    let totalInterviews = 0;
    let completedInterviews = 0;
    for (const { _id, count } of interviewCounts) {
      totalInterviews += count;
      if (_id === 'completed') completedInterviews = count;
    }

    return res.json({
      stats: {
        totalAssessments: assessments.length,
        completedAssessments,
        averageScore: avgScore,
        totalApplications,
        applicationsByStatus,
        totalInterviews,
        completedInterviews,
        profileCompletion: calculateProfileCompletion(req.user)
      }
    });
  } catch (err) {
    next(err);
  }
});

// Company dashboard stats
router.get('/company', requireAuth, requireRole(['company']), async (req, res, next) => {
  try {
    const companyId = req.user._id;

    const jobs = await Job.find({ companyId }).select('_id isActive').lean();
    const jobIds = jobs.map(j => j._id);

    const [applicationCounts, recentApplications, totalStudents] = await Promise.all([
      Application.aggregate([
        { $match: { jobId: { $in: jobIds } } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      Application.find({ jobId: { $in: jobIds } })
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
      User.countDocuments({ role: 'student' })
    ]);

    const activeJobs = jobs.filter(j => j.isActive).length;
    const applicationsByStatus = {};
    let totalApplications = 0;
    for (const { _id, count } of applicationCounts) {
      applicationsByStatus[_id] = count;
      totalApplications += count;
    }

    return res.json({
      stats: {
        totalJobs: jobs.length,
        activeJobs,
        totalApplications,
        applicationsByStatus,
        totalStudents,
        recentApplications
      }
    });
  } catch (err) {
    next(err);
  }
});

function calculateProfileCompletion(user) {
  let score = 0;
  const total = 6;
  if (user.name) score++;
  if (user.email) score++;
  if (user.bio) score++;
  if (user.phone) score++;
  if (user.location) score++;
  if (user.skills?.length > 0) score++;
  return Math.round((score / total) * 100);
}

export default router;
