import { z } from 'zod';

export const professionalSummarySchema = z.object({
  body: z.object({
    role: z.string().trim().min(1),
    experienceSummary: z.string().trim().min(1),
  }),
});

export const improveExperienceSchema = z.object({
  body: z.object({
    position: z.string().trim().min(1),
    company: z.string().trim().min(1),
    bullets: z.array(z.string()).min(1),
  }),
});

export const improveProjectsSchema = z.object({
  body: z.object({
    title: z.string().trim().min(1),
    description: z.string().trim().min(1),
  }),
});

export const improveSkillsSchema = z.object({
  body: z.object({
    role: z.string().trim().min(1),
    currentSkills: z.array(z.string()).default([]),
  }),
});

export const coverLetterSchema = z.object({
  body: z.object({
    role: z.string().trim().min(1),
    company: z.string().trim().min(1),
    resumeSummary: z.string().trim().min(1),
  }),
});

export const atsAnalysisSchema = z.object({
  body: z.object({
    resumeText: z.string().trim().min(1),
    jobDescription: z.string().trim().min(1),
  }),
});

export const grammarSchema = z.object({
  body: z.object({
    text: z.string().trim().min(1),
  }),
});

export const interviewQuestionsSchema = z.object({
  body: z.object({
    role: z.string().trim().min(1),
    resumeSummary: z.string().trim().min(1),
  }),
});

export const careerSuggestionsSchema = z.object({
  body: z.object({
    currentRole: z.string().trim().min(1),
    skills: z.array(z.string()).default([]),
  }),
});
