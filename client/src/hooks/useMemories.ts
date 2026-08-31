"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createMemory,
  deleteMemory,
  getMemory,
  getMemories,
  updateMemory,
  type CreateMemoryPayload,
  type MemoryQuery,
  type UpdateMemoryPayload,
} from "@/lib/api/memory.api";

export const MEMORIES_QUERY_KEY = ["memories"];

export function useMemories(query?: MemoryQuery) {
  return useQuery({
    queryKey: query ? [...MEMORIES_QUERY_KEY, query] : MEMORIES_QUERY_KEY,

    queryFn: async () => {
      const response = await getMemories(query);

      return response.memories;
    },

    staleTime: 60 * 1000,

    retry: 1,
  });
}

export function useMemory(id: string) {
  return useQuery({
    queryKey: ["memories", id],

    queryFn: async () => {
      const response = await getMemory(id);

      return response.memory;
    },

    enabled: Boolean(id),

    staleTime: 60 * 1000,

    retry: 1,
  });
}

export function useCreateMemory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateMemoryPayload) => createMemory(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: MEMORIES_QUERY_KEY,
      });
    },
  });
}

export function useUpdateMemory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateMemoryPayload;
    }) => updateMemory(id, payload),

    onSuccess: (response) => {
      const updatedMemory = response.memory;

      queryClient.setQueryData(
        MEMORIES_QUERY_KEY,
        (
          old: Awaited<ReturnType<typeof getMemories>>["memories"] | undefined,
        ) => {
          if (!old) {
            return old;
          }

          return old.map((memory) =>
            memory._id === updatedMemory._id ? updatedMemory : memory,
          );
        },
      );

      queryClient.setQueryData(["memories", updatedMemory._id], updatedMemory);
    },
  });
}

export function useDeleteMemory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMemory(id),

    onSuccess: (_response, deletedId) => {
      queryClient.setQueryData(
        MEMORIES_QUERY_KEY,
        (
          old: Awaited<ReturnType<typeof getMemories>>["memories"] | undefined,
        ) => {
          if (!old) {
            return old;
          }

          return old.filter((memory) => memory._id !== deletedId);
        },
      );

      queryClient.removeQueries({
        queryKey: ["memories", deletedId],
      });
    },
  });
}
