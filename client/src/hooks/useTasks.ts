"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createTask,
  deleteTask,
  getTask,
  getTasks,
  updateTask,
} from "@/lib/api/tasks.api";

import type { CreateTaskPayload, UpdateTaskPayload } from "@/lib/api/tasks.api";

export const taskKeys = {
  all: ["tasks"] as const,

  lists: () => [...taskKeys.all, "list"] as const,

  list: () => [...taskKeys.lists()] as const,

  details: () => [...taskKeys.all, "detail"] as const,

  detail: (id: string) => [...taskKeys.details(), id] as const,
};

export function useTasks() {
  return useQuery({
    queryKey: taskKeys.list(),
    queryFn: async () => {
      const response = await getTasks();

      return response.tasks;
    },
  });
}

export function useTask(id: string) {
  return useQuery({
    queryKey: taskKeys.detail(id),
    queryFn: async () => {
      const response = await getTask(id);

      return response.task;
    },
    enabled: Boolean(id),
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTaskPayload) => createTask(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: taskKeys.lists(),
      });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateTaskPayload }) =>
      updateTask(id, payload),

    onSuccess: (response, variables) => {
      queryClient.setQueryData(taskKeys.detail(variables.id), response.task);

      queryClient.invalidateQueries({
        queryKey: taskKeys.lists(),
      });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteTask(id),

    onSuccess: (_, id) => {
      queryClient.removeQueries({
        queryKey: taskKeys.detail(id),
      });

      queryClient.invalidateQueries({
        queryKey: taskKeys.lists(),
      });
    },
  });
}
