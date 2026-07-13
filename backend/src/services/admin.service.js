import { adminRepository } from '../repositories/admin.repository.js';
import { creditService } from '../services/credit.service.js';
import { ApiError } from '../utils/ApiError.js';
import { ROLES } from '../constants/index.js';

export const adminService = {
  async listUsers(query) {
    return adminRepository.findUsers(query);
  },

  async updateUserRole(userId, role) {
    if (!Object.values(ROLES).includes(role)) {
      throw ApiError.badRequest('Invalid role');
    }
    const user = await adminRepository.updateUser(userId, { role });
    if (!user) throw ApiError.notFound('User not found');
    return user;
  },

  async toggleUserActive(userId, isActive) {
    const user = await adminRepository.updateUser(userId, { isActive });
    if (!user) throw ApiError.notFound('User not found');
    return user;
  },

  async deleteUser(userId) {
    const user = await adminRepository.findUserById(userId);
    if (!user) throw ApiError.notFound('User not found');
    await adminRepository.deleteUser(userId);
  },

  // ─── Credit / Plan Management ─────────────────────────
  async increaseUserCredits(userId, amount) {
    return creditService.increaseCredits(userId, amount);
  },

  async resetUserCredits(userId, amount) {
    return creditService.resetCredits(userId, amount);
  },

  async upgradeUserToPro(userId) {
    return creditService.upgradeToPro(userId);
  },

  async downgradeUserToFree(userId) {
    return creditService.downgradeToFree(userId);
  },

  async getAnalytics() {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      activeUsers7d,
      totalResumes,
      publicResumes,
      totalAIRequests,
      totalGeneratedResumes,
      proUsers,
      aiUsageByFeature,
      signupsLast7Days,
    ] = await Promise.all([
      adminRepository.countUsers(),
      adminRepository.countActiveUsersSince(sevenDaysAgo),
      adminRepository.countResumes(),
      adminRepository.countPublicResumes(),
      adminRepository.countAIRequests(),
      adminRepository.sumTotalGenerated(),
      adminRepository.countProUsers(),
      adminRepository.aiUsageByFeature(),
      adminRepository.signupsLast7Days(),
    ]);

    return {
      totalUsers,
      activeUsers7d,
      totalResumes,
      publicResumes,
      totalAIRequests,
      totalGeneratedResumes,
      proUsers,
      aiUsageByFeature,
      signupsLast7Days,
    };
  },

  async getSystemLogs() {
    return adminRepository.recentAIHistory(50);
  },
};
