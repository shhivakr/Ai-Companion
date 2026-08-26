import { apiClient } from "./client";

export type GoalStatus = "active" | "completed" | "paused";

export interface Goal {
  _id: string;
  user: string;

  title: string;
  description?: string;
  category?: string;

  status: GoalStatus;
  progress: number;

  milestone?: string;
  nextAction?: string;

  targetDate?: string;

  createdAt: string;
  updatedAt: string;
}

export interface GoalsResponse {
  goals: Goal[];
}

export interface GoalResponse {
  goal: Goal;
  message?: string;
}

export interface CreateGoalPayload {
  title: string;
  description?: string;
  category?: string;
  milestone?: string;
  nextAction?: string;
  targetDate?: string;
}

export interface UpdateGoalPayload {
  title?: string;
  description?: string;
  category?: string;
  milestone?: string;
  nextAction?: string;
  targetDate?: string;
  status?: GoalStatus;
  progress?: number;
}

export async function getGoals() {
  return apiClient<GoalsResponse>("/goals", {
    method: "GET",
    auth: true,
  });
}

export async function getGoal(id: string) {
  return apiClient<GoalResponse>(`/goals/${id}`, {
    method: "GET",
    auth: true,
  });
}

export async function createGoal(payload: CreateGoalPayload) {
  return apiClient<GoalResponse>("/goals", {
    method: "POST",
    auth: true,
    body: JSON.stringify(payload),
  });
}

export async function updateGoal(id: string, payload: UpdateGoalPayload) {
  return apiClient<GoalResponse>(`/goals/${id}`, {
    method: "PATCH",
    auth: true,
    body: JSON.stringify(payload),
  });
}

export async function deleteGoal(id: string) {
  return apiClient<{
    message: string;
  }>(`/goals/${id}`, {
    method: "DELETE",
    auth: true,
  });
}
