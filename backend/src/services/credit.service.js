import { User } from '../models/User.model.js';
import { ApiError } from '../utils/ApiError.js';
import { PLANS, SUBSCRIPTION_STATUS, DEFAULT_FREE_CREDITS } from '../constants/index.js';

export const creditService = {
  isPro(user) {
    // Single source of truth for "does this user have unlimited access".
    // Future payment providers only need to set plan/subscriptionStatus correctly;
    // this function and everything downstream keeps working unchanged.
    return user.plan === PLANS.PRO && user.subscriptionStatus === SUBSCRIPTION_STATUS.ACTIVE;
  },

  hasCredits(user) {
    return this.isPro(user) || user.resumeCredits > 0;
  },

  async consumeCredit(userId) {
    const user = await User.findById(userId);
    if (!user) throw ApiError.notFound('User not found');

    if (this.isPro(user)) {
      // Pro users don't consume credits, but we still track total usage.
      user.totalResumeGenerated += 1;
      await user.save();
      return user;
    }

    if (user.resumeCredits <= 0) {
      throw ApiError.forbidden('You have used all your free resume generations. Upgrade to Pro to continue.');
    }

    user.resumeCredits -= 1;
    user.totalResumeGenerated += 1;
    await user.save();
    return user;
  },

  async increaseCredits(userId, amount) {
    if (!amount || amount <= 0) throw ApiError.badRequest('Amount must be a positive number');
    const user = await User.findByIdAndUpdate(userId, { $inc: { resumeCredits: amount } }, { new: true });
    if (!user) throw ApiError.notFound('User not found');
    return user;
  },

  async resetCredits(userId, amount = DEFAULT_FREE_CREDITS) {
    const user = await User.findByIdAndUpdate(userId, { resumeCredits: amount }, { new: true });
    if (!user) throw ApiError.notFound('User not found');
    return user;
  },

  async upgradeToPro(userId) {
    const user = await User.findByIdAndUpdate(
      userId,
      { plan: PLANS.PRO, subscriptionStatus: SUBSCRIPTION_STATUS.ACTIVE },
      { new: true }
    );
    if (!user) throw ApiError.notFound('User not found');
    return user;
  },

  async downgradeToFree(userId, resetAmount = DEFAULT_FREE_CREDITS) {
    const user = await User.findByIdAndUpdate(
      userId,
      { plan: PLANS.FREE, subscriptionStatus: SUBSCRIPTION_STATUS.INACTIVE, resumeCredits: resetAmount },
      { new: true }
    );
    if (!user) throw ApiError.notFound('User not found');
    return user;
  },
};
