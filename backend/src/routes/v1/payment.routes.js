import { Router } from 'express';
import { paymentController } from '../../controllers/payment.controller.js';
import { authenticate } from '../../middleware/authenticate.js';

const router = Router();

router.post('/checkout', authenticate, paymentController.createCheckoutSession);

export default router;
