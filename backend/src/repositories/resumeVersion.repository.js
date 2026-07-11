import { ResumeVersion } from '../models/ResumeVersion.model.js';

export const resumeVersionRepository = {
  async create(data) {
    return ResumeVersion.create(data);
  },
  async findByResume(resumeId) {
    return ResumeVersion.find({ resume: resumeId }).sort('-versionNumber').limit(20);
  },
  async findOne(resumeId, versionNumber) {
    return ResumeVersion.findOne({ resume: resumeId, versionNumber });
  },
  async getLatestVersionNumber(resumeId) {
    const latest = await ResumeVersion.findOne({ resume: resumeId }).sort('-versionNumber');
    return latest ? latest.versionNumber : 0;
  },
};
