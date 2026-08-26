"use client";

import { useQuery } from "@tanstack/react-query";

import { getCurrentUser } from "@/lib/api/auth.api";

export const CURRENT_USER_QUERY_KEY = ["auth", "me"];

export function useCurrentUser() {
  return useQuery({
    queryKey: CURRENT_USER_QUERY_KEY,
    queryFn: async () => {
      const response = await getCurrentUser();

      return response.data.user ?? null;
    },
    enabled: false,
    staleTime: 5 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
  });
}
