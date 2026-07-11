import { resumeService } from '../services/resume.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const resumeController = {
  create: asyncHandler(async (req, res) => {
    const resume = await resumeService.createResume(req.user.sub, req.body);
    return new ApiResponse(201, { resume }, 'Resume created').send(res);
  }),

  list: asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const result = await resumeService.listResumes(req.user.sub, { page, limit });
    return new ApiResponse(200, result, 'Resumes fetched').send(res);
  }),

  getById: asyncHandler(async (req, res) => {
    const resume = await resumeService.getResumeById(req.user.sub, req.params.id);
    return new ApiResponse(200, { resume }, 'Resume fetched').send(res);
  }),

  update: asyncHandler(async (req, res) => {
    const saveVersion = req.query.saveVersion === 'true';
    const resume = await resumeService.updateResume(req.user.sub, req.params.id, req.body, { saveVersion });
    return new ApiResponse(200, { resume }, 'Resume updated').send(res);
  }),

  remove: asyncHandler(async (req, res) => {
    await resumeService.deleteResume(req.user.sub, req.params.id);
    return new ApiResponse(200, null, 'Resume deleted').send(res);
  }),

  duplicate: asyncHandler(async (req, res) => {
    const resume = await resumeService.duplicateResume(req.user.sub, req.params.id);
    return new ApiResponse(201, { resume }, 'Resume duplicated').send(res);
  }),

  getPublicBySlug: asyncHandler(async (req, res) => {
    const resume = await resumeService.getPublicResumeBySlug(req.params.slug);
    return new ApiResponse(200, { resume }, 'Public resume fetched').send(res);
  }),

  listVersions: asyncHandler(async (req, res) => {
    const versions = await resumeService.listVersions(req.user.sub, req.params.id);
    return new ApiResponse(200, { versions }, 'Versions fetched').send(res);
  }),

  restoreVersion: asyncHandler(async (req, res) => {
    const resume = await resumeService.restoreVersion(req.user.sub, req.params.id, parseInt(req.params.versionNumber, 10));
    return new ApiResponse(200, { resume }, 'Version restored').send(res);
  }),
};
