import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/roleGuard';
import * as jobController from '../controllers/job.controller';

const router = Router();

// Public (authenticated)
router.get('/', authenticate, jobController.listJobs);
router.get('/:id', authenticate, jobController.getJob);

// Student only
router.post('/:id/apply', authenticate, requireRole('STUDENT'), jobController.applyToJob);

// Company only
router.post('/', authenticate, requireRole('COMPANY'), jobController.createJob);
router.get('/:id/applications', authenticate, requireRole('COMPANY'), jobController.getApplications);
router.patch('/:id/applications/:applicationId', authenticate, requireRole('COMPANY'), jobController.updateApplicationStatus);

export default router;
