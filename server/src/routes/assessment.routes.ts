import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import * as assessmentController from '../controllers/assessment.controller';
import { z } from 'zod';

const router = Router();

const submitSchema = z.object({
  answers: z.record(z.string(), z.number()),
  timeTaken: z.number().int().positive(),
});

router.get('/', authenticate, assessmentController.listAssessments);
router.get('/results', authenticate, assessmentController.getUserResults);
router.get('/:id/start', authenticate, assessmentController.startAssessment);
router.post('/:id/submit', authenticate, validate(submitSchema), assessmentController.submitAssessment);

export default router;
