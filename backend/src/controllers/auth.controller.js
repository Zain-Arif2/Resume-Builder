import { authService } from '../services/auth.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { setAuthCookies, clearAuthCookies } from '../utils/cookieUtils.js';
import { COOKIE_NAMES } from '../constants/index.js';

export const authController = {
  register: asyncHandler(async (req, res) => {
    const user = await authService.register(req.body);
    return new ApiResponse(201, { user: user.toSafeObject() }, 'Registration successful').send(res);
  }),

  login: asyncHandler(async (req, res) => {
    const { user, accessToken, refreshToken } = await authService.login(req.body);
    setAuthCookies(res, { accessToken, refreshToken });
    return new ApiResponse(200, { user: user.toSafeObject() }, 'Login successful').send(res);
  }),

  refreshToken: asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies[COOKIE_NAMES.REFRESH_TOKEN];
    const { user, accessToken, refreshToken } = await authService.refreshAccessToken(incomingRefreshToken);
    setAuthCookies(res, { accessToken, refreshToken });
    return new ApiResponse(200, { user: user.toSafeObject() }, 'Token refreshed').send(res);
  }),

  logout: asyncHandler(async (req, res) => {
    const refreshToken = req.cookies[COOKIE_NAMES.REFRESH_TOKEN];
    await authService.logout(req.user?.sub, refreshToken);
    clearAuthCookies(res);
    return new ApiResponse(200, null, 'Logged out successfully').send(res);
  }),

  getMe: asyncHandler(async (req, res) => {
    return new ApiResponse(200, { user: req.user }, 'Current user fetched').send(res);
  }),
};