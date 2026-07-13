import { User } from '../models/User.model.js';

export const userRepository = {
  async create(data) {
    return User.create(data);
  },

  async findByEmail(email, withPassword = false, withVerification = false) {
    const query = User.findOne({ email });
    if (withPassword) query.select('+password');
    if (withVerification) query.select('+emailVerificationToken +emailVerificationExpires');
    return query;
  },

  async findById(id, withPassword = false) {
    const query = User.findById(id);
    if (withPassword) query.select('+password');
    return query;
  },

  async findByEmailVerificationToken(token) {
    return User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() },
    }).select('+emailVerificationToken +emailVerificationExpires');
  },

  async findByPasswordResetToken(token) {
    return User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() },
    }).select('+passwordResetToken +passwordResetExpires');
  },

  async updateById(id, update) {
    return User.findByIdAndUpdate(id, update, { new: true, runValidators: true });
  },

  async addRefreshToken(id, token) {
    return User.findByIdAndUpdate(id, { $push: { refreshTokens: { token } } }, { new: true });
  },

  async removeRefreshToken(id, token) {
    return User.findByIdAndUpdate(id, { $pull: { refreshTokens: { token } } }, { new: true });
  },

  async findByRefreshToken(token) {
    return User.findOne({ 'refreshTokens.token': token }).select('+refreshTokens');
  },
};
