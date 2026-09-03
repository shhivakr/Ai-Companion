"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

interface ComposerProps {
  onSend: (message: string) => void;
  onStop: () => void;
  isStreaming: boolean;
  disabled?: boolean;
}

export default function Composer({
  onSend,
  onStop,
  isStreaming,
  disabled = false,
}: ComposerProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Focus composer when returning to idle (after stop or completion)
  useEffect(() => {
    if (!isStreaming && !disabled) {
      textareaRef.current?.focus();
    }
  }, [isStreaming, disabled]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isStreaming || disabled) return;

    const trimmedMessage = message.trim();
    if (!trimmedMessage) return;

    setMessage("");
    onSend(trimmedMessage);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (!isStreaming && !disabled && message.trim()) {
        event.currentTarget.form?.requestSubmit();
      }
    }
  }

  const isInputDisabled = isStreaming || disabled;
  const canSend = !isStreaming && !disabled && message.trim().length > 0;

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-border bg-surface-elevated p-4 transition-all focus-within:border-foreground-muted focus-within:ring-1 focus-within:ring-foreground-muted shadow-sm"
    >
      <textarea
        ref={textareaRef}
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        onKeyDown={handleKeyDown}
        rows={2}
        disabled={isInputDisabled}
        placeholder="What's on your mind?"
        aria-label="Write a message"
        aria-disabled={isInputDisabled}
        className="w-full resize-none border-0 bg-transparent px-2 py-1 text-sm text-foreground outline-none placeholder:text-foreground-muted disabled:cursor-not-allowed disabled:opacity-60"
      />

      <div className="mt-2 flex items-center justify-between">
        <p className="text-xs text-foreground-muted">
          Companion uses your relevant context.
        </p>

        {isStreaming ? (
          <button
            type="button"
            onClick={onStop}
            aria-label="Stop generating response"
            className="rounded-lg border border-border bg-surface-elevated px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-border focus:outline-none focus:ring-2 focus:ring-foreground-muted"
          >
            Stop
          </button>
        ) : (
          <button
            type="submit"
            disabled={!canSend}
            aria-label="Send message"
            className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Send
          </button>
        )}
      </div>
    </form>
  );
}
