import { z } from "zod";

export const updateSettingsSchema = z
  .object({
    companionInsights: z.boolean().optional(),

    interactionStyle: z.enum(["balanced", "concise", "detailed"]).optional(),

    memoryEnabled: z.boolean().optional(),

    notifications: z.boolean().optional(),

    theme: z.enum(["system", "light", "dark"]).optional(),
  })
  .strict();

export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;
