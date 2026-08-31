import { Types } from "mongoose";

import { Task } from "../../tasks/models/Task";
import { Goal } from "../../goals/models/Goal";
import { CheckIn } from "../../checkins/models/CheckIn";

import type { TimelineQueryInput } from "../schemas/timeline.schema";

export type TimelineItemType = "task" | "goal" | "checkin" | "companion";

export interface TimelineItem {
  id: string;
  type: TimelineItemType;
  title: string;
  description: string;
  createdAt: Date;
}

export async function getTimeline(
  userId: string,
  query: TimelineQueryInput,
): Promise<TimelineItem[]> {
  const userObjectId = new Types.ObjectId(userId);

  const timeline: TimelineItem[] = [];

  if (query.type === "all" || query.type === "task") {
    const tasks = await Task.find({
      user: userObjectId,
    })
      .sort({ createdAt: -1 })
      .populate("goal", "title");

    for (const task of tasks) {
      timeline.push({
        id: task._id.toString(),
        type: "task",
        title:
          task.status === "completed" ? `Completed ${task.title}` : task.title,
        description:
          task.status === "completed"
            ? "Task completed."
            : "Task added to your work.",
        createdAt: task.createdAt,
      });
    }
  }

  if (query.type === "all" || query.type === "goal") {
    const goals = await Goal.find({
      user: userObjectId,
    }).sort({ createdAt: -1 });

    for (const goal of goals) {
      timeline.push({
        id: goal._id.toString(),
        type: "goal",
        title: goal.title,
        description:
          goal.status === "completed"
            ? "Goal completed."
            : `Goal is currently ${goal.status}.`,
        createdAt: goal.createdAt,
      });
    }
  }

  if (query.type === "all" || query.type === "checkin") {
    const checkIns = await CheckIn.find({
      user: userObjectId,
    }).sort({ createdAt: -1 });

    for (const checkIn of checkIns) {
      timeline.push({
        id: checkIn._id.toString(),
        type: "checkin",
        title: "Completed check-in",
        description: [
          `Feeling ${checkIn.feeling}.`,
          `Energy ${checkIn.energy}.`,
          `Focus: ${checkIn.focus.replace("_", " ")}.`,
          checkIn.note ? checkIn.note : null,
        ]
          .filter(Boolean)
          .join(" "),
        createdAt: checkIn.createdAt,
      });
    }
  }

  return timeline.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}
