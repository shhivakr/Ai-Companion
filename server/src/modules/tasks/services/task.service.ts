import { Types } from "mongoose";
import { createNotification } from "../../notifications/services/notification.service";
import { Task } from "../models/Task";

import type {
  CreateTaskInput,
  UpdateTaskInput,
} from "../validation/task.validation";
import { Goal } from "../../goals/models/Goal";

export async function createTask(userId: string, data: CreateTaskInput) {
  const taskData = {
    ...data,
    user: new Types.ObjectId(userId),
  };

  if (data.goal) {
    if (!Types.ObjectId.isValid(data.goal)) {
      throw new Error("Invalid goal ID");
    }

    const goal = await Goal.findOne({
      _id: data.goal,
      user: new Types.ObjectId(userId),
    });

    if (!goal) {
      throw new Error("Goal not found");
    }

    taskData.goal = new Types.ObjectId(data.goal) as any;
  }

  return Task.create(taskData);
}

export async function getTasks(userId: string) {
  return Task.find({
    user: new Types.ObjectId(userId),
  })
    .sort({
      status: 1,
      dueDate: 1,
      createdAt: -1,
    })
    .populate("goal", "title");
}

export async function getTaskById(userId: string, taskId: string) {
  return Task.findOne({
    _id: taskId,
    user: new Types.ObjectId(userId),
  }).populate("goal", "title");
}

export async function updateTask(
  userId: string,
  taskId: string,
  data: UpdateTaskInput,
) {
  const existingTask = await Task.findOne({
    _id: taskId,
    user: new Types.ObjectId(userId),
  });

  if (!existingTask) {
    return null;
  }

  const updateData = {
    ...data,
  };

  if (data.status === "completed") {
    Object.assign(updateData, {
      completedAt: new Date(),
    });
  }

  if (data.status === "pending") {
    Object.assign(updateData, {
      completedAt: undefined,
    });
  }

  const updatedTask = await Task.findOneAndUpdate(
    {
      _id: taskId,
      user: new Types.ObjectId(userId),
    },
    updateData,
    {
      new: true,
      runValidators: true,
    },
  ).populate("goal", "title");

  if (
    updatedTask &&
    data.status === "completed" &&
    existingTask.status !== "completed"
  ) {
    try {
      await createNotification(userId, {
        type: "task",
        title: "Task completed",
        description: `You completed "${existingTask.title}".`,
        metadata: {
          taskId: existingTask._id.toString(),
        },
      });
    } catch (error) {
      console.error("Create task completion notification error:", error);
    }
  }

  return updatedTask;
}

export async function deleteTask(userId: string, taskId: string) {
  return Task.findOneAndDelete({
    _id: taskId,
    user: new Types.ObjectId(userId),
  });
}
