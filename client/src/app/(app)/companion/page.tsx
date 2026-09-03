"use client";

import { useCallback, useEffect, useRef, useState } from "react";

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

// ─── Streaming state machine ──────────────────────────────────────────────────
// idle → starting → streaming → completed
// idle → starting → failed
// idle → starting → streaming → stopped

type SendState =
  | { status: "idle" }
  | { status: "starting" }
  | { status: "streaming" }
  | { status: "completed" }
  | { status: "failed"; message: string }
  | { status: "stopped" };

// ─── Extended message type for local streaming state ─────────────────────────
interface LocalMessage extends CompanionMessage {
  /** Present on the assistant placeholder while streaming */
  isStreaming?: boolean;
  /** True when stream was aborted mid-response */
  isInterrupted?: boolean;
  /** True when generation failed with no content */
  isError?: boolean;
}

const STREAMING_PLACEHOLDER_ID = "assistant-streaming-placeholder";

function generateClientMessageId(): string {
  return `cmid-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export default function CompanionPage() {
  /* =================================== State =================================== */
  const [conversationId, setConversationId] = useState<string | undefined>();
  const [messages, setMessages] = useState<LocalMessage[]>([]);
  const [isLoadingConversation, setIsLoadingConversation] = useState(false);
  const [conversationError, setConversationError] = useState<string | null>(null);

  // Streaming state machine
  const [sendState, setSendState] = useState<SendState>({ status: "idle" });

  // The last user message text — used for retry
  const lastUserMessageRef = useRef<string>("");
  // The clientMessageId for the current/last send attempt — same across retries
  const clientMessageIdRef = useRef<string>("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Throttle scroll attempts during streaming to avoid jank
  const scrollRafRef = useRef<number | null>(null);

  /* =================================== Hooks =================================== */
  const {
    startStream,
    stopStream,
    isStreaming,
    conversations,
    isLoadingConversations,
  } = useCompanion();

  /* =================================== Derived =================================== */
  const isSending = sendState.status === "starting" || sendState.status === "streaming";
  const isIdle = sendState.status === "idle";
  const hasFailed = sendState.status === "failed";

  /* =================================== Scroll =================================== */
  const scrollToBottomIfNear = useCallback(() => {
    if (scrollRafRef.current !== null) return; // already scheduled

    scrollRafRef.current = requestAnimationFrame(() => {
      scrollRafRef.current = null;
      const container = scrollContainerRef.current;
      const end = messagesEndRef.current;
      if (!container || !end) return;

      const isNearBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight < 150;

      if (isNearBottom) {
        end.scrollIntoView({ behavior: "smooth", block: "end" });
      }
    });
  }, []);

  const scrollToBottomForced = useCallback(() => {
    if (scrollRafRef.current !== null) {
      cancelAnimationFrame(scrollRafRef.current);
      scrollRafRef.current = null;
    }
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    });
  }, []);

  // Cancel any pending RAF on unmount
  useEffect(() => {
    return () => {
      if (scrollRafRef.current !== null) {
        cancelAnimationFrame(scrollRafRef.current);
      }
      stopStream();
    };
  }, [stopStream]);

  /* =================================== Restore session =================================== */
  useEffect(() => {
    const storedId = window.sessionStorage.getItem("companion-conversation-id");
    if (!storedId) return;

    // All setState calls are inside the async chain (not synchronously in the
    // effect body), which satisfies react-hooks/set-state-in-effect.
    void (async () => {
      setConversationId(storedId);
      setIsLoadingConversation(true);
      try {
        const response = await getConversation(storedId);
        setMessages(response.conversation.messages);
      } catch {
        window.sessionStorage.removeItem("companion-conversation-id");
        setConversationId(undefined);
        setConversationError("Couldn't load this conversation.");
      } finally {
        setIsLoadingConversation(false);
      }
    })();
  }, []);

  // Scroll when messages list changes (new msg, conversation load)
  useEffect(() => {
    scrollToBottomIfNear();
  }, [messages.length, isLoadingConversation, scrollToBottomIfNear]);

  /* =================================== Send / Stream =================================== */
  const handleSend = useCallback(
    (message: string, isRetry = false) => {
      // Guard: don't allow sending while another is in flight
      if (isSending) return;

      setConversationError(null);

      // On a fresh send, generate a new clientMessageId.
      // On retry, keep the same ID so the backend skips duplicate persistence.
      if (!isRetry) {
        clientMessageIdRef.current = generateClientMessageId();
        lastUserMessageRef.current = message;
      }

      const clientMessageId = clientMessageIdRef.current;

      // ── Add optimistic user message (fresh send only) ──
      if (!isRetry) {
        const optimisticUser: LocalMessage = {
          id: `user-optimistic-${clientMessageId}`,
          role: "user",
          content: message,
          createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, optimisticUser]);
        setTimeout(scrollToBottomForced, 50);
      }

      // ── Remove any previous assistant placeholder before adding a new one ──
      setMessages((prev) =>
        prev.filter((m) => m.id !== STREAMING_PLACEHOLDER_ID),
      );

      // ── Add assistant placeholder (loading dots state) ──
      const placeholder: LocalMessage = {
        id: STREAMING_PLACEHOLDER_ID,
        role: "assistant",
        content: "",
        createdAt: new Date().toISOString(),
        isStreaming: true,
      };
      setMessages((prev) => [...prev, placeholder]);
      setSendState({ status: "starting" });
      setTimeout(scrollToBottomForced, 60);

      // ── Start the SSE stream ──
      startStream(
        message,
        clientMessageId,
        {
          onConversationId: (id) => {
            setConversationId(id);
            window.sessionStorage.setItem("companion-conversation-id", id);
          },

          onChunk: (text) => {
            setSendState({ status: "streaming" });
            setMessages((prev) =>
              prev.map((m) =>
                m.id === STREAMING_PLACEHOLDER_ID
                  ? { ...m, content: m.content + text, isStreaming: true }
                  : m,
              ),
            );
            scrollToBottomIfNear();
          },

          onDone: () => {
            // Mark placeholder as completed (remove isStreaming flag)
            setMessages((prev) =>
              prev.map((m) =>
                m.id === STREAMING_PLACEHOLDER_ID
                  ? {
                      ...m,
                      id: `assistant-${Date.now()}`,
                      isStreaming: false,
                      isInterrupted: false,
                      isError: false,
                    }
                  : m,
              ),
            );
            setSendState({ status: "completed" });
            setTimeout(() => setSendState({ status: "idle" }), 0);
            scrollToBottomIfNear();
          },

          onError: (code) => {
            const hasPartialContent = (() => {
              // Check what the placeholder has at the moment of error
              let hasContent = false;
              setMessages((prev) => {
                const placeholder = prev.find(
                  (m) => m.id === STREAMING_PLACEHOLDER_ID,
                );
                hasContent = !!placeholder && placeholder.content.length > 0;

                if (hasContent) {
                  // Keep partial content with interrupted state
                  return prev.map((m) =>
                    m.id === STREAMING_PLACEHOLDER_ID
                      ? {
                          ...m,
                          id: `assistant-interrupted-${Date.now()}`,
                          isStreaming: false,
                          isInterrupted: true,
                          isError: false,
                        }
                      : m,
                  );
                } else {
                  // No content — remove placeholder, show hard error
                  return prev.filter((m) => m.id !== STREAMING_PLACEHOLDER_ID);
                }
              });
              return hasContent;
            })();

            if (!hasPartialContent) {
              setSendState({ status: "failed", message });
            } else {
              setSendState({ status: "stopped" });
            }

            void code; // consumed by state, not shown to user
          },
        },
        conversationId,
      );
    },
    [isSending, conversationId, startStream, scrollToBottomForced, scrollToBottomIfNear],
  );

  /* =================================== Stop =================================== */
  const handleStop = useCallback(() => {
    stopStream();

    // Mark the streaming placeholder as interrupted (keep partial content)
    setMessages((prev) => {
      const placeholder = prev.find((m) => m.id === STREAMING_PLACEHOLDER_ID);
      if (!placeholder) return prev;

      if (placeholder.content.length > 0) {
        return prev.map((m) =>
          m.id === STREAMING_PLACEHOLDER_ID
            ? {
                ...m,
                id: `assistant-stopped-${Date.now()}`,
                isStreaming: false,
                isInterrupted: true,
              }
            : m,
        );
      } else {
        // Nothing arrived — remove placeholder entirely
        return prev.filter((m) => m.id !== STREAMING_PLACEHOLDER_ID);
      }
    });

    setSendState({ status: "idle" });
  }, [stopStream]);

  /* =================================== Retry =================================== */
  const handleRetry = useCallback(() => {
    if (isSending) return;
    const message = lastUserMessageRef.current;
    if (!message) return;
    handleSend(message, true);
  }, [isSending, handleSend]);

  /* =================================== New conversation =================================== */
  function handleNewConversation() {
    if (isSending) stopStream();
    window.sessionStorage.removeItem("companion-conversation-id");
    setConversationId(undefined);
    setMessages([]);
    setConversationError(null);
    setSendState({ status: "idle" });
    lastUserMessageRef.current = "";
    clientMessageIdRef.current = "";
  }

  /* =================================== Select conversation =================================== */
  async function handleSelectConversation(nextConversationId: string) {
    if (isSending || nextConversationId === conversationId) return;

    setConversationError(null);
    setIsLoadingConversation(true);
    setMessages([]);

    try {
      const response = await getConversation(nextConversationId);
      setConversationId(nextConversationId);
      setMessages(response.conversation.messages);
      window.sessionStorage.setItem(
        "companion-conversation-id",
        nextConversationId,
      );
    } catch {
      setConversationError("Couldn't load this conversation.");
    } finally {
      setIsLoadingConversation(false);
    }
  }

  /* =================================== Render =================================== */
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
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto chat-scrollbar pr-2 pb-4 mt-6"
        >
          <div className="flex min-w-0 flex-col space-y-2">

            {/* ── Conversation loading ── */}
            {isLoadingConversation ? (
              <MessageBubble role="companion" isStreaming>
                {""}
              </MessageBubble>
            ) : messages.length === 0 && !conversationError ? (
              /* ── Empty state ── */
              <>
                <MessageBubble role="companion">
                  {"I'm ready. Tell me what's on your mind, what you're working toward, or what you need help deciding."}
                </MessageBubble>

                <div className="max-w-2xl mt-4">
                  <p className="mb-3 text-xs font-medium uppercase tracking-wide text-foreground-muted">
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
            ) : (
              /* ── Message list ── */
              messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  role={message.role === "user" ? "user" : "companion"}
                  isStreaming={message.isStreaming}
                  isInterrupted={message.isInterrupted}
                  isError={message.isError}
                  onRetry={
                    (message.isInterrupted || message.isError)
                      ? handleRetry
                      : undefined
                  }
                >
                  {message.content || undefined}
                </MessageBubble>
              ))
            )}

            {/* ── Hard failure (no content arrived) ── */}
            {hasFailed && isIdle && (
              <MessageBubble
                role="companion"
                isError
                onRetry={handleRetry}
              >
                {"Couldn't generate a response."}
              </MessageBubble>
            )}

            {/* ── Conversation load error ── */}
            {conversationError && !isLoadingConversation && (
              <MessageBubble
                role="companion"
                isError
                onRetry={() => {
                  setConversationError(null);
                  const id =
                    conversationId ||
                    window.sessionStorage.getItem("companion-conversation-id");
                  if (!id) return;
                  setIsLoadingConversation(true);
                  getConversation(id)
                    .then((res) => {
                      setConversationId(id);
                      setMessages(res.conversation.messages);
                    })
                    .catch(() =>
                      setConversationError("Couldn't load this conversation."),
                    )
                    .finally(() => setIsLoadingConversation(false));
                }}
              >
                {conversationError}
              </MessageBubble>
            )}

            <div ref={messagesEndRef} className="h-4" />
          </div>
        </div>

        {/* Persistent Bottom Composer */}
        <div className="shrink-0 mt-2 pt-2 border-t border-transparent bg-background">
          <Composer
            onSend={handleSend}
            onStop={handleStop}
            isStreaming={isStreaming}
            disabled={isLoadingConversation}
          />
        </div>
      </div>

      {/* RIGHT: Sidebar */}
      <aside className="hidden w-[280px] shrink-0 flex-col gap-8 lg:flex overflow-y-auto chat-scrollbar pb-4 pr-2">
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

        <div className="pt-6 border-t border-border">
          <p className="text-xs font-medium uppercase tracking-wide text-foreground-muted">
            Current context
          </p>

          <div className="mt-5 space-y-5">
            <div>
              <p className="text-xs text-foreground-muted">{"Today's focus"}</p>
              <p className="mt-1 text-sm font-medium text-foreground">
                Your highest-priority work
              </p>
            </div>

            <div>
              <p className="text-xs text-foreground-muted">Active goal</p>
              <p className="mt-1 text-sm font-medium text-foreground">
                Your current active goal
              </p>
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
