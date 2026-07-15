import { aiService } from '../services/ai.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const aiController = {
  professionalSummary: asyncHandler(async (req, res) => {
    const summary = await aiService.generateProfessionalSummary(req.user.sub, req.body);
    return new ApiResponse(200, { summary }, 'Summary generated').send(res);
  }),

  improveExperience: asyncHandler(async (req, res) => {
    const bullets = await aiService.improveExperience(req.user.sub, req.body);
    return new ApiResponse(200, { bullets }, 'Experience improved').send(res);
  }),

  improveProjects: asyncHandler(async (req, res) => {
    const bullets = await aiService.improveProjects(req.user.sub, req.body);
    return new ApiResponse(200, { bullets }, 'Project description improved').send(res);
  }),

  improveSkills: asyncHandler(async (req, res) => {
    const skills = await aiService.improveSkills(req.user.sub, req.body);
    return new ApiResponse(200, { skills }, 'Skills improved').send(res);
  }),

  coverLetter: asyncHandler(async (req, res) => {
    const coverLetter = await aiService.generateCoverLetter(req.user.sub, req.body);
    return new ApiResponse(200, { coverLetter }, 'Cover letter generated').send(res);
  }),

  atsAnalysis: asyncHandler(async (req, res) => {
    const analysis = await aiService.analyzeATS(req.user.sub, req.body);
    return new ApiResponse(200, { analysis }, 'ATS analysis complete').send(res);
  }),

  generalAtsScore: asyncHandler(async (req, res) => {
    const { resumeId, ...body } = req.body;
    const analysis = await aiService.analyzeGeneralATS(req.user.sub, body, resumeId);
    return new ApiResponse(200, { analysis }, 'Resume score calculated').send(res);
  }),

  grammar: asyncHandler(async (req, res) => {
    const correctedText = await aiService.improveGrammar(req.user.sub, req.body);
    return new ApiResponse(200, { correctedText }, 'Grammar improved').send(res);
  }),

  interviewQuestions: asyncHandler(async (req, res) => {
    const questions = await aiService.generateInterviewQuestions(req.user.sub, req.body);
    return new ApiResponse(200, { questions }, 'Interview questions generated').send(res);
  }),

  careerSuggestions: asyncHandler(async (req, res) => {
    const suggestions = await aiService.suggestCareers(req.user.sub, req.body);
    return new ApiResponse(200, { suggestions }, 'Career suggestions generated').send(res);
  }),
};
