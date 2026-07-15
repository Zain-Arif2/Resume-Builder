import { Router } from 'express';
import { generatePDF, generateDOCX } from '../../controllers/pdf.controller.js';

const router = Router();

router.post('/generate', generatePDF);
router.post('/generate-docx', generateDOCX);

export default router;
