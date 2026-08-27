import { z } from "zod";

export const chatSchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, "Message is required")
    .max(4000, "Message must be 4000 characters or less"),

  conversationId: z.string().trim().min(1).optional(),
});

export type ChatInput = z.infer<typeof chatSchema>;
