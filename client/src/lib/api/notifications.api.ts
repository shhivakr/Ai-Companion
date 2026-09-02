import { apiClient } from "./client";

export type NotificationType =
  | "task"
  | "goal"
  | "check_in"
  | "companion"
  | "reminder"
  | "system";

export interface Notification {
  _id: string;
  user: string;

  type: NotificationType;

  title: string;
  description?: string;

  read: boolean;

  metadata?: Record<string, unknown>;

  createdAt: string;
  updatedAt: string;
}

interface NotificationsResponse {
  notifications: Notification[];
}

interface UnreadCountResponse {
  count: number;
}

interface MarkAsReadResponse {
  message: string;
  notification: Notification;
}

interface MarkAllAsReadResponse {
  message: string;
  modifiedCount: number;
}

export async function getNotifications() {
  return apiClient<NotificationsResponse>("/notifications", {
    method: "GET",
    auth: true,
  });
}

export async function getUnreadNotificationCount() {
  return apiClient<UnreadCountResponse>("/notifications/unread-count", {
    method: "GET",
    auth: true,
  });
}

export async function markNotificationAsRead(id: string) {
  return apiClient<MarkAsReadResponse>(`/notifications/${id}/read`, {
    method: "PATCH",
    auth: true,
  });
}

export async function markAllNotificationsAsRead() {
  return apiClient<MarkAllAsReadResponse>("/notifications/read-all", {
    method: "PATCH",
    auth: true,
  });
}
