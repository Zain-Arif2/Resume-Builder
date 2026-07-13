import { User } from '../models/User.model.js';
import { creditService } from '../services/credit.service.js';
import { ApiError } from '../utils/ApiError.js';

/**
 * Gate for any AI resume-generation route.
 * - Blocks the request with a structured 403 if the user has no credits left.
 * - On success (2xx response), consumes exactly one credit.
 * Controllers never need to touch credit logic directly — this middleware
 * is the single place that enforces and records usage.
 */
export function checkResumeCredits() {
  return async function (req, res, next) {
    try {
      const user = await User.findById(req.user.sub);
      if (!user) return next(ApiError.unauthorized('User not found'));

      if (!creditService.hasCredits(user)) {
        return res.status(403).json({
          success: false,
          code: 'FREE_LIMIT_REACHED',
          message: 'You have used all your free resume generations. Upgrade to Pro to continue.',
        });
      }

      res.on('finish', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          creditService.consumeCredit(user._id).catch(() => {});
        }
      });

      next();
    } catch (error) {
      next(error);
    }
  };
}
