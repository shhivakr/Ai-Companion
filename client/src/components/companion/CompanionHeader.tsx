"use client";

import Avatar from "@/components/ui/Avatar";

interface CompanionHeaderProps {
  onNewConversation?: () => void;
  disabled?: boolean;
}

export default function CompanionHeader({
  onNewConversation,
  disabled = false,
}: CompanionHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-border pb-5">
      <div className="flex items-center gap-3">
        <Avatar name="Companion" />

        <div>
          <h1 className="text-lg font-semibold">Companion</h1>

          <p className="text-xs text-foreground-secondary">
            Here to help you think, decide and move forward.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onNewConversation}
          disabled={disabled}
          className="rounded-lg border border-border px-3 py-2 text-xs font-medium text-foreground-secondary transition-colors hover:bg-surface-elevated hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
        >
          New conversation
        </button>

        <button
          type="button"
          className="rounded-lg border border-border px-3 py-2 text-xs font-medium text-foreground-secondary hover:bg-surface-elevated hover:text-foreground"
        >
          Context
        </button>
      </div>
    </div>
  );
}
