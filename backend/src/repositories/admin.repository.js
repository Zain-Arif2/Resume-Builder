import { User } from '../models/User.model.js';
import { Resume } from '../models/Resume.model.js';
import { AIHistory } from '../models/AIHistory.model.js';

export const adminRepository = {
  async findUsers({ page = 1, limit = 15, search = '' }) {
    const query = search
      ? { $or: [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }] }
      : {};
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find(query).select('-password').sort('-createdAt').skip(skip).limit(limit),
      User.countDocuments(query),
    ]);

    return { users, total, page, pages: Math.ceil(total / limit) || 1 };
  },

  async findUserById(id) {
    return User.findById(id).select('-password');
  },

  async updateUser(id, update) {
    return User.findByIdAndUpdate(id, update, { new: true, runValidators: true }).select('-password');
  },

  async deleteUser(id) {
    return User.findByIdAndDelete(id);
  },

  async countUsers() {
    return User.countDocuments();
  },

  async countActiveUsersSince(date) {
    return User.countDocuments({ lastLoginAt: { $gte: date } });
  },

  async countResumes() {
    return Resume.countDocuments();
  },

  async countPublicResumes() {
    return Resume.countDocuments({ isPublic: true });
  },

  async countAIRequests() {
    return AIHistory.countDocuments();
  },

  async sumTotalGenerated() {
    const result = await User.aggregate([{ $group: { _id: null, total: { $sum: '$totalResumeGenerated' } } }]);
    return result[0]?.total || 0;
  },

  async countProUsers() {
    return User.countDocuments({ plan: 'pro' });
  },

  async aiUsageByFeature() {
    return AIHistory.aggregate([
      { $group: { _id: '$feature', count: { $sum: 1 }, totalTokens: { $sum: '$totalTokens' } } },
      { $sort: { count: -1 } },
    ]);
  },

  async signupsLast7Days() {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return User.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);
  },

  async recentAIHistory(limit = 50) {
    return AIHistory.find().sort('-createdAt').limit(limit).populate('user', 'name email');
  },
};
