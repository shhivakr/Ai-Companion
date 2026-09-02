"use client";

export default function LoadingDots() {
  return (
    <div
      role="status"
      aria-label="Loading"
      className="flex items-center justify-center gap-2.5"
    >
      <div className="h-3.5 w-3.5 rounded-full bg-foreground animate-loading-jump" />
      <div
        className="h-3.5 w-3.5 rounded-full bg-foreground animate-loading-jump"
        style={{ animationDelay: "150ms" }}
      />
      <div
        className="h-3.5 w-3.5 rounded-full bg-foreground animate-loading-jump"
        style={{ animationDelay: "300ms" }}
      />
      <span className="sr-only">Loading...</span>
    </div>
  );
}
