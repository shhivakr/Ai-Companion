"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import LoadingDots from "@/components/ui/LoadingDots";

interface MessageBubbleProps {
  role: "user" | "companion";
  children?: React.ReactNode;
  /** True while the assistant message is still being streamed */
  isStreaming?: boolean;
  /** True when the response ended in a hard error (no text) */
  isError?: boolean;
  /** True when the stream was stopped mid-response (has partial text) */
  isInterrupted?: boolean;
  onRetry?: () => void;
}

export default function MessageBubble({
  role,
  children,
  isStreaming,
  isError,
  isInterrupted,
  onRetry,
}: MessageBubbleProps) {
  const isUser = role === "user";

  // ─── User bubble ──────────────────────────────────────────────────────────
  if (isUser) {
    return (
      <div className="flex w-full justify-end mb-8 animate-message-fade-in">
        <div className="max-w-[85%] sm:max-w-md md:max-w-lg rounded-2xl bg-foreground px-4 py-3 text-background">
          <p className="whitespace-pre-wrap text-sm leading-6">{children}</p>
        </div>
      </div>
    );
  }

  // ─── Companion bubble ─────────────────────────────────────────────────────
  const hasContent =
    typeof children === "string"
      ? children.length > 0
      : children !== undefined && children !== null;

  return (
    // animate-message-fade-in is on the wrapper: it fires once on mount.
    // Content updates (streaming) do NOT replay this because the DOM node
    // is stable — only its children change.
    <div className="flex w-full gap-4 mb-8 animate-message-fade-in">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface border border-border text-xs font-semibold text-foreground-secondary mt-1">
        C
      </div>
      <div className="flex-1 min-w-0">
        <div className="mb-1">
          <span className="text-xs font-medium text-foreground-secondary">
            Companion
          </span>
        </div>

        {/* Loading dots — shown only while streaming with no content yet */}
        {isStreaming && !hasContent && (
          <LoadingDots />
        )}

        {/* Streamed / completed text */}
        {hasContent && (
          <div
            className="text-sm leading-7 text-foreground"
            // aria-busy lets screen readers know content is still arriving
            aria-busy={isStreaming ? "true" : undefined}
            aria-live={isStreaming ? "polite" : undefined}
          >
            {isError ? (
              <span className="text-foreground-secondary">{children}</span>
            ) : typeof children === "string" ? (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children }) => (
                    <h1 className="mb-4 mt-6 text-xl font-semibold first:mt-0">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="mb-3 mt-5 text-lg font-semibold first:mt-0">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="mb-2 mt-4 text-base font-semibold">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="mb-4 last:mb-0">{children}</p>
                  ),
                  ul: ({ children }) => (
                    <ul className="mb-4 list-disc space-y-1 pl-5 last:mb-0">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="mb-4 list-decimal space-y-1 pl-5 last:mb-0">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => <li>{children}</li>,
                  strong: ({ children }) => (
                    <strong className="font-semibold">{children}</strong>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="my-4 border-l-2 border-border pl-4 text-foreground-secondary italic">
                      {children}
                    </blockquote>
                  ),
                  hr: () => <hr className="my-6 border-border" />,
                }}
              >
                {children}
              </ReactMarkdown>
            ) : (
              children
            )}
          </div>
        )}

        {/* Interrupted notice — shown below partial content when stream was stopped */}
        {isInterrupted && hasContent && !isError && (
          <div className="mt-3 flex items-center gap-3">
            <span className="text-xs text-foreground-muted">
              Response interrupted.
            </span>
            {onRetry && (
              <button
                onClick={onRetry}
                className="rounded-lg border border-border bg-surface-elevated px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-border focus:outline-none focus:ring-2 focus:ring-foreground-muted"
                aria-label="Retry generating response"
              >
                Try again
              </button>
            )}
          </div>
        )}

        {/* Hard error — no content, show error + retry */}
        {isError && (
          <div className="mt-1 flex items-center gap-3">
            {onRetry && (
              <button
                onClick={onRetry}
                className="rounded-lg border border-border bg-surface-elevated px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-border focus:outline-none focus:ring-2 focus:ring-foreground-muted"
                aria-label="Retry generating response"
              >
                Try again
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
