import { Types } from "mongoose";

import { Task } from "../models/Task";

import type {
  CreateTaskInput,
  UpdateTaskInput,
} from "../validation/task.validation";

export async function createTask(userId: string, data: CreateTaskInput) {
  return Task.create({
    user: new Types.ObjectId(userId),
    ...data,
  });
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

  return Task.findOneAndUpdate(
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
}

export async function deleteTask(userId: string, taskId: string) {
  return Task.findOneAndDelete({
    _id: taskId,
    user: new Types.ObjectId(userId),
  });
}
