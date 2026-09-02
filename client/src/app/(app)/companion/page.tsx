"use client";

import { useEffect, useRef, useState } from "react";

import CompanionHeader from "@/components/companion/CompanionHeader";
import MessageBubble from "@/components/companion/MessageBubble";
import SuggestedAction from "@/components/companion/SuggestedAction";
import Composer from "@/components/companion/Composer";

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
  const [conversationError, setConversationError] = useState<string | null>(null);
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
    const storedConversationId = window.sessionStorage.getItem("companion-conversation-id");

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
          error instanceof Error ? error.message : "Unable to load conversation."
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
      window.sessionStorage.setItem("companion-conversation-id", nextConversationId);

      setMessages((current) => [
        ...current.map((item) =>
          item.id === optimisticMessage.id
            ? { ...item, id: `user-${Date.now()}` }
            : item
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
        current.filter((item) => item.id !== optimisticMessage.id)
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
      window.sessionStorage.setItem("companion-conversation-id", nextConversationId);
    } catch (error) {
      setConversationError(
        error instanceof Error ? error.message : "Unable to load conversation."
      );
    } finally {
      setIsLoadingConversation(false);
    }
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-7rem)] w-full max-w-7xl flex-col lg:flex-row lg:gap-10">
      
      {/* CENTER: Main Chat Workspace */}
      <div className="flex min-w-0 flex-1 flex-col h-full mx-auto w-full max-w-[820px]">
        <div className="shrink-0">
          <CompanionHeader
            onNewConversation={handleNewConversation}
            disabled={isSending}
          />
        </div>
        
        {/* Scrollable Messages Area */}
        <div className="flex-1 overflow-y-auto chat-scrollbar pr-2 pb-4 mt-6">
          <div className="flex min-w-0 flex-col space-y-2">
            {isLoadingConversation ? (
              <MessageBubble role="companion">Loading your conversation...</MessageBubble>
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
                  I'm ready. Tell me what's on your mind, what you're working toward, or what you need help deciding.
                </MessageBubble>

                <div className="max-w-2xl mt-4">
                  <p className="mb-3 text-xs font-medium uppercase tracking-wide text-foreground-muted">
                    You could also
                  </p>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <SuggestedAction
                      title="Plan my day"
                      description="Choose what deserves your attention."
                      onClick={() => handleSend("Help me plan my day based on my current goals and tasks.")}
                    />
                    <SuggestedAction
                      title="Review my goals"
                      description="See what you're currently working toward."
                      onClick={() => handleSend("Review my current goals and tell me what I should focus on.")}
                    />
                  </div>
                </div>
              </>
            )}

            {isSending && (
              <MessageBubble role="companion">Thinking...</MessageBubble>
            )}

            {(conversationError || sendError) && (
              <div className="max-w-2xl rounded-xl border border-red-900 bg-red-950/30 px-4 py-3">
                <p className="text-sm text-red-500">
                  {conversationError || (sendError instanceof Error ? sendError.message : "Unable to send your message.")}
                </p>
              </div>
            )}
            
            <div ref={messagesEndRef} className="h-4" />
          </div>
        </div>

        {/* Persistent Bottom Composer */}
        <div className="shrink-0 mt-2 pt-2 border-t border-transparent bg-background">
          <Composer
            onSend={handleSend}
            disabled={isSending || isLoadingConversation}
          />
        </div>
      </div>

      {/* RIGHT: Sidebar (Compact Context & Conversations) */}
      <aside className="hidden w-[280px] shrink-0 flex-col gap-8 lg:flex overflow-y-auto chat-scrollbar pb-4 pr-2">
        {/* Conversations */}
        <div>
          <div className="mb-4">
            <p className="text-xs font-medium uppercase tracking-wide text-foreground-muted">
              Conversations
            </p>
            <h2 className="mt-1 text-sm font-semibold text-foreground">
              Recent conversations
            </h2>
          </div>
          <ConversationList
            conversations={conversations}
            activeConversationId={conversationId}
            isLoading={isLoadingConversations}
            onSelect={handleSelectConversation}
          />
        </div>

        {/* Current Context */}
        <div className="pt-6 border-t border-border">
          <p className="text-xs font-medium uppercase tracking-wide text-foreground-muted">
            Current context
          </p>

          <div className="mt-5 space-y-5">
            <div>
              <p className="text-xs text-foreground-muted">Today's focus</p>
              <p className="mt-1 text-sm font-medium text-foreground">Your highest-priority work</p>
            </div>

            <div>
              <p className="text-xs text-foreground-muted">Active goal</p>
              <p className="mt-1 text-sm font-medium text-foreground">Your current active goal</p>
            </div>

            <div>
              <p className="text-xs text-foreground-muted">Conversation</p>
              <p className="mt-1 text-sm font-medium text-foreground">
                {conversationId ? "Active" : "New conversation"}
              </p>
            </div>

            <div className="border-t border-border pt-4">
              <p className="text-xs text-foreground-muted">Relevant memory</p>
              <p className="mt-1 text-sm leading-5 text-foreground-secondary">
                Companion uses your relevant goals and tasks when responding.
              </p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
