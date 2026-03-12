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

    const [assessments, applications, interviews] = await Promise.all([
      UserAssessment.find({ userId }),
      Application.find({ studentId: userId }),
      InterviewSession.find({ userId })
    ]);

    const completedAssessments = assessments.filter(a => a.status === 'Completed').length;
    const avgScore = assessments.length
      ? Math.round(assessments.reduce((sum, a) => sum + (parseInt(a.score) || 0), 0) / assessments.length)
      : 0;

    const applicationsByStatus = applications.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {});

    const completedInterviews = interviews.filter(i => i.status === 'completed').length;

    return res.json({
      stats: {
        totalAssessments: assessments.length,
        completedAssessments,
        averageScore: avgScore,
        totalApplications: applications.length,
        applicationsByStatus,
        totalInterviews: interviews.length,
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

    const jobs = await Job.find({ companyId });
    const jobIds = jobs.map(j => j._id);

    const [applications, totalStudents] = await Promise.all([
      Application.find({ jobId: { $in: jobIds } }),
      User.countDocuments({ role: 'student' })
    ]);

    const activeJobs = jobs.filter(j => j.isActive).length;
    const applicationsByStatus = applications.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {});

    return res.json({
      stats: {
        totalJobs: jobs.length,
        activeJobs,
        totalApplications: applications.length,
        applicationsByStatus,
        totalStudents,
        recentApplications: applications
          .sort((a, b) => b.createdAt - a.createdAt)
          .slice(0, 5)
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
