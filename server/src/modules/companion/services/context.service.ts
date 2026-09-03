import { Types } from "mongoose";

import { Goal } from "../../goals/models/Goal.js";
import { Task } from "../../tasks/models/Task.js";
import { CheckIn } from "../../checkins/models/CheckIn.js";

import type {
  CompanionContext,
  FormattedTask,
  FormattedGoal,
} from "../types/companion.types.js";

import { resolveIntent } from "./intent.service.js";
import { deriveProductivityReasoning } from "./reasoning.service.js";
import { processAndSaveMemory, findRelevantMemories } from "./memory.service.js";

export async function getCompanionContext(
  userId: string,
  message: string,
): Promise<CompanionContext> {
  if (!Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

  const userObjectId = new Types.ObjectId(userId);
  
  // Resolve intent and context needs deterministically
  const resolvedIntent = resolveIntent(message);
  const { contextNeeds } = resolvedIntent;

  // Process any explicit memory save instructions first
  await processAndSaveMemory(userId, message, resolvedIntent);

  const now = new Date();
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);
  
  const endOfToday = new Date(startOfToday);
  endOfToday.setDate(endOfToday.getDate() + 1);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const queries: Promise<any>[] = [];

  // --- Productivity Signals ---
  // Always fetched, highly aggregated
  queries.push(Task.countDocuments({ user: userObjectId, status: "pending" }));
  queries.push(
    Task.countDocuments({
      user: userObjectId,
      status: "pending",
      dueDate: { $lt: startOfToday },
    }),
  );
  queries.push(
    Task.countDocuments({
      user: userObjectId,
      status: "completed",
      completedAt: { $gte: startOfToday },
    }),
  );
  queries.push(
    Task.countDocuments({
      user: userObjectId,
      status: "pending",
      priority: "high",
    }),
  );
  queries.push(Goal.countDocuments({ user: userObjectId, status: "active" }));

  let todayTasksIndex = -1;
  let overdueTasksIndex = -1;
  let activeGoalsIndex = -1;
  let checkInIndex = -1;
  let memoriesIndex = -1;

  if (contextNeeds.tasks) {
    todayTasksIndex = queries.length;
    queries.push(
      Task.find({
        user: userObjectId,
        status: "pending",
        $or: [
          { dueDate: { $gte: startOfToday, $lt: endOfToday } },
          { priority: "high" },
        ],
      })
        .sort({ dueDate: 1 })
        .limit(15)
        .populate("goal", "title")
        .lean(),
    );

    overdueTasksIndex = queries.length;
    queries.push(
      Task.find({
        user: userObjectId,
        status: "pending",
        dueDate: { $lt: startOfToday },
      })
        .sort({ dueDate: 1 })
        .limit(15)
        .populate("goal", "title")
        .lean(),
    );
  }

  if (contextNeeds.goals) {
    activeGoalsIndex = queries.length;
    queries.push(
      Goal.find({
        user: userObjectId,
        status: "active",
      })
        .sort({ updatedAt: -1 })
        .limit(10)
        .lean(),
    );
  }

  if (contextNeeds.checkIn) {
    checkInIndex = queries.length;
    queries.push(
      CheckIn.findOne({
        user: userObjectId,
      })
        .sort({ createdAt: -1 })
        .lean(),
    );
  }

  memoriesIndex = queries.length;
  queries.push(findRelevantMemories(userId, resolvedIntent));

  const results = await Promise.all(queries);

  const context: CompanionContext = {
    intentInfo: resolvedIntent,
    signals: {
      pendingTaskCount: results[0] as number,
      overdueTaskCount: results[1] as number,
      completedTodayCount: results[2] as number,
      highPriorityPendingCount: results[3] as number,
      activeGoalCount: results[4] as number,
    },
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formatTask = (t: any): FormattedTask => ({
    id: t._id.toString(),
    title: t.title,
    status: t.status,
    priority: t.priority,
    dueDate: t.dueDate?.toISOString(),
    goal:
      t.goal && typeof t.goal === "object" && "title" in t.goal
        ? String(t.goal.title)
        : undefined,
  });

  if (todayTasksIndex !== -1) {
    context.todayTasks = (results[todayTasksIndex] as any[]).map(formatTask);
  }

  if (overdueTasksIndex !== -1) {
    context.overdueTasks = (results[overdueTasksIndex] as any[]).map(formatTask);
  }

  if (activeGoalsIndex !== -1) {
    context.activeGoals = (results[activeGoalsIndex] as any[]).map(
      (g): FormattedGoal => ({
        id: g._id.toString(),
        title: g.title,
        progress: g.progress,
        category: g.category,
        nextAction: g.nextAction,
        targetDate: g.targetDate?.toISOString(),
      }),
    );
  }

  if (checkInIndex !== -1) {
    const checkIn = results[checkInIndex];
    if (checkIn) {
      context.checkIn = {
        feeling: checkIn.feeling,
        energy: checkIn.energy,
        focus: checkIn.focus,
        note: checkIn.note,
        createdAt: checkIn.createdAt.toISOString(),
      };
    }
  }

  if (memoriesIndex !== -1) {
    const mems = results[memoriesIndex];
    if (mems && mems.length > 0) {
      context.longTermMemories = mems.map((m: any) => m.value);
    }
  }

  // Derive productivity reasoning if depth is not minimal
  if (resolvedIntent.depth !== "minimal") {
    context.productivityReasoning = deriveProductivityReasoning(context.signals, context);
  }

  return context;
}
