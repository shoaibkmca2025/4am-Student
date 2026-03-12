import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/roleGuard';
import * as interviewController from '../controllers/interview.controller';

const router = Router();

router.use(authenticate, requireRole('STUDENT'));

router.post('/start', interviewController.startInterview);
router.get('/:sessionId', interviewController.getSession);
router.post('/:sessionId/answer', interviewController.submitAnswer);
router.post('/:sessionId/end', interviewController.endInterview);

export default router;
