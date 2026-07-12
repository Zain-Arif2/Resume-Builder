import { z } from 'zod';

const experienceItem = z.object({
  company: z.string().trim().min(1),
  position: z.string().trim().min(1),
  location: z.string().trim().optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional().nullable(),
  isCurrent: z.boolean().optional(),
  description: z.string().optional(),
  bullets: z.array(z.string()).optional(),
});

const educationItem = z.object({
  institution: z.string().trim().min(1),
  degree: z.string().trim().min(1),
  fieldOfStudy: z.string().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  grade: z.string().optional(),
  description: z.string().optional(),
});

const skillItem = z.object({
  name: z.string().trim().min(1),
  level: z.enum(['beginner', 'intermediate', 'advanced', 'expert']).optional(),
});

const personalInfo = z
  .object({
    fullName: z.string().trim().optional(),
    jobTitle: z.string().trim().optional(),
    email: z.string().trim().optional(),
    phone: z.string().trim().optional(),
    address: z.string().trim().optional(),
    city: z.string().trim().optional(),
    country: z.string().trim().optional(),
    website: z.string().trim().optional(),
    linkedin: z.string().trim().optional(),
    github: z.string().trim().optional(),
    photoUrl: z.string().trim().optional(),
  })
  .partial();

export const createResumeSchema = z.object({
  body: z.object({
    title: z.string().trim().min(1).max(150).optional(),
  }),
});

export const updateResumeSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({
    title: z.string().trim().min(1).max(150).optional(),
    template: z.enum(['classic', 'creative', 'executive', 'minimal']).optional(),
    personalInfo: personalInfo.optional(),
    professionalSummary: z.string().optional(),
    experience: z.array(experienceItem).optional(),
    education: z.array(educationItem).optional(),
    skills: z.array(skillItem).optional(),
    sectionOrder: z.array(z.string()).optional(),
    isPublic: z.boolean().optional(),
  }),
});

export const resumeIdParamSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
});
