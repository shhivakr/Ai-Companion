"use client";

import type { ConversationSummary } from "@/lib/api/companion.api";

interface ConversationListProps {
  conversations: ConversationSummary[];
  activeConversationId?: string;
  isLoading?: boolean;
  onSelect: (conversationId: string) => void;
}

function formatConversationDate(dateString: string) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const now = new Date();

  const isToday =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  if (isToday) {
    return date.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
    });
  }

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export default function ConversationList({
  conversations,
  activeConversationId,
  isLoading = false,
  onSelect,
}: ConversationListProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        <div className="h-10 animate-pulse rounded-lg bg-surface-elevated" />
        <div className="h-10 animate-pulse rounded-lg bg-surface-elevated" />
        <div className="h-10 animate-pulse rounded-lg bg-surface-elevated" />
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <p className="text-sm leading-5 text-foreground-secondary">
        Your conversations will appear here.
      </p>
    );
  }

  return (
    <div className="space-y-1">
      {conversations.map((conversation) => {
        const active = conversation.conversationId === activeConversationId;

        return (
          <button
            key={conversation.conversationId}
            type="button"
            onClick={() => onSelect(conversation.conversationId)}
            className={[
              "w-full rounded-lg px-3 py-2.5 text-left transition-all border",
              active ? "bg-surface-elevated border-border shadow-sm" : "border-transparent hover:bg-surface-elevated",
            ].join(" ")}
          >
            <div className="flex items-start justify-between gap-3">
              <p
                className={[
                  "min-w-0 flex-1 truncate text-sm",
                  active
                    ? "font-medium text-foreground"
                    : "text-foreground-secondary",
                ].join(" ")}
              >
                {conversation.title}
              </p>

              <span className="shrink-0 text-[11px] text-foreground-muted">
                {formatConversationDate(conversation.updatedAt)}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
