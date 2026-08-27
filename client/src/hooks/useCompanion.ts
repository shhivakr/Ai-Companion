"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  chatWithCompanion,
  getConversation,
  getConversations,
} from "@/lib/api/companion.api";

export function useCompanion() {
  const queryClient = useQueryClient();

  const conversationsQuery = useQuery({
    queryKey: ["companion", "conversations"],
    queryFn: getConversations,
  });

  const chatMutation = useMutation({
    mutationFn: chatWithCompanion,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["companion", "conversations"],
      });
    },
  });

  async function sendMessage(message: string, conversationId?: string) {
    return chatMutation.mutateAsync({
      message,
      conversationId,
    });
  }

  async function loadConversation(conversationId: string) {
    return getConversation(conversationId);
  }

  return {
    sendMessage,
    loadConversation,

    conversations: conversationsQuery.data?.conversations ?? [],

    isLoadingConversations: conversationsQuery.isLoading,

    conversationsError: conversationsQuery.error,

    refetchConversations: conversationsQuery.refetch,

    isSending: chatMutation.isPending,
    sendError: chatMutation.error,
    resetSendError: chatMutation.reset,
  };
}
