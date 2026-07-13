import { z } from 'zod';

export const createPlanSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1),
    slug: z.string().trim().toLowerCase().min(1).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, and hyphens only'),
    description: z.string().trim().optional(),
    priceUSD: z.number().min(0),
    type: z.enum(['subscription', 'one_time']),
    credits: z.number().int().positive().nullable().optional(),
    interval: z.enum(['month', 'year']).nullable().optional(),
    stripePriceId: z.string().trim().optional(),
    isActive: z.boolean().optional(),
    sortOrder: z.number().optional(),
  }),
});

export const updatePlanSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({
    name: z.string().trim().min(1).optional(),
    description: z.string().trim().optional(),
    priceUSD: z.number().min(0).optional(),
    type: z.enum(['subscription', 'one_time']).optional(),
    credits: z.number().int().positive().nullable().optional(),
    interval: z.enum(['month', 'year']).nullable().optional(),
    stripePriceId: z.string().trim().optional(),
    isActive: z.boolean().optional(),
    sortOrder: z.number().optional(),
  }),
});

export const planIdParamSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
});
