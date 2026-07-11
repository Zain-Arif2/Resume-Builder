import { z } from 'zod';

export const updateUserRoleSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({ role: z.enum(['user', 'admin']) }),
});

export const toggleUserActiveSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  body: z.object({ isActive: z.boolean() }),
});

export const userIdParamSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
});
