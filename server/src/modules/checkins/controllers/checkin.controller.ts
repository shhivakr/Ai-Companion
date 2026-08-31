import type { Request, Response } from "express";

import type { AuthenticatedRequest } from "../../../middleware/auth.middleware.js";

import {
  createCheckIn,
  getCheckIns,
  getTodayCheckIn,
} from "../services/checkin.service.js";

import { createCheckInSchema } from "../schemas/checkin.schema.js";

function getUserId(req: Request): string {
  const userId = (req as AuthenticatedRequest).userId;

  if (!userId) {
    throw new Error("Authenticated user not found");
  }

  return userId;
}

export async function createCheckInController(req: Request, res: Response) {
  const result = createCheckInSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Invalid check-in data",
      errors: result.error.flatten(),
    });
  }

  try {
    const userId = getUserId(req);

    const checkIn = await createCheckIn(userId, result.data);

    return res.status(201).json({
      message: "Check-in created successfully",
      checkIn,
    });
  } catch (error) {
    console.error("Create check-in error:", error);

    return res.status(500).json({
      message: "Failed to create check-in",
    });
  }
}

export async function getCheckInsController(req: Request, res: Response) {
  try {
    const userId = getUserId(req);

    const checkIns = await getCheckIns(userId);

    return res.status(200).json({
      checkIns,
    });
  } catch (error) {
    console.error("Get check-ins error:", error);

    return res.status(500).json({
      message: "Failed to fetch check-ins",
    });
  }
}

export async function getTodayCheckInController(req: Request, res: Response) {
  try {
    const userId = getUserId(req);

    const checkIn = await getTodayCheckIn(userId);

    return res.status(200).json({
      checkIn,
    });
  } catch (error) {
    console.error("Get today's check-in error:", error);

    return res.status(500).json({
      message: "Failed to fetch today's check-in",
    });
  }
}
