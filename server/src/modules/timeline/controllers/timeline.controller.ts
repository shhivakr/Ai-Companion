import type { Request, Response } from "express";

import type { AuthenticatedRequest } from "../../../middleware/auth.middleware.js";

import { getTimeline } from "../services/timeline.service.js";
import { timelineQuerySchema } from "../schemas/timeline.schema.js";

function getUserId(req: Request): string {
  const userId = (req as AuthenticatedRequest).userId;

  if (!userId) {
    throw new Error("Authenticated user not found");
  }

  return userId;
}

export async function getTimelineController(req: Request, res: Response) {
  const result = timelineQuerySchema.safeParse(req.query);

  if (!result.success) {
    return res.status(400).json({
      message: "Invalid timeline query",
      errors: result.error.flatten(),
    });
  }

  try {
    const userId = getUserId(req);

    const timeline = await getTimeline(userId, result.data);

    return res.status(200).json({
      timeline,
    });
  } catch (error) {
    console.error("Get timeline error:", error);

    return res.status(500).json({
      message: "Failed to fetch timeline",
    });
  }
}
