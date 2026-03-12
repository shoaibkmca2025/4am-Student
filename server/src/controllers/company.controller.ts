import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { prisma } from '../config/database';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';

export async function getProfile(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const profile = await prisma.companyProfile.findUnique({
      where: { userId: req.userId },
    });
    if (!profile) throw ApiError.notFound('Company profile not found');
    res.json(ApiResponse.ok(profile));
  } catch (err) {
    next(err);
  }
}

export async function updateProfile(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { companyName, industry, website, description, location, size } = req.body;
    const profile = await prisma.companyProfile.upsert({
      where: { userId: req.userId! },
      update: { companyName, industry, website, description, location, size },
      create: {
        userId: req.userId!,
        companyName: companyName || 'My Company',
        industry,
        website,
        description,
        location,
        size,
      },
    });
    res.json(ApiResponse.ok(profile, 'Profile updated'));
  } catch (err) {
    next(err);
  }
}

export async function getPostedJobs(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const profile = await prisma.companyProfile.findUnique({ where: { userId: req.userId! } });
    if (!profile) throw ApiError.notFound('Company profile not found');

    const jobs = await prisma.job.findMany({
      where: { companyId: profile.id },
      include: { _count: { select: { applications: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(ApiResponse.ok(jobs));
  } catch (err) {
    next(err);
  }
}
