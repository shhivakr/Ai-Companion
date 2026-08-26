import type { Request, Response } from "express";
import mongoose from "mongoose";

import {
  createGoal,
  deleteGoal,
  getGoalById,
  getGoals,
  updateGoal,
} from "../services/goal.service";

import {
  createGoalSchema,
  updateGoalSchema,
} from "../validation/goal.validation";

import type { AuthenticatedRequest } from "../../../middleware/auth.middleware.js";

function getUserId(req: Request): string {
  const userId = (req as AuthenticatedRequest).userId;

  if (!userId) {
    throw new Error("Authenticated user not found");
  }

  return userId;
}

export async function createGoalController(req: Request, res: Response) {
  const result = createGoalSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Invalid goal data",
      errors: result.error.flatten(),
    });
  }

  try {
    const userId = getUserId(req);

    const goal = await createGoal(userId, result.data);

    return res.status(201).json({
      message: "Goal created successfully",
      goal,
    });
  } catch (error) {
    console.error("Create goal error:", error);

    return res.status(500).json({
      message: "Failed to create goal",
    });
  }
}

export async function getGoalsController(req: Request, res: Response) {
  try {
    const userId = getUserId(req);

    const goals = await getGoals(userId);

    return res.status(200).json({
      goals,
    });
  } catch (error) {
    console.error("Get goals error:", error);

    return res.status(500).json({
      message: "Failed to fetch goals",
    });
  }
}

export async function getGoalController(
  req: Request<{ id: string }>,
  res: Response,
) {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({
      message: "Invalid goal ID",
    });
  }

  try {
    const userId = getUserId(req);

    const goal = await getGoalById(userId, id);

    if (!goal) {
      return res.status(404).json({
        message: "Goal not found",
      });
    }

    return res.status(200).json({
      goal,
    });
  } catch (error) {
    console.error("Get goal error:", error);

    return res.status(500).json({
      message: "Failed to fetch goal",
    });
  }
}

export async function updateGoalController(
  req: Request<{ id: string }>,
  res: Response,
) {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({
      message: "Invalid goal ID",
    });
  }

  const result = updateGoalSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Invalid goal data",
      errors: result.error.flatten(),
    });
  }

  try {
    const userId = getUserId(req);

    const goal = await updateGoal(userId, id, result.data);

    if (!goal) {
      return res.status(404).json({
        message: "Goal not found",
      });
    }

    return res.status(200).json({
      message: "Goal updated successfully",
      goal,
    });
  } catch (error) {
    console.error("Update goal error:", error);

    return res.status(500).json({
      message: "Failed to update goal",
    });
  }
}

export async function deleteGoalController(
  req: Request<{ id: string }>,
  res: Response,
) {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({
      message: "Invalid goal ID",
    });
  }

  try {
    const userId = getUserId(req);

    const goal = await deleteGoal(userId, id);

    if (!goal) {
      return res.status(404).json({
        message: "Goal not found",
      });
    }

    return res.status(200).json({
      message: "Goal deleted successfully",
    });
  } catch (error) {
    console.error("Delete goal error:", error);

    return res.status(500).json({
      message: "Failed to delete goal",
    });
  }
}
