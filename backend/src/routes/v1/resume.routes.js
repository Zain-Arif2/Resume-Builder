import { Router } from 'express';
import { resumeController } from '../../controllers/resume.controller.js';
import { authenticate } from '../../middleware/authenticate.js';
import { validate } from '../../middleware/validate.js';
import { createResumeSchema, updateResumeSchema, resumeIdParamSchema } from '../../validators/resume.validator.js';

const router = Router();

router.use(authenticate);

router.post('/', validate(createResumeSchema), resumeController.create);
router.get('/', resumeController.list);
router.get('/:id', validate(resumeIdParamSchema), resumeController.getById);
router.patch('/:id', validate(updateResumeSchema), resumeController.update);
router.delete('/:id', validate(resumeIdParamSchema), resumeController.remove);
router.post('/:id/duplicate', validate(resumeIdParamSchema), resumeController.duplicate);

export default router;
