import Stripe from 'stripe';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';
import { planRepository } from '../repositories/plan.repository.js';
import { Payment } from '../models/Payment.model.js';
import { User } from '../models/User.model.js';
import { creditService } from './credit.service.js';
import { logger } from '../config/logger.js';

let stripeClient;
function getStripe() {
  if (!env.stripe.secretKey) throw ApiError.internal('Stripe is not configured');
  if (stripeClient) return stripeClient;
  stripeClient = new Stripe(env.stripe.secretKey);
  return stripeClient;
}

export const stripeService = {
  async createCheckoutSession(userId, planId) {
    const plan = await planRepository.findById(planId);
    if (!plan || !plan.isActive) throw ApiError.notFound('Plan not found or unavailable');

    const user = await User.findById(userId);
    if (!user) throw ApiError.notFound('User not found');

    const stripe = getStripe();

    // Fallback: build a one-off Stripe price at checkout time if the plan
    // doesn't have a pre-created Stripe Price ID (useful for quick admin-created plans).
    const lineItem = plan.stripePriceId
      ? { price: plan.stripePriceId, quantity: 1 }
      : {
          price_data: {
            currency: 'usd',
            product_data: { name: plan.name, description: plan.description || undefined },
            unit_amount: Math.round(plan.priceUSD * 100),
            ...(plan.type === 'subscription' ? { recurring: { interval: plan.interval || 'month' } } : {}),
          },
          quantity: 1,
        };

    const session = await stripe.checkout.sessions.create({
      mode: plan.type === 'subscription' ? 'subscription' : 'payment',
      customer_email: user.email,
      line_items: [lineItem],
      success_url: `${env.clientUrl}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${env.clientUrl}/billing/cancelled`,
      metadata: { userId: user._id.toString(), planId: plan._id.toString() },
    });

    await Payment.create({
      user: user._id,
      plan: plan._id,
      stripeSessionId: session.id,
      amountUSD: plan.priceUSD,
      status: 'pending',
      creditsGranted: plan.type === 'one_time' ? plan.credits || 0 : 0,
    });

    return session.url;
  },

  async handleWebhookEvent(rawBody, signature) {
    const stripe = getStripe();
    let event;

    try {
      event = stripe.webhooks.constructEvent(rawBody, signature, env.stripe.webhookSecret);
    } catch (err) {
      logger.error({ err }, 'Stripe webhook signature verification failed');
      throw ApiError.badRequest('Invalid webhook signature');
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        await this.fulfillCheckout(session);
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        await this.handleSubscriptionCancelled(subscription);
        break;
      }
      default:
        logger.info({ type: event.type }, 'Unhandled Stripe event type');
    }
  },

  async fulfillCheckout(session) {
    const payment = await Payment.findOne({ stripeSessionId: session.id }).populate('plan');
    if (!payment) {
      logger.warn({ sessionId: session.id }, 'No matching Payment record for Stripe session');
      return;
    }
    if (payment.status === 'completed') return; // idempotent, webhook can fire more than once

    payment.status = 'completed';
    payment.stripeCustomerId = session.customer;
    payment.stripeSubscriptionId = session.subscription || undefined;
    await payment.save();

    const plan = payment.plan;

    if (plan.type === 'subscription') {
      // This is the ONLY place that flips plan/subscriptionStatus.
      // Any future payment provider just needs to call creditService.upgradeToPro
      // the same way — resume generation logic never has to change.
      await creditService.upgradeToPro(payment.user);
    } else {
      await creditService.increaseCredits(payment.user, plan.credits || 0);
    }

    logger.info({ userId: payment.user, plan: plan.slug }, 'Payment fulfilled');
  },

  async handleSubscriptionCancelled(subscription) {
    const payment = await Payment.findOne({ stripeSubscriptionId: subscription.id });
    if (!payment) return;
    await creditService.downgradeToFree(payment.user);
    logger.info({ userId: payment.user }, 'Subscription cancelled, user downgraded to Free');
  },
};
