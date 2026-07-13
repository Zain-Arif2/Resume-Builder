import { planService } from '../services/plan.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const planController = {
  listActive: asyncHandler(async (req, res) => {
    const plans = await planService.listActivePlans();
    return new ApiResponse(200, { plans }, 'Plans fetched').send(res);
  }),

  listAll: asyncHandler(async (req, res) => {
    const plans = await planService.listAllPlans();
    return new ApiResponse(200, { plans }, 'Plans fetched').send(res);
  }),

  create: asyncHandler(async (req, res) => {
    const plan = await planService.createPlan(req.body);
    return new ApiResponse(201, { plan }, 'Plan created').send(res);
  }),

  update: asyncHandler(async (req, res) => {
    const plan = await planService.updatePlan(req.params.id, req.body);
    return new ApiResponse(200, { plan }, 'Plan updated').send(res);
  }),

  remove: asyncHandler(async (req, res) => {
    await planService.deletePlan(req.params.id);
    return new ApiResponse(200, null, 'Plan deleted').send(res);
  }),
};
