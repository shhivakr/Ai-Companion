import { z } from "zod";

const memoryCategories = [
  "working_style",
  "project",
  "focus",
  "preference",
] as const;

const memorySources = [
  "conversation",
  "checkin",
  "goal",
  "task",
  "manual",
] as const;

export const createMemorySchema = z.object({
  title: z.string().trim().min(1).max(200),
  content: z.string().trim().min(1).max(2000),
  category: z.enum(memoryCategories),
  source: z.enum(memorySources).default("manual"),
  importance: z.number().int().min(1).max(5).default(3),
});

export const updateMemorySchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  content: z.string().trim().min(1).max(2000).optional(),
  category: z.enum(memoryCategories).optional(),
  source: z.enum(memorySources).optional(),
  importance: z.number().int().min(1).max(5).optional(),
});

export const memoryIdSchema = z.object({
  id: z.string().min(1),
});

export const memoryQuerySchema = z.object({
  category: z.enum(memoryCategories).optional(),
  source: z.enum(memorySources).optional(),
});

export type CreateMemoryInput = z.infer<typeof createMemorySchema>;
export type UpdateMemoryInput = z.infer<typeof updateMemorySchema>;
export type MemoryQueryInput = z.infer<typeof memoryQuerySchema>;
