"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MessageBubbleProps {
  role: "user" | "companion";
  children: React.ReactNode;
}

export default function MessageBubble({ role, children }: MessageBubbleProps) {
  const isUser = role === "user";

  if (isUser) {
    return (
      <div className="flex w-full justify-end mb-8">
        <div className="max-w-[85%] sm:max-w-md md:max-w-lg rounded-2xl border border-border bg-surface-elevated px-4 py-3 text-foreground">
          <p className="whitespace-pre-wrap text-sm leading-6">{children}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full gap-4 mb-8">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-elevated border border-border text-xs font-semibold text-foreground-secondary">
        C
      </div>
      <div className="flex-1 min-w-0">
        <div className="mb-1">
          <span className="text-xs font-medium text-foreground-secondary">Companion</span>
        </div>
        <div className="text-sm leading-7 text-foreground">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => <h1 className="mb-4 mt-6 text-xl font-semibold first:mt-0">{children}</h1>,
              h2: ({ children }) => <h2 className="mb-3 mt-5 text-lg font-semibold first:mt-0">{children}</h2>,
              h3: ({ children }) => <h3 className="mb-2 mt-4 text-base font-semibold">{children}</h3>,
              p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
              ul: ({ children }) => <ul className="mb-4 list-disc space-y-1 pl-5 last:mb-0">{children}</ul>,
              ol: ({ children }) => <ol className="mb-4 list-decimal space-y-1 pl-5 last:mb-0">{children}</ol>,
              li: ({ children }) => <li>{children}</li>,
              strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
              blockquote: ({ children }) => (
                <blockquote className="my-4 border-l-2 border-border pl-4 text-foreground-secondary italic">
                  {children}
                </blockquote>
              ),
              hr: () => <hr className="my-6 border-border" />,
            }}
          >
            {String(children)}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
