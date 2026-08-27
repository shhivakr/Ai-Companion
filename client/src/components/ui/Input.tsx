import type { InputHTMLAttributes } from "react";

export default function Input({
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`h-11 w-full rounded-xl border border-border bg-surface-elevated px-3.5 text-sm text-foreground outline-none transition-colors placeholder:text-foreground-muted hover:border-foreground-muted focus:border-foreground-muted focus:ring-4 focus:ring-foreground-muted/15 disabled:cursor-not-allowed disabled:bg-surface disabled:text-foreground-muted ${className}`}
      {...props}
    />
  );
}
