import { apiClient } from "./client";

export type TimelineType = "all" | "task" | "goal" | "checkin" | "companion";

export interface TimelineItem {
  id: string;
  type: TimelineType;
  title: string;
  description: string;
  createdAt: string;
}

export interface TimelineResponse {
  timeline: TimelineItem[];
}

export interface TimelineQuery {
  type?: TimelineType;
}

export async function getTimeline(type: TimelineType = "all") {
  const query = type === "all" ? "" : `?type=${type}`;

  return apiClient<TimelineResponse>(`/timeline${query}`, {
    method: "GET",
    auth: true,
  });
}
