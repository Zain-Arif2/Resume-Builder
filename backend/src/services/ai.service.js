import { getAIProvider } from '../providers/index.js';
import { resumePrompts } from '../prompts/resumePrompts.js';
import { AIHistory } from '../models/AIHistory.model.js';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';

async function runPrompt({ userId, resumeId, feature, prompt, options }) {
  const provider = getAIProvider();
  const result = await provider.generateCompletion(prompt, options);

  await AIHistory.create({
    user: userId,
    resume: resumeId,
    feature,
    provider: env.ai.provider,
    model: result.model,
    promptTokens: result.usage.promptTokens,
    completionTokens: result.usage.completionTokens,
    totalTokens: result.usage.totalTokens,
    durationMs: result.durationMs,
  });

  return result.content;
}

function parseJsonResponse(content) {
  try {
    const cleaned = content.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    throw ApiError.internal('Failed to parse AI response');
  }
}

export const aiService = {
  async generateProfessionalSummary(userId, { role, experienceSummary }) {
    const prompt = resumePrompts.professionalSummary({ role, experienceSummary });
    return runPrompt({ userId, feature: 'professionalSummary', prompt });
  },

  async improveExperience(userId, { position, company, bullets }) {
    const prompt = resumePrompts.improveExperience({ position, company, bullets });
    const content = await runPrompt({ userId, feature: 'improveExperience', prompt });
    return content.split('\n').map((l) => l.replace(/^[-*]\s*/, '').trim()).filter(Boolean);
  },

  async improveProjects(userId, { title, description }) {
    const prompt = resumePrompts.improveProjects({ title, description });
    const content = await runPrompt({ userId, feature: 'improveProjects', prompt });
    return content.split('\n').map((l) => l.replace(/^[-*]\s*/, '').trim()).filter(Boolean);
  },

  async improveSkills(userId, { role, currentSkills }) {
    const prompt = resumePrompts.improveSkills({ role, currentSkills });
    const content = await runPrompt({ userId, feature: 'improveSkills', prompt });
    return content.split(',').map((s) => s.trim()).filter(Boolean);
  },

  async generateCoverLetter(userId, { role, company, resumeSummary }) {
    const prompt = resumePrompts.coverLetter({ role, company, resumeSummary });
    return runPrompt({ userId, feature: 'coverLetter', prompt, options: { maxTokens: 500 } });
  },

  async analyzeATS(userId, { resumeText, jobDescription }) {
    const prompt = resumePrompts.atsAnalysis({ resumeText, jobDescription });
    const content = await runPrompt({ userId, feature: 'atsAnalysis', prompt, options: { temperature: 0.3 } });
    return parseJsonResponse(content);
  },

  async analyzeGeneralATS(userId, { resumeText }, resumeId) {
    const prompt = resumePrompts.generalAtsScore({ resumeText });
    const content = await runPrompt({
      userId,
      resumeId,
      feature: 'generalAtsScore',
      prompt,
      options: { temperature: 0.3 },
    });
    return parseJsonResponse(content);
  },

  async improveGrammar(userId, { text }) {
    const prompt = resumePrompts.grammarImprovement({ text });
    return runPrompt({ userId, feature: 'grammarImprovement', prompt, options: { temperature: 0.3 } });
  },

  async generateInterviewQuestions(userId, { role, resumeSummary }) {
    const prompt = resumePrompts.interviewQuestions({ role, resumeSummary });
    const content = await runPrompt({ userId, feature: 'interviewQuestions', prompt });
    return content.split('\n').map((l) => l.replace(/^\d+[.)]\s*/, '').trim()).filter(Boolean);
  },

  async suggestCareers(userId, { currentRole, skills }) {
    const prompt = resumePrompts.careerSuggestions({ currentRole, skills });
    const content = await runPrompt({ userId, feature: 'careerSuggestions', prompt });
    return content.split('\n').map((l) => l.replace(/^\d+[.)]\s*/, '').trim()).filter(Boolean);
  },
};
