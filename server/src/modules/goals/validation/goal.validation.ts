import { z } from "zod";

export const createGoalSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(150, "Title must be 150 characters or less"),

  description: z
    .string()
    .trim()
    .max(1000, "Description must be 1000 characters or less")
    .optional(),

  category: z
    .string()
    .trim()
    .max(50, "Category must be 50 characters or less")
    .optional(),

  milestone: z
    .string()
    .trim()
    .max(200, "Milestone must be 200 characters or less")
    .optional(),

  nextAction: z
    .string()
    .trim()
    .max(300, "Next action must be 300 characters or less")
    .optional(),

  targetDate: z.coerce.date().optional(),
});

export const updateGoalSchema = createGoalSchema.partial().extend({
  status: z.enum(["active", "completed", "paused"]).optional(),

  progress: z.number().min(0).max(100).optional(),
});

export type CreateGoalInput = z.infer<typeof createGoalSchema>;

export type UpdateGoalInput = z.infer<typeof updateGoalSchema>;
