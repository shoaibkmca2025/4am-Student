import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { prisma } from '../config/database';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';

export async function listJobs(req: Request, res: Response, next: NextFunction) {
  try {
    const { search, type, location } = req.query;
    const jobs = await prisma.job.findMany({
      where: {
        status: 'OPEN',
        ...(search && {
          OR: [
            { title: { contains: String(search), mode: 'insensitive' } },
            { description: { contains: String(search), mode: 'insensitive' } },
          ],
        }),
        ...(type && { type: String(type) }),
        ...(location && { location: { contains: String(location), mode: 'insensitive' } }),
      },
      include: {
        company: { select: { companyName: true, logoUrl: true, location: true } },
        _count: { select: { applications: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(ApiResponse.ok(jobs));
  } catch (err) {
    next(err);
  }
}

export async function getJob(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params['id'] as string;
    const job = await prisma.job.findUnique({
      where: { id },
      include: {
        company: { select: { companyName: true, logoUrl: true, website: true, description: true } },
      },
    });
    if (!job) throw ApiError.notFound('Job not found');
    res.json(ApiResponse.ok(job));
  } catch (err) {
    next(err);
  }
}

export async function createJob(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const companyProfile = await prisma.companyProfile.findUnique({
      where: { userId: req.userId! },
    });
    if (!companyProfile) throw ApiError.notFound('Company profile not found');

    const { title, description, requirements, location, type, salary, expiresAt } = req.body;
    const job = await prisma.job.create({
      data: {
        companyId: companyProfile.id,
        title,
        description,
        requirements: requirements || [],
        location,
        type,
        salary,
        expiresAt: expiresAt ? new Date(expiresAt) : undefined,
      },
    });
    res.status(201).json(ApiResponse.created(job, 'Job posted successfully'));
  } catch (err) {
    next(err);
  }
}

export async function applyToJob(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const id = req.params['id'] as string;
    const { coverNote } = req.body;

    const job = await prisma.job.findUnique({ where: { id } });
    if (!job || job.status !== 'OPEN') throw ApiError.notFound('Job not found or no longer accepting applications');

    const existing = await prisma.jobApplication.findUnique({
      where: { jobId_userId: { jobId: id, userId: req.userId! } },
    });
    if (existing) throw ApiError.conflict('You have already applied to this job');

    const application = await prisma.jobApplication.create({
      data: { jobId: id, userId: req.userId!, coverNote },
    });
    res.status(201).json(ApiResponse.created(application, 'Application submitted'));
  } catch (err) {
    next(err);
  }
}

export async function getApplications(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const id = req.params['id'] as string;
    const companyProfile = await prisma.companyProfile.findUnique({
      where: { userId: req.userId! },
    });
    if (!companyProfile) throw ApiError.forbidden('Company profile not found');

    const job = await prisma.job.findUnique({ where: { id } });
    if (!job || job.companyId !== companyProfile.id) throw ApiError.forbidden('Access denied');

    const applications = await prisma.jobApplication.findMany({
      where: { jobId: id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            studentProfile: { select: { skills: true, college: true, resumeUrl: true } },
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

export async function updateApplicationStatus(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const id = req.params['id'] as string;
    const applicationId = req.params['applicationId'] as string;
    const { status } = req.body;

    const companyProfile = await prisma.companyProfile.findUnique({
      where: { userId: req.userId! },
    });
    if (!companyProfile) throw ApiError.forbidden('Company profile not found');

    const job = await prisma.job.findUnique({ where: { id } });
    if (!job || job.companyId !== companyProfile.id) throw ApiError.forbidden('Access denied');

    const application = await prisma.jobApplication.update({
      where: { id: applicationId },
      data: { status },
    });
    res.json(ApiResponse.ok(application, 'Application status updated'));
  } catch (err) {
    next(err);
  }
}
