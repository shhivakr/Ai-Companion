import { z } from "zod";

export const timelineTypeSchema = z.enum([
  "all",
  "task",
  "goal",
  "checkin",
  "companion",
]);

export const timelineQuerySchema = z.object({
  type: timelineTypeSchema.default("all"),
});

export type TimelineQueryInput = z.infer<typeof timelineQuerySchema>;
