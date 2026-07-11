import { resumeRepository } from '../repositories/resume.repository.js';
import { resumeVersionRepository } from '../repositories/resumeVersion.repository.js';
import { ApiError } from '../utils/ApiError.js';

const SNAPSHOT_FIELDS = ['title', 'personalInfo', 'professionalSummary', 'experience', 'education', 'skills', 'sectionOrder'];

function extractSnapshot(resumeDoc) {
  const obj = resumeDoc.toObject();
  const snapshot = {};
  SNAPSHOT_FIELDS.forEach((f) => (snapshot[f] = obj[f]));
  return snapshot;
}

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

  async updateResume(userId, resumeId, data, { saveVersion = false, changeNote } = {}) {
    const resume = await resumeRepository.findByIdAndUser(resumeId, userId);
    if (!resume) throw ApiError.notFound('Resume not found');

    if (saveVersion) {
      const nextVersionNumber = (await resumeVersionRepository.getLatestVersionNumber(resumeId)) + 1;
      await resumeVersionRepository.create({
        resume: resumeId,
        versionNumber: nextVersionNumber,
        snapshot: extractSnapshot(resume),
        createdBy: userId,
        changeNote,
      });
      await resumeRepository.updateById(resumeId, { currentVersion: nextVersionNumber });
    }

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

  async getPublicResumeBySlug(slug) {
    const resume = await resumeRepository.findByPublicSlug(slug);
    if (!resume) throw ApiError.notFound('This resume is not available or is no longer public');
    return resume;
  },

  async listVersions(userId, resumeId) {
    const resume = await resumeRepository.findByIdAndUser(resumeId, userId);
    if (!resume) throw ApiError.notFound('Resume not found');
    return resumeVersionRepository.findByResume(resumeId);
  },

  async restoreVersion(userId, resumeId, versionNumber) {
    const resume = await resumeRepository.findByIdAndUser(resumeId, userId);
    if (!resume) throw ApiError.notFound('Resume not found');

    const version = await resumeVersionRepository.findOne(resumeId, versionNumber);
    if (!version) throw ApiError.notFound('Version not found');

    const nextVersionNumber = (await resumeVersionRepository.getLatestVersionNumber(resumeId)) + 1;
    await resumeVersionRepository.create({
      resume: resumeId,
      versionNumber: nextVersionNumber,
      snapshot: extractSnapshot(resume),
      createdBy: userId,
      changeNote: `Auto-saved before restoring v${versionNumber}`,
    });

    return resumeRepository.updateById(resumeId, {
      ...version.snapshot,
      currentVersion: nextVersionNumber,
    });
  },
};
