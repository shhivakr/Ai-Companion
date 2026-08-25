interface MessageBubbleProps {
  role: "user" | "companion";
  children: React.ReactNode;
}

export default function MessageBubble({ role, children }: MessageBubbleProps) {
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={[
          "max-w-2xl rounded-2xl px-4 py-3 text-sm leading-6",
          isUser
            ? "bg-neutral-950 text-white"
            : "border border-neutral-200 bg-white text-neutral-800",
        ].join(" ")}
      >
        {children}
      </div>
    </div>
  );
}
