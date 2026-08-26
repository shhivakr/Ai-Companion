import { Types } from "mongoose";

import { Goal } from "../models/Goal";
import type {
  CreateGoalInput,
  UpdateGoalInput,
} from "../validation/goal.validation";

export async function createGoal(userId: string, data: CreateGoalInput) {
  return Goal.create({
    user: new Types.ObjectId(userId),
    ...data,
  });
}

export async function getGoals(userId: string) {
  return Goal.find({
    user: new Types.ObjectId(userId),
  }).sort({
    createdAt: -1,
  });
}

export async function getGoalById(userId: string, goalId: string) {
  return Goal.findOne({
    _id: goalId,
    user: new Types.ObjectId(userId),
  });
}

export async function updateGoal(
  userId: string,
  goalId: string,
  data: UpdateGoalInput,
) {
  return Goal.findOneAndUpdate(
    {
      _id: goalId,
      user: new Types.ObjectId(userId),
    },
    data,
    {
      new: true,
      runValidators: true,
    },
  );
}

export async function deleteGoal(userId: string, goalId: string) {
  return Goal.findOneAndDelete({
    _id: goalId,
    user: new Types.ObjectId(userId),
  });
}
