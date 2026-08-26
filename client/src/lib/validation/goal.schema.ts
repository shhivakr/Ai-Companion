import { z } from "zod";

export const goalFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Goal title is required")
    .max(150, "Goal title must be 150 characters or less"),

  description: z
    .string()
    .trim()
    .max(1000, "Description must be 1000 characters or less")
    .optional()
    .or(z.literal("")),

  category: z
    .string()
    .trim()
    .max(50, "Category must be 50 characters or less")
    .optional()
    .or(z.literal("")),

  milestone: z
    .string()
    .trim()
    .max(200, "Milestone must be 200 characters or less")
    .optional()
    .or(z.literal("")),

  nextAction: z
    .string()
    .trim()
    .max(300, "Next action must be 300 characters or less")
    .optional()
    .or(z.literal("")),

  targetDate: z.string().optional().or(z.literal("")),
});

export type GoalFormValues = z.infer<typeof goalFormSchema>;

export const goalEditSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Goal title is required")
    .max(150, "Goal title must be 150 characters or less"),

  description: z
    .string()
    .trim()
    .max(1000, "Description must be 1000 characters or less")
    .optional()
    .or(z.literal("")),

  category: z
    .string()
    .trim()
    .max(50, "Category must be 50 characters or less")
    .optional()
    .or(z.literal("")),

  milestone: z
    .string()
    .trim()
    .max(200, "Milestone must be 200 characters or less")
    .optional()
    .or(z.literal("")),

  nextAction: z
    .string()
    .trim()
    .max(300, "Next action must be 300 characters or less")
    .optional()
    .or(z.literal("")),

  targetDate: z.string().optional().or(z.literal("")),

  progress: z.number().min(0).max(100),

  status: z.enum(["active", "completed", "paused"]),
});

export type GoalEditFormValues = z.infer<typeof goalEditSchema>;
