"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MessageBubbleProps {
  role: "user" | "companion";
  children: React.ReactNode;
}

export default function MessageBubble({ role, children }: MessageBubbleProps) {
  const isUser = role === "user";

  return (
    <div
      className={[
        "max-w-2xl rounded-2xl px-5 py-4",
        isUser
          ? "ml-auto bg-neutral-950 text-white"
          : "border border-neutral-200 bg-white text-neutral-950",
      ].join(" ")}
    >
      {isUser ? (
        <p className="whitespace-pre-wrap text-sm leading-6">{children}</p>
      ) : (
        <div className="text-sm leading-6">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => (
                <h1 className="mb-3 text-xl font-semibold">{children}</h1>
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

              p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,

              ul: ({ children }) => (
                <ul className="mb-3 list-disc space-y-1 pl-5">{children}</ul>
              ),

              ol: ({ children }) => (
                <ol className="mb-3 list-decimal space-y-1 pl-5">{children}</ol>
              ),

              li: ({ children }) => <li>{children}</li>,

              strong: ({ children }) => (
                <strong className="font-semibold">{children}</strong>
              ),

              blockquote: ({ children }) => (
                <blockquote className="my-3 border-l-2 border-neutral-300 pl-4 text-neutral-600">
                  {children}
                </blockquote>
              ),

              hr: () => <hr className="my-4 border-neutral-200" />,
            }}
          >
            {String(children)}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
}
