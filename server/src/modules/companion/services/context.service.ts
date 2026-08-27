import { Types } from "mongoose";

import { Goal } from "../../goals/models/Goal.js";
import { Task } from "../../tasks/models/Task.js";

import type { CompanionContext } from "../types/companion.types.js";

export async function getCompanionContext(
  userId: string,
): Promise<CompanionContext> {
  if (!Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

  const userObjectId = new Types.ObjectId(userId);

  const [goals, tasks] = await Promise.all([
    Goal.find({
      user: userObjectId,
    })
      .sort({
        status: 1,
        createdAt: -1,
      })
      .lean(),

    Task.find({
      user: userObjectId,
    })
      .sort({
        status: 1,
        dueDate: 1,
        createdAt: -1,
      })
      .populate("goal", "title")
      .lean(),
  ]);

  return {
    goals: goals.map((goal) => ({
      id: goal._id.toString(),
      title: goal.title,
      status: goal.status,
      progress: goal.progress,
      category: goal.category,
      nextAction: goal.nextAction,
      targetDate: goal.targetDate?.toISOString(),
    })),

    tasks: tasks.map((task) => ({
      id: task._id.toString(),
      title: task.title,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate?.toISOString(),
      goal:
        task.goal && typeof task.goal === "object" && "title" in task.goal
          ? String(task.goal.title)
          : undefined,
    })),
  };
}
