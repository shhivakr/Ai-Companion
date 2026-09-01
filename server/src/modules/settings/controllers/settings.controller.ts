import type { Request, Response } from "express";

import type { AuthenticatedRequest } from "../../../middleware/auth.middleware.js";

import { getSettings, updateSettings } from "../services/settings.service";

import { updateSettingsSchema } from "../validation/settings.validation";

function getUserId(req: Request): string {
  const userId = (req as AuthenticatedRequest).userId;

  if (!userId) {
    throw new Error("Authenticated user not found");
  }

  return userId;
}

export async function getSettingsController(req: Request, res: Response) {
  try {
    const userId = getUserId(req);

    const settings = await getSettings(userId);

    return res.status(200).json({
      settings,
    });
  } catch (error) {
    console.error("Get settings error:", error);

    return res.status(500).json({
      message: "Failed to fetch settings",
    });
  }
}

export async function updateSettingsController(req: Request, res: Response) {
  const result = updateSettingsSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Invalid settings data",
      errors: result.error.flatten(),
    });
  }

  try {
    const userId = getUserId(req);

    const settings = await updateSettings(userId, result.data);

    return res.status(200).json({
      message: "Settings updated successfully",
      settings,
    });
  } catch (error) {
    console.error("Update settings error:", error);

    return res.status(500).json({
      message: "Failed to update settings",
    });
  }
}
