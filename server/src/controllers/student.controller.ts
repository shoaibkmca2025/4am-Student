import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { prisma } from '../config/database';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';

export async function getProfile(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
        studentProfile: true,
      },
    });
    if (!user) throw ApiError.notFound('User not found');
    res.json(ApiResponse.ok(user));
  } catch (err) {
    next(err);
  }
}

export async function updateProfile(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { phone, college, degree, skills, resumeUrl, linkedIn, github } = req.body;
    const profile = await prisma.studentProfile.upsert({
      where: { userId: req.userId! },
      update: { phone, college, degree, skills, resumeUrl, linkedIn, github },
      create: { userId: req.userId!, phone, college, degree, skills, resumeUrl, linkedIn, github },
    });
    res.json(ApiResponse.ok(profile, 'Profile updated'));
  } catch (err) {
    next(err);
  }
}

export async function getResults(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const results = await prisma.assessmentResult.findMany({
      where: { userId: req.userId },
      include: { assessment: { select: { title: true, category: true } } },
      orderBy: { completedAt: 'desc' },
    });
    res.json(ApiResponse.ok(results));
  } catch (err) {
    next(err);
  }
}

export async function getInterviewHistory(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const sessions = await prisma.interviewSession.findMany({
      where: { userId: req.userId },
      orderBy: { startedAt: 'desc' },
    });
    res.json(ApiResponse.ok(sessions));
  } catch (err) {
    next(err);
  }
}

export async function getApplications(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const applications = await prisma.jobApplication.findMany({
      where: { userId: req.userId },
      include: {
        job: {
          select: {
            title: true,
            location: true,
            type: true,
            company: { select: { companyName: true, logoUrl: true } },
          },
        },
      },
      orderBy: { appliedAt: 'desc' },
    });
    res.json(ApiResponse.ok(applications));
  } catch (err) {
    next(err);
  }
}
