import { Plan } from '../models/Plan.model.js';

export const planRepository = {
  async create(data) {
    return Plan.create(data);
  },
  async findActive() {
    return Plan.find({ isActive: true }).sort('sortOrder priceUSD');
  },
  async findAll() {
    return Plan.find().sort('sortOrder priceUSD');
  },
  async findById(id) {
    return Plan.findById(id);
  },
  async findBySlug(slug) {
    return Plan.findOne({ slug, isActive: true });
  },
  async updateById(id, update) {
    return Plan.findByIdAndUpdate(id, update, { new: true, runValidators: true });
  },
  async deleteById(id) {
    return Plan.findByIdAndDelete(id);
  },
};
