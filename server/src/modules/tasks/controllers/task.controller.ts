import type { Request, Response } from "express";
import mongoose from "mongoose";

import {
  createTask,
  deleteTask,
  getTaskById,
  getTasks,
  updateTask,
} from "../services/task.service.js";

import {
  createTaskSchema,
  updateTaskSchema,
} from "../validation/task.validation.js";

import type { AuthenticatedRequest } from "../../../middleware/auth.middleware.js";

function getUserId(req: Request): string {
  const userId = (req as AuthenticatedRequest).userId;

  if (!userId) {
    throw new Error("Authenticated user not found");
  }

  return userId;
}

export async function createTaskController(req: Request, res: Response) {
  const result = createTaskSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Invalid task data",
      errors: result.error.flatten(),
    });
  }

  try {
    const userId = getUserId(req);

    const task = await createTask(userId, result.data);

    return res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    console.error("Create task error:", error);

    return res.status(500).json({
      message: "Failed to create task",
    });
  }
}

export async function getTasksController(req: Request, res: Response) {
  try {
    const userId = getUserId(req);

    const tasks = await getTasks(userId);

    return res.status(200).json({
      tasks,
    });
  } catch (error) {
    console.error("Get tasks error:", error);

    return res.status(500).json({
      message: "Failed to fetch tasks",
    });
  }
}

export async function getTaskController(
  req: Request<{ id: string }>,
  res: Response,
) {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({
      message: "Invalid task ID",
    });
  }

  try {
    const userId = getUserId(req);

    const task = await getTaskById(userId, id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    return res.status(200).json({
      task,
    });
  } catch (error) {
    console.error("Get task error:", error);

    return res.status(500).json({
      message: "Failed to fetch task",
    });
  }
}

export async function updateTaskController(
  req: Request<{ id: string }>,
  res: Response,
) {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({
      message: "Invalid task ID",
    });
  }

  const result = updateTaskSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Invalid task data",
      errors: result.error.flatten(),
    });
  }

  try {
    const userId = getUserId(req);

    const task = await updateTask(userId, id, result.data);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    return res.status(200).json({
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    console.error("Update task error:", error);

    return res.status(500).json({
      message: "Failed to update task",
    });
  }
}

export async function deleteTaskController(
  req: Request<{ id: string }>,
  res: Response,
) {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({
      message: "Invalid task ID",
    });
  }

  try {
    const userId = getUserId(req);

    const task = await deleteTask(userId, id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    return res.status(200).json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Delete task error:", error);

    return res.status(500).json({
      message: "Failed to delete task",
    });
  }
}
