import { stripeService } from '../services/stripe.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';

export const paymentController = {
  createCheckoutSession: asyncHandler(async (req, res) => {
    const { planId } = req.body;
    if (!planId) throw ApiError.badRequest('planId is required');
    const url = await stripeService.createCheckoutSession(req.user.sub, planId);
    return new ApiResponse(200, { url }, 'Checkout session created').send(res);
  }),

  handleWebhook: asyncHandler(async (req, res) => {
    const signature = req.headers['stripe-signature'];
    await stripeService.handleWebhookEvent(req.body, signature);
    res.status(200).json({ received: true });
  }),
};
