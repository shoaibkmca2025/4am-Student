import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/roleGuard';
import * as studentController from '../controllers/student.controller';

const router = Router();

router.use(authenticate, requireRole('STUDENT'));

router.get('/profile', studentController.getProfile);
router.put('/profile', studentController.updateProfile);
router.get('/results', studentController.getResults);
router.get('/interviews', studentController.getInterviewHistory);
router.get('/applications', studentController.getApplications);

export default router;
