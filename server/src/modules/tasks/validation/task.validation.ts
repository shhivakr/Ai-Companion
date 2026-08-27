import { z } from "zod";

const optionalObjectId = z
  .string()
  .trim()
  .refine((value) => /^[a-f\d]{24}$/i.test(value), "Invalid goal ID")
  .optional();

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

  goal: optionalObjectId,

  priority: z.enum(["low", "medium", "high"]).default("medium"),

  dueDate: z.coerce.date().optional(),
});

export const updateTaskSchema = createTaskSchema.partial().extend({
  status: z.enum(["pending", "completed"]).optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;

export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
