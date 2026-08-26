"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createGoal,
  deleteGoal,
  getGoal,
  getGoals,
  updateGoal,
  type CreateGoalPayload,
  type UpdateGoalPayload,
} from "@/lib/api/goals.api";

export const GOALS_QUERY_KEY = ["goals"];

export function useGoals() {
  return useQuery({
    queryKey: GOALS_QUERY_KEY,
    queryFn: async () => {
      const response = await getGoals();

      return response.goals;
    },

    staleTime: 60 * 1000,

    retry: 1,
  });
}

export function useGoal(id: string) {
  return useQuery({
    queryKey: ["goals", id],

    queryFn: async () => {
      const response = await getGoal(id);

      return response.goal;
    },

    enabled: Boolean(id),

    staleTime: 60 * 1000,

    retry: 1,
  });
}

export function useCreateGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateGoalPayload) => createGoal(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: GOALS_QUERY_KEY,
      });
    },
  });
}

export function useUpdateGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateGoalPayload }) =>
      updateGoal(id, payload),

    onSuccess: (response) => {
      const updatedGoal = response.goal;

      queryClient.setQueryData(
        GOALS_QUERY_KEY,
        (old: (typeof updatedGoal)[] | undefined) => {
          if (!old) {
            return old;
          }

          return old.map((goal) =>
            goal._id === updatedGoal._id ? updatedGoal : goal,
          );
        },
      );

      queryClient.setQueryData(["goals", updatedGoal._id], updatedGoal);
    },
  });
}

export function useDeleteGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteGoal(id),

    onSuccess: (_response, deletedId) => {
      queryClient.setQueryData(
        GOALS_QUERY_KEY,
        (old: Awaited<ReturnType<typeof getGoals>>["goals"] | undefined) => {
          if (!old) {
            return old;
          }

          return old.filter((goal) => goal._id !== deletedId);
        },
      );

      queryClient.removeQueries({
        queryKey: ["goals", deletedId],
      });
    },
  });
}
