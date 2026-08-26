import { z } from "zod";

export const createTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(200, "Title must be 200 characters or less"),

  description: z
    .string()
    .trim()
    .max(1000, "Description must be 1000 characters or less")
    .optional(),

  goal: z.string().trim().optional(),

  priority: z.enum(["low", "medium", "high"]).default("medium"),

  dueDate: z.coerce.date().optional(),
});

export const updateTaskSchema = createTaskSchema.partial().extend({
  status: z.enum(["pending", "completed"]).optional(),

  priority: z.enum(["low", "medium", "high"]).optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;

export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
