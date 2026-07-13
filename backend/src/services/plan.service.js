import { planRepository } from '../repositories/plan.repository.js';
import { ApiError } from '../utils/ApiError.js';

export const planService = {
  async listActivePlans() {
    return planRepository.findActive();
  },
  async listAllPlans() {
    return planRepository.findAll();
  },
  async createPlan(data) {
    return planRepository.create(data);
  },
  async updatePlan(id, data) {
    const plan = await planRepository.updateById(id, data);
    if (!plan) throw ApiError.notFound('Plan not found');
    return plan;
  },
  async deletePlan(id) {
    const plan = await planRepository.deleteById(id);
    if (!plan) throw ApiError.notFound('Plan not found');
  },
};
