import crypto from 'crypto';
import { userRepository } from '../repositories/user.repository.js';
import { ApiError } from '../utils/ApiError.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/tokenUtils.js';
import { hashToken } from '../utils/hash.js';
import { sendEmail } from '../utils/email.js';
import { env } from '../config/env.js';
import { authLogger } from '../config/logger.js';

function buildTokenPayload(user) {
  return { sub: user._id.toString(), role: user.role };
}

export const authService = {
  async register({ name, email, password }) {
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw ApiError.conflict('An account with this email already exists');
    }

    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
    const emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000;

    const user = await userRepository.create({
      name,
      email,
      password,
      emailVerificationToken,
      emailVerificationExpires,
    });

    authLogger.info({ userId: user._id }, 'New user registered');
    return user;
  },

  async login({ email, password }) {
    const user = await userRepository.findByEmail(email, true);
    if (!user) throw ApiError.unauthorized('Invalid email or password');
    if (!user.isActive) throw ApiError.forbidden('This account has been deactivated');

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) throw ApiError.unauthorized('Invalid email or password');

    const payload = buildTokenPayload(user);
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    await userRepository.addRefreshToken(user._id, refreshToken);
    await userRepository.updateById(user._id, { lastLoginAt: new Date() });

    authLogger.info({ userId: user._id }, 'User logged in');
    return { user, accessToken, refreshToken };
  },

  async refreshAccessToken(refreshToken) {
    if (!refreshToken) throw ApiError.unauthorized('Refresh token missing');

    let decoded;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch {
      throw ApiError.unauthorized('Invalid or expired refresh token');
    }

    const user = await userRepository.findByRefreshToken(refreshToken);
    if (!user || user._id.toString() !== decoded.sub) {
      throw ApiError.unauthorized('Refresh token not recognized');
    }

    const payload = buildTokenPayload(user);
    const newAccessToken = generateAccessToken(payload);
    const newRefreshToken = generateRefreshToken(payload);

    await userRepository.removeRefreshToken(user._id, refreshToken);
    await userRepository.addRefreshToken(user._id, newRefreshToken);

    return { user, accessToken: newAccessToken, refreshToken: newRefreshToken };
  },

  async logout(userId, refreshToken) {
    if (refreshToken) {
      await userRepository.removeRefreshToken(userId, refreshToken);
    }
    authLogger.info({ userId }, 'User logged out');
  },

  async forgotPassword(email) {
    const user = await userRepository.findByEmail(email);
    if (!user) return; // Don't reveal whether the account exists

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = hashToken(resetToken);
    const passwordResetExpires = Date.now() + 60 * 60 * 1000;

    await userRepository.updateById(user._id, {
      passwordResetToken: hashedToken,
      passwordResetExpires,
    });

    const resetUrl = `${env.clientUrl}/reset-password/${resetToken}`;

    await sendEmail({
      to: user.email,
      subject: 'Reset your password',
      text: `Reset your password using this link (valid 1 hour): ${resetUrl}`,
    });

    authLogger.info({ userId: user._id }, 'Password reset requested');
  },

  async resetPassword(token, newPassword) {
    const hashedToken = hashToken(token);
    const user = await userRepository.findByPasswordResetToken(hashedToken);
    if (!user) throw ApiError.badRequest('Reset token is invalid or has expired');

    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    authLogger.info({ userId: user._id }, 'Password reset successful');
  },

  async updateProfile(userId, { name }) {
    const user = await userRepository.updateById(userId, { name });
    if (!user) throw ApiError.notFound('User not found');
    return user;
  },
};
