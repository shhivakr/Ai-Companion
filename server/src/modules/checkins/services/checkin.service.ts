import { Types } from "mongoose";

import { CheckIn } from "../models/CheckIn";
import type { CreateCheckInInput } from "../schemas/checkin.schema";

export async function createCheckIn(userId: string, data: CreateCheckInInput) {
  return CheckIn.create({
    user: new Types.ObjectId(userId),
    ...data,
  });
}

export async function getCheckIns(userId: string) {
  return CheckIn.find({
    user: new Types.ObjectId(userId),
  }).sort({
    createdAt: -1,
  });
}

export async function getTodayCheckIn(userId: string) {
  const now = new Date();

  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(now);
  endOfDay.setHours(23, 59, 59, 999);

  return CheckIn.findOne({
    user: new Types.ObjectId(userId),
    createdAt: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
  }).sort({
    createdAt: -1,
  });
}
