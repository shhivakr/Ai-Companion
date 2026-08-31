import { z } from "zod";

export const createCheckInSchema = z.object({
  feeling: z.enum(["good", "okay", "low"]),

  energy: z.enum(["high", "medium", "low"]),

  focus: z.enum(["product_work", "client_work", "learning"]),

  note: z
    .string()
    .trim()
    .max(1000, "Note must be 1000 characters or less")
    .optional(),
});

export type CreateCheckInInput = z.infer<typeof createCheckInSchema>;
