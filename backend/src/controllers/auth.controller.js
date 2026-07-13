import { authService } from '../services/auth.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { setAuthCookies, clearAuthCookies } from '../utils/cookieUtils.js';
import { COOKIE_NAMES } from '../constants/index.js';
import { User } from '../models/User.model.js';
import { ApiError } from '../utils/ApiError.js';

export const authController = {
  register: asyncHandler(async (req, res) => {
    const user = await authService.register(req.body);
    return new ApiResponse(201, { email: user.email }, 'Registration successful, please verify your email').send(res);
  }),

  verifyOtp: asyncHandler(async (req, res) => {
    await authService.verifyOtp(req.body.email, req.body.otp);
    return new ApiResponse(200, null, 'Email verified successfully, you can now log in').send(res);
  }),

  resendOtp: asyncHandler(async (req, res) => {
    await authService.resendOtp(req.body.email);
    return new ApiResponse(200, null, 'A new verification code has been sent').send(res);
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
    // req.user only holds the JWT payload (sub, role). Credits/plan live in the DB
    // and change over time, so always return the fresh document here.
    const user = await User.findById(req.user.sub);
    if (!user) throw ApiError.notFound('User not found');
    return new ApiResponse(200, { user: user.toSafeObject() }, 'Current user fetched').send(res);
  }),

  forgotPassword: asyncHandler(async (req, res) => {
    await authService.forgotPassword(req.body.email);
    return new ApiResponse(200, null, 'If an account exists, a reset link has been sent').send(res);
  }),

  resetPassword: asyncHandler(async (req, res) => {
    await authService.resetPassword(req.params.token, req.body.password);
    return new ApiResponse(200, null, 'Password reset successful').send(res);
  }),

  updateProfile: asyncHandler(async (req, res) => {
    const user = await authService.updateProfile(req.user.sub, req.body);
    return new ApiResponse(200, { user: user.toSafeObject() }, 'Profile updated').send(res);
  }),
};
