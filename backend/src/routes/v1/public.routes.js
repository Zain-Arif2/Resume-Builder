import { Router } from 'express';
import { resumeController } from '../../controllers/resume.controller.js';

const router = Router();

router.get('/resumes/:slug', resumeController.getPublicBySlug);

export default router;
