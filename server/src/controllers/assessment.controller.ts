import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import * as assessmentService from '../services/assessment.service';
import { ApiResponse } from '../utils/ApiResponse';

export async function listAssessments(_req: Request, res: Response, next: NextFunction) {
  try {
    const assessments = await assessmentService.getAssessments();
    res.json(ApiResponse.ok(assessments));
  } catch (err) {
    next(err);
  }
}

export async function startAssessment(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params['id'] as string;
    const assessment = await assessmentService.getAssessmentById(id);
    res.json(ApiResponse.ok(assessment));
  } catch (err) {
    next(err);
  }
}

export async function submitAssessment(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const id = req.params['id'] as string;
    const { answers, timeTaken } = req.body;
    const result = await assessmentService.submitAssessment(req.userId!, id, { answers, timeTaken });
    res.json(ApiResponse.ok(result, 'Assessment submitted successfully'));
  } catch (err) {
    next(err);
  }
}

export async function getUserResults(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const results = await assessmentService.getUserResults(req.userId!);
    res.json(ApiResponse.ok(results));
  } catch (err) {
    next(err);
  }
}
