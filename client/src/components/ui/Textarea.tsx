import type { TextareaHTMLAttributes } from "react";

export default function Textarea({
  className = "",
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={`min-h-24 w-full resize-y rounded-xl border border-border bg-surface-elevated px-3.5 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-foreground-muted hover:border-foreground-muted focus:border-foreground-muted focus:ring-4 focus:ring-foreground-muted/15 disabled:cursor-not-allowed disabled:bg-surface disabled:text-foreground-muted ${className}`}
      {...props}
    />
  );
}
