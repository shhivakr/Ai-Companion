"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getSettings,
  updateSettings,
  type UpdateSettingsPayload,
} from "@/lib/api/settings.api";

export const SETTINGS_QUERY_KEY = ["settings"];

export function useSettings() {
  return useQuery({
    queryKey: SETTINGS_QUERY_KEY,

    queryFn: async () => {
      const response = await getSettings();

      return response.settings;
    },

    staleTime: 60 * 1000,

    retry: 1,
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateSettingsPayload) => updateSettings(payload),

    onSuccess: (response) => {
      queryClient.setQueryData(SETTINGS_QUERY_KEY, response.settings);
    },
  });
}
