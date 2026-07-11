import { resumeRepository } from '../repositories/resume.repository.js';
import { ApiError } from '../utils/ApiError.js';

export const resumeService = {
  async createResume(userId, data) {
    return resumeRepository.create({ ...data, user: userId });
  },

  async getResumeById(userId, resumeId) {
    const resume = await resumeRepository.findByIdAndUser(resumeId, userId);
    if (!resume) throw ApiError.notFound('Resume not found');
    return resume;
  },

  async listResumes(userId, query) {
    return resumeRepository.findAllByUser(userId, query);
  },

  async updateResume(userId, resumeId, data) {
    const resume = await resumeRepository.findByIdAndUser(resumeId, userId);
    if (!resume) throw ApiError.notFound('Resume not found');
    return resumeRepository.updateById(resumeId, data);
  },

  async deleteResume(userId, resumeId) {
    const resume = await resumeRepository.findByIdAndUser(resumeId, userId);
    if (!resume) throw ApiError.notFound('Resume not found');
    await resumeRepository.deleteById(resumeId);
  },

  async duplicateResume(userId, resumeId) {
    const resume = await resumeRepository.findByIdAndUser(resumeId, userId);
    if (!resume) throw ApiError.notFound('Resume not found');

    const clone = resume.toObject();
    delete clone._id;
    delete clone.createdAt;
    delete clone.updatedAt;
    delete clone.publicSlug;
    clone.title = `${clone.title} (Copy)`;
    clone.isPublic = false;

    return resumeRepository.create(clone);
  },
};
