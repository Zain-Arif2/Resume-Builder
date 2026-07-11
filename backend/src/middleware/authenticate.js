import { verifyAccessToken } from '../utils/tokenUtils.js';
import { ApiError } from '../utils/ApiError.js';
import { COOKIE_NAMES } from '../constants/index.js';

export function authenticate(req, res, next) {
  const token = req.cookies[COOKIE_NAMES.ACCESS_TOKEN];

  if (!token) {
    return next(ApiError.unauthorized('Access token missing, please log in'));
  }

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded; // { sub, role, iat, exp }
    next();
  } catch {
    return next(ApiError.unauthorized('Invalid or expired access token'));
  }
}