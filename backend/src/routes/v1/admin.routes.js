import { Router } from 'express';
import { adminController } from '../../controllers/admin.controller.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { validate } from '../../middleware/validate.js';
import {
  updateUserRoleSchema,
  toggleUserActiveSchema,
  userIdParamSchema,
  increaseCreditsSchema,
  resetCreditsSchema,
} from '../../validators/admin.validator.js';
import { ROLES } from '../../constants/index.js';

const router = Router();

router.use(authenticate, authorize(ROLES.ADMIN));

router.get('/users', adminController.listUsers);
router.patch('/users/:id/role', validate(updateUserRoleSchema), adminController.updateUserRole);
router.patch('/users/:id/status', validate(toggleUserActiveSchema), adminController.toggleUserActive);
router.delete('/users/:id', validate(userIdParamSchema), adminController.deleteUser);

router.patch('/users/:id/credits/increase', validate(increaseCreditsSchema), adminController.increaseCredits);
router.patch('/users/:id/credits/reset', validate(resetCreditsSchema), adminController.resetCredits);
router.patch('/users/:id/upgrade', validate(userIdParamSchema), adminController.upgradeToPro);
router.patch('/users/:id/downgrade', validate(userIdParamSchema), adminController.downgradeToFree);

router.get('/analytics', adminController.getAnalytics);
router.get('/logs', adminController.getSystemLogs);

export default router;
