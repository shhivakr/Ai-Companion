import { z } from "zod";

export const memoryCategorySchema = z.enum([
  "working_style",
  "project",
  "focus",
  "preference",
]);

export const memoryFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required.")
    .max(200, "Title must be 200 characters or less."),

  content: z
    .string()
    .trim()
    .min(1, "Content is required.")
    .max(2000, "Content must be 2000 characters or less."),

  category: memoryCategorySchema,

  importance: z
    .number()
    .int()
    .min(1, "Importance must be at least 1.")
    .max(5, "Importance must be at most 5."),
});

export type MemoryFormValues = z.infer<typeof memoryFormSchema>;
