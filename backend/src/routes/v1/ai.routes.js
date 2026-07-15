import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { aiController } from '../../controllers/ai.controller.js';
import { authenticate } from '../../middleware/authenticate.js';
import { checkResumeCredits } from '../../middleware/checkResumeCredits.js';
import { validate } from '../../middleware/validate.js';
import {
  professionalSummarySchema,
  improveExperienceSchema,
  improveProjectsSchema,
  improveSkillsSchema,
  coverLetterSchema,
  atsAnalysisSchema,
  generalAtsSchema,
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

// Credit-gated: these count against the free plan's generation limit
router.post('/professional-summary', checkResumeCredits(), validate(professionalSummarySchema), aiController.professionalSummary);
router.post('/improve-experience', checkResumeCredits(), validate(improveExperienceSchema), aiController.improveExperience);
router.post('/improve-projects', checkResumeCredits(), validate(improveProjectsSchema), aiController.improveProjects);
router.post('/improve-skills', checkResumeCredits(), validate(improveSkillsSchema), aiController.improveSkills);
router.post('/cover-letter', checkResumeCredits(), validate(coverLetterSchema), aiController.coverLetter);
router.post('/ats-analysis', checkResumeCredits(), validate(atsAnalysisSchema), aiController.atsAnalysis);

// Not credit-gated: quick, low-cost checks users should be able to run freely
router.post('/general-ats-score', validate(generalAtsSchema), aiController.generalAtsScore);
router.post('/grammar', validate(grammarSchema), aiController.grammar);
router.post('/interview-questions', validate(interviewQuestionsSchema), aiController.interviewQuestions);
router.post('/career-suggestions', validate(careerSuggestionsSchema), aiController.careerSuggestions);

export default router;
