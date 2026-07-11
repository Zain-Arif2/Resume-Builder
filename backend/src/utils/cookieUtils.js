import { env } from '../config/env.js';
import { COOKIE_NAMES } from '../constants/index.js';

const baseCookieOptions = {
  httpOnly: true,
  secure: env.cookie.secure, // true in production (HTTPS)
  sameSite: env.cookie.secure ? 'strict' : 'lax',
};

export function setAuthCookies(res, { accessToken, refreshToken }) {
  res.cookie(COOKIE_NAMES.ACCESS_TOKEN, accessToken, {
    ...baseCookieOptions,
    maxAge: 15 * 60 * 1000, // 15 min
  });

  res.cookie(COOKIE_NAMES.REFRESH_TOKEN, refreshToken, {
    ...baseCookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 din
  });
}

export function clearAuthCookies(res) {
  res.clearCookie(COOKIE_NAMES.ACCESS_TOKEN, baseCookieOptions);
  res.clearCookie(COOKIE_NAMES.REFRESH_TOKEN, baseCookieOptions);
}