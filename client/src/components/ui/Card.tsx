import type { HTMLAttributes } from "react";

export default function Card({
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-2xl border border-border bg-surface text-foreground dark:!border-border dark:!bg-surface dark:!text-foreground ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
