"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getNotifications,
  getUnreadNotificationCount,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "@/lib/api/notifications.api";

export const notificationKeys = {
  all: ["notifications"] as const,
  lists: () => [...notificationKeys.all, "list"] as const,
  unreadCount: () => [...notificationKeys.all, "unread-count"] as const,
};

export function useNotifications() {
  return useQuery({
    queryKey: notificationKeys.lists(),
    queryFn: async () => {
      const response = await getNotifications();
      return response.notifications;
    },
  });
}

export function useUnreadNotificationCount() {
  return useQuery({
    queryKey: notificationKeys.unreadCount(),
    queryFn: async () => {
      const response = await getUnreadNotificationCount();
      return response.count;
    },
    refetchInterval: 60000,
  });
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => markNotificationAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: notificationKeys.all,
      });
    },
  });
}

export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => markAllNotificationsAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: notificationKeys.all,
      });
    },
  });
}
