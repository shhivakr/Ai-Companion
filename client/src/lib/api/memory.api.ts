import { apiClient } from "./client";

export type MemoryCategory =
  | "working_style"
  | "project"
  | "focus"
  | "preference";

export type MemorySource =
  | "conversation"
  | "checkin"
  | "goal"
  | "task"
  | "manual";

export interface Memory {
  _id: string;
  user: string;

  title: string;
  content: string;

  category: MemoryCategory;
  source: MemorySource;
  importance: number;

  createdAt: string;
  updatedAt: string;
}

export interface MemoriesResponse {
  memories: Memory[];
}

export interface MemoryResponse {
  memory: Memory;
  message?: string;
}

export interface CreateMemoryPayload {
  title: string;
  content: string;
  category: MemoryCategory;
  source?: MemorySource;
  importance?: number;
}

export interface UpdateMemoryPayload {
  title?: string;
  content?: string;
  category?: MemoryCategory;
  source?: MemorySource;
  importance?: number;
}

export interface MemoryQuery {
  category?: MemoryCategory;
  source?: MemorySource;
}

function buildQuery(query?: MemoryQuery) {
  if (!query) {
    return "";
  }

  const params = new URLSearchParams();

  if (query.category) {
    params.set("category", query.category);
  }

  if (query.source) {
    params.set("source", query.source);
  }

  const search = params.toString();

  return search ? `?${search}` : "";
}

export async function getMemories(query?: MemoryQuery) {
  return apiClient<MemoriesResponse>(`/memory${buildQuery(query)}`, {
    method: "GET",
    auth: true,
  });
}

export async function getMemory(id: string) {
  return apiClient<MemoryResponse>(`/memory/${id}`, {
    method: "GET",
    auth: true,
  });
}

export async function createMemory(payload: CreateMemoryPayload) {
  return apiClient<MemoryResponse>("/memory", {
    method: "POST",
    auth: true,
    body: JSON.stringify(payload),
  });
}

export async function updateMemory(id: string, payload: UpdateMemoryPayload) {
  return apiClient<MemoryResponse>(`/memory/${id}`, {
    method: "PATCH",
    auth: true,
    body: JSON.stringify(payload),
  });
}

export async function deleteMemory(id: string) {
  return apiClient<{ message: string }>(`/memory/${id}`, {
    method: "DELETE",
    auth: true,
  });
}
