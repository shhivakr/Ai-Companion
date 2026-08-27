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
      className="rounded-2xl border border-neutral-200 bg-white p-3"
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
        className="w-full resize-none border-0 bg-transparent px-2 py-1 text-sm outline-none placeholder:text-neutral-400 disabled:cursor-not-allowed disabled:opacity-60"
      />

      <div className="mt-2 flex items-center justify-between">
        <p className="text-xs text-neutral-400">
          Companion uses your relevant context.
        </p>

        <button
          type="submit"
          disabled={disabled || !message.trim()}
          className="rounded-lg bg-neutral-950 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {disabled ? "Thinking..." : "Send"}
        </button>
      </div>
    </form>
  );
}
