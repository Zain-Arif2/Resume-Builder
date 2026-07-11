import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { aiController } from '../../controllers/ai.controller.js';
import { authenticate } from '../../middleware/authenticate.js';
import { validate } from '../../middleware/validate.js';
import {
  professionalSummarySchema,
  improveExperienceSchema,
  improveProjectsSchema,
  improveSkillsSchema,
  coverLetterSchema,
  atsAnalysisSchema,
  grammarSchema,
  interviewQuestionsSchema,
  careerSuggestionsSchema,
} from '../../validators/ai.validator.js';

const router = Router();

const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many AI requests, please slow down.' },
});

router.use(authenticate, aiLimiter);

router.post('/professional-summary', validate(professionalSummarySchema), aiController.professionalSummary);
router.post('/improve-experience', validate(improveExperienceSchema), aiController.improveExperience);
router.post('/improve-projects', validate(improveProjectsSchema), aiController.improveProjects);
router.post('/improve-skills', validate(improveSkillsSchema), aiController.improveSkills);
router.post('/cover-letter', validate(coverLetterSchema), aiController.coverLetter);
router.post('/ats-analysis', validate(atsAnalysisSchema), aiController.atsAnalysis);
router.post('/grammar', validate(grammarSchema), aiController.grammar);
router.post('/interview-questions', validate(interviewQuestionsSchema), aiController.interviewQuestions);
router.post('/career-suggestions', validate(careerSuggestionsSchema), aiController.careerSuggestions);

export default router;
