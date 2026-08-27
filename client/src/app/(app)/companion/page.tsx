"use client";

import { useEffect, useRef, useState } from "react";

import CompanionHeader from "@/components/companion/CompanionHeader";
import MessageBubble from "@/components/companion/MessageBubble";
import SuggestedAction from "@/components/companion/SuggestedAction";
import Composer from "@/components/companion/Composer";
import Card from "@/components/ui/Card";

import {
  getConversation,
  type CompanionMessage,
} from "@/lib/api/companion.api";

import { useCompanion } from "@/hooks/useCompanion";
import ConversationList from "@/components/companion/ConversationList";

export default function CompanionPage() {
  /* =================================== States =================================== */
  const [conversationId, setConversationId] = useState<string | undefined>();
  const [messages, setMessages] = useState<CompanionMessage[]>([]);
  const [isLoadingConversation, setIsLoadingConversation] = useState(false);
  const [conversationError, setConversationError] = useState<string | null>(
    null,
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  /* =================================== Hooks =================================== */
  const {
    sendMessage,
    isSending,
    sendError,
    conversations,
    isLoadingConversations,
  } = useCompanion();
  /* =================================== Effects =================================== */
  useEffect(() => {
    const storedConversationId = window.sessionStorage.getItem(
      "companion-conversation-id",
    );

    if (!storedConversationId) {
      return;
    }

    setConversationId(storedConversationId);
    setIsLoadingConversation(true);

    getConversation(storedConversationId)
      .then((response) => {
        setMessages(response.conversation.messages);
      })
      .catch((error) => {
        window.sessionStorage.removeItem("companion-conversation-id");

        setConversationId(undefined);

        setConversationError(
          error instanceof Error
            ? error.message
            : "Unable to load conversation.",
        );
      })
      .finally(() => {
        setIsLoadingConversation(false);
      });
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, isSending]);
  /* =================================== Handlers =================================== */
  async function handleSend(message: string) {
    setConversationError(null);

    const optimisticMessage: CompanionMessage = {
      id: `temporary-${Date.now()}`,
      role: "user",
      content: message,
      createdAt: new Date().toISOString(),
    };

    setMessages((current) => [...current, optimisticMessage]);

    try {
      const response = await sendMessage(message, conversationId);

      const nextConversationId = response.data.conversationId;

      setConversationId(nextConversationId);

      window.sessionStorage.setItem(
        "companion-conversation-id",
        nextConversationId,
      );

      setMessages((current) => [
        ...current.map((item) =>
          item.id === optimisticMessage.id
            ? {
                ...item,
                id: `user-${Date.now()}`,
              }
            : item,
        ),
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: response.data.message,
          createdAt: new Date().toISOString(),
        },
      ]);
    } catch (error) {
      setMessages((current) =>
        current.filter((item) => item.id !== optimisticMessage.id),
      );

      throw error;
    }
  }

  function handleNewConversation() {
    window.sessionStorage.removeItem("companion-conversation-id");

    setConversationId(undefined);
    setMessages([]);
    setConversationError(null);
  }

  async function handleSelectConversation(nextConversationId: string) {
    if (isSending || nextConversationId === conversationId) {
      return;
    }

    setConversationError(null);
    setIsLoadingConversation(true);

    try {
      const response = await getConversation(nextConversationId);

      setConversationId(nextConversationId);
      setMessages(response.conversation.messages);

      window.sessionStorage.setItem(
        "companion-conversation-id",
        nextConversationId,
      );
    } catch (error) {
      setConversationError(
        error instanceof Error ? error.message : "Unable to load conversation.",
      );
    } finally {
      setIsLoadingConversation(false);
    }
  }
  return (
    <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-6xl flex-col">
      <CompanionHeader
        onNewConversation={handleNewConversation}
        disabled={isSending}
      />
      <div className="flex-1 py-6 lg:pr-[304px]">
        {" "}
        {/* Conversation */}
        <div className="flex min-w-0 flex-col">
          <div className="flex-1 space-y-5">
            {isLoadingConversation ? (
              <MessageBubble role="companion">
                Loading your conversation...
              </MessageBubble>
            ) : messages.length > 0 ? (
              messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  role={message.role === "user" ? "user" : "companion"}
                >
                  {message.content}
                </MessageBubble>
              ))
            ) : (
              <>
                <MessageBubble role="companion">
                  I’m ready. Tell me what’s on your mind, what you’re working
                  toward, or what you need help deciding.
                </MessageBubble>

                <div className="max-w-2xl">
                  <p className="mb-3 text-xs font-medium uppercase tracking-wide text-neutral-500">
                    You could also
                  </p>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <SuggestedAction
                      title="Plan my day"
                      description="Choose what deserves your attention."
                      onClick={() =>
                        handleSend(
                          "Help me plan my day based on my current goals and tasks.",
                        )
                      }
                    />

                    <SuggestedAction
                      title="Review my goals"
                      description="See what you're currently working toward."
                      onClick={() =>
                        handleSend(
                          "Review my current goals and tell me what I should focus on.",
                        )
                      }
                    />
                  </div>
                </div>
              </>
            )}

            {isSending && (
              <MessageBubble role="companion">Thinking...</MessageBubble>
            )}

            {(conversationError || sendError) && (
              <div className="max-w-2xl rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-sm text-red-600">
                  {conversationError ||
                    (sendError instanceof Error
                      ? sendError.message
                      : "Unable to send your message.")}
                </p>
              </div>
            )}
          </div>

          <div className="mt-6">
            <Composer
              onSend={handleSend}
              disabled={isSending || isLoadingConversation}
            />
          </div>
        </div>
        {/* Context */}
        <aside className="fixed right-8 top-24 hidden w-[280px] lg:block">
          <Card className="mb-4 p-5">
            <div className="mb-4">
              <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                Conversations
              </p>

              <h2 className="mt-1 text-sm font-semibold">
                Recent conversations
              </h2>
            </div>

            <ConversationList
              conversations={conversations}
              activeConversationId={conversationId}
              isLoading={isLoadingConversations}
              onSelect={handleSelectConversation}
            />
          </Card>
          <Card className="sticky top-6 p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
              Current context
            </p>

            <div className="mt-5 space-y-5">
              <div>
                <p className="text-xs text-neutral-500">Today's focus</p>

                <p className="mt-1 text-sm font-medium">
                  Your highest-priority work
                </p>
              </div>

              <div>
                <p className="text-xs text-neutral-500">Active goal</p>

                <p className="mt-1 text-sm font-medium">
                  Your current active goal
                </p>
              </div>

              <div>
                <p className="text-xs text-neutral-500">Conversation</p>

                <p className="mt-1 text-sm font-medium">
                  {conversationId ? "Active" : "New conversation"}
                </p>
              </div>

              <div className="border-t border-neutral-100 pt-4">
                <p className="text-xs text-neutral-500">Relevant memory</p>

                <p className="mt-1 text-sm leading-5">
                  Companion uses your relevant goals and tasks when responding.
                </p>
              </div>
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}
