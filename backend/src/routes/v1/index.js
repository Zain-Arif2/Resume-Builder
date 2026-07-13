import { Router } from 'express';
import authRoutes from './auth.routes.js';
import resumeRoutes from './resume.routes.js';
import aiRoutes from './ai.routes.js';
import publicRoutes from './public.routes.js';
import adminRoutes from './admin.routes.js';
import pdfRoutes from './pdf.routes.js';
import planRoutes from './plan.routes.js';
import paymentRoutes from './payment.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/resumes', resumeRoutes);
router.use('/ai', aiRoutes);
router.use('/public', publicRoutes);
router.use('/admin', adminRoutes);
router.use('/pdf', pdfRoutes);
router.use('/plans', planRoutes);
router.use('/payments', paymentRoutes);

export default router;
