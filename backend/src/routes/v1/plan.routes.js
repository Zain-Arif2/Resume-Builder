import { Router } from 'express';
import { planController } from '../../controllers/plan.controller.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { validate } from '../../middleware/validate.js';
import { createPlanSchema, updatePlanSchema, planIdParamSchema } from '../../validators/plan.validator.js';
import { ROLES } from '../../constants/index.js';

const router = Router();

// Public — anyone can see active plans (pricing page)
router.get('/', planController.listActive);

// Admin-only management
router.get('/all', authenticate, authorize(ROLES.ADMIN), planController.listAll);
router.post('/', authenticate, authorize(ROLES.ADMIN), validate(createPlanSchema), planController.create);
router.patch('/:id', authenticate, authorize(ROLES.ADMIN), validate(updatePlanSchema), planController.update);
router.delete('/:id', authenticate, authorize(ROLES.ADMIN), validate(planIdParamSchema), planController.remove);

export default router;
