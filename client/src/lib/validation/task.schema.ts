import { z } from "zod";

export const taskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Task title is required")
    .max(200, "Task title must be 200 characters or less"),

  description: z
    .string()
    .trim()
    .max(1000, "Description must be 1000 characters or less")
    .optional()
    .or(z.literal("")),

  goal: z.string().optional().or(z.literal("")),

  priority: z.enum(["low", "medium", "high"]),

  dueDate: z.string().optional().or(z.literal("")),
});

export type TaskFormValues = z.infer<typeof taskSchema>;
