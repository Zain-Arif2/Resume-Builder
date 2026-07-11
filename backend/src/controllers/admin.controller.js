import { adminService } from '../services/admin.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const adminController = {
  listUsers: asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 15;
    const search = req.query.search || '';
    const result = await adminService.listUsers({ page, limit, search });
    return new ApiResponse(200, result, 'Users fetched').send(res);
  }),

  updateUserRole: asyncHandler(async (req, res) => {
    const user = await adminService.updateUserRole(req.params.id, req.body.role);
    return new ApiResponse(200, { user }, 'User role updated').send(res);
  }),

  toggleUserActive: asyncHandler(async (req, res) => {
    const user = await adminService.toggleUserActive(req.params.id, req.body.isActive);
    return new ApiResponse(200, { user }, 'User status updated').send(res);
  }),

  deleteUser: asyncHandler(async (req, res) => {
    await adminService.deleteUser(req.params.id);
    return new ApiResponse(200, null, 'User deleted').send(res);
  }),

  getAnalytics: asyncHandler(async (req, res) => {
    const analytics = await adminService.getAnalytics();
    return new ApiResponse(200, { analytics }, 'Analytics fetched').send(res);
  }),

  getSystemLogs: asyncHandler(async (req, res) => {
    const logs = await adminService.getSystemLogs();
    return new ApiResponse(200, { logs }, 'System logs fetched').send(res);
  }),
};
