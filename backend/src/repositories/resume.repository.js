import { Resume } from '../models/Resume.model.js';

export const resumeRepository = {
  async create(data) {
    return Resume.create(data);
  },
  async findByIdAndUser(id, userId) {
    return Resume.findOne({ _id: id, user: userId });
  },
  async findAllByUser(userId, { page = 1, limit = 10, sort = '-updatedAt' } = {}) {
    const skip = (page - 1) * limit;
    const [resumes, total] = await Promise.all([
      Resume.find({ user: userId }).sort(sort).skip(skip).limit(limit),
      Resume.countDocuments({ user: userId }),
    ]);
    return { resumes, total, page, pages: Math.ceil(total / limit) || 1 };
  },
  async updateById(id, update) {
    return Resume.findByIdAndUpdate(id, { ...update, lastEditedAt: new Date() }, { new: true, runValidators: true });
  },
  async deleteById(id) {
    return Resume.findByIdAndDelete(id);
  },
  async findByPublicSlug(slug) {
    return Resume.findOne({ publicSlug: slug, isPublic: true });
  },
};
