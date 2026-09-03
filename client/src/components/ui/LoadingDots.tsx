"use client";

export default function LoadingDots() {
  return (
    <div
      role="status"
      aria-label="Loading"
      className="flex items-center justify-start gap-1.5 h-7"
    >
      <div className="h-1.5 w-1.5 rounded-full bg-foreground-muted animate-loading-jump" />
      <div
        className="h-1.5 w-1.5 rounded-full bg-foreground-muted animate-loading-jump"
        style={{ animationDelay: "150ms" }}
      />
      <div
        className="h-1.5 w-1.5 rounded-full bg-foreground-muted animate-loading-jump"
        style={{ animationDelay: "300ms" }}
      />
      <span className="sr-only">Loading...</span>
    </div>
  );
}
