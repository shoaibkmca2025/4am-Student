import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { prisma } from '../config/database';
import * as interviewService from '../services/interview.service';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';

export async function startInterview(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const result = await interviewService.startSession(req.userId!);
    res.status(201).json(ApiResponse.created(result, 'Interview session started'));
  } catch (err) {
    next(err);
  }
}

export async function submitAnswer(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const sessionId = req.params['sessionId'] as string;
    const { answer } = req.body;
    if (!answer || typeof answer !== 'string') {
      throw ApiError.badRequest('Answer text is required');
    }
    const result = await interviewService.submitAnswer(req.userId!, sessionId, answer);
    res.json(ApiResponse.ok(result, 'Answer submitted'));
  } catch (err) {
    next(err);
  }
}

export async function endInterview(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const sessionId = req.params['sessionId'] as string;
    const result = await interviewService.endSession(req.userId!, sessionId);
    res.json(ApiResponse.ok(result, 'Interview completed'));
  } catch (err) {
    next(err);
  }
}

export async function getSession(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const sessionId = req.params['sessionId'] as string;
    const session = await prisma.interviewSession.findUnique({ where: { id: sessionId } });
    if (!session) throw ApiError.notFound('Session not found');
    if (session.userId !== req.userId) throw ApiError.forbidden('Access denied');
    res.json(ApiResponse.ok(session));
  } catch (err) {
    next(err);
  }
}
