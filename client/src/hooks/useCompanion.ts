"use client";

import { useCallback, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getConversations,
  streamCompanionChat,
  type StreamCallbacks,
} from "@/lib/api/companion.api";

export function useCompanion() {
  const queryClient = useQueryClient();

  // ─── Conversations list (React Query) ─────────────────────────────────────
  const conversationsQuery = useQuery({
    queryKey: ["companion", "conversations"],
    queryFn: getConversations,
  });

  // ─── Streaming state ───────────────────────────────────────────────────────
  const [isStreaming, setIsStreaming] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  // ─── Stream starter ───────────────────────────────────────────────────────
  const startStream = useCallback(
    async (
      message: string,
      clientMessageId: string,
      callbacks: StreamCallbacks,
      conversationId?: string,
    ) => {
      // Guard: never allow two concurrent streams
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;
      setIsStreaming(true);

      try {
        await streamCompanionChat(
          { message, conversationId },
          clientMessageId,
          {
            ...callbacks,
            onDone: () => {
              callbacks.onDone();
              queryClient.invalidateQueries({
                queryKey: ["companion", "conversations"],
              });
            },
          },
          controller.signal,
        );
      } finally {
        // Always clean up — whether completed, stopped, or errored
        abortControllerRef.current = null;
        setIsStreaming(false);
      }
    },
    [queryClient],
  );

  // ─── Stop current stream ──────────────────────────────────────────────────
  const stopStream = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsStreaming(false);
  }, []);

  // ─── Cleanup on unmount ───────────────────────────────────────────────────
  // (stopStream is stable because of useCallback; callers can use it in
  //  useEffect cleanup without dependency concerns)

  return {
    startStream,
    stopStream,
    isStreaming,

    conversations: conversationsQuery.data?.conversations ?? [],
    isLoadingConversations: conversationsQuery.isLoading,
    conversationsError: conversationsQuery.error,
    refetchConversations: conversationsQuery.refetch,
  };
}
