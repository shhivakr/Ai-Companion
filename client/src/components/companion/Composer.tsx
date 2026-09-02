"use client";

import { FormEvent, useState } from "react";

interface ComposerProps {
  onSend: (message: string) => Promise<void>;
  disabled?: boolean;
}

export default function Composer({ onSend, disabled = false }: ComposerProps) {
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedMessage = message.trim();

    if (!trimmedMessage || disabled) {
      return;
    }

    setMessage("");

    try {
      await onSend(trimmedMessage);
    } catch {
      setMessage(trimmedMessage);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-border bg-surface-elevated p-4 transition-all focus-within:border-foreground-muted focus-within:ring-1 focus-within:ring-foreground-muted shadow-sm"
    >
      <textarea
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();

            event.currentTarget.form?.requestSubmit();
          }
        }}
        rows={2}
        disabled={disabled}
        placeholder="What's on your mind?"
        className="w-full resize-none border-0 bg-transparent px-2 py-1 text-sm text-foreground outline-none placeholder:text-foreground-muted disabled:cursor-not-allowed disabled:opacity-60"
      />

      <div className="mt-2 flex items-center justify-between">
        <p className="text-xs text-foreground-muted">
          Companion uses your relevant context.
        </p>

        <button
          type="submit"
          disabled={disabled || !message.trim()}
          className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {disabled ? "Thinking..." : "Send"}
        </button>
      </div>
    </form>
  );
}
