import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/roleGuard';
import * as companyController from '../controllers/company.controller';

const router = Router();

router.use(authenticate, requireRole('COMPANY'));

router.get('/profile', companyController.getProfile);
router.put('/profile', companyController.updateProfile);
router.get('/jobs', companyController.getPostedJobs);

export default router;
