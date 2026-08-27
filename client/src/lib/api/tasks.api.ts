import { apiClient } from "@/lib/api/client";

export type TaskPriority = "low" | "medium" | "high";

export type TaskStatus = "pending" | "completed";

export interface TaskGoal {
  _id: string;
  title: string;
}

export interface Task {
  _id: string;

  title: string;
  description?: string;

  goal?: TaskGoal | string;

  priority: TaskPriority;
  status: TaskStatus;

  dueDate?: string;
  completedAt?: string;

  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskPayload {
  title: string;
  description?: string;
  goal?: string;
  priority?: TaskPriority;
  dueDate?: string;
}

export interface UpdateTaskPayload {
  title?: string;
  description?: string;
  goal?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  dueDate?: string;
}

interface TasksResponse {
  tasks: Task[];
}

interface TaskResponse {
  task: Task;
  message?: string;
}

export async function getTasks() {
  return apiClient<TasksResponse>("/tasks", {
    auth: true,
    method: "GET",
  });
}

export async function getTask(id: string) {
  return apiClient<TaskResponse>(`/tasks/${id}`, {
    auth: true,
    method: "GET",
  });
}

export async function createTask(payload: CreateTaskPayload) {
  return apiClient<TaskResponse>("/tasks", {
    auth: true,
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateTask(id: string, payload: UpdateTaskPayload) {
  return apiClient<TaskResponse>(`/tasks/${id}`, {
    auth: true,
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function deleteTask(id: string) {
  return apiClient<{
    message: string;
  }>(`/tasks/${id}`, {
    auth: true,
    method: "DELETE",
  });
}
