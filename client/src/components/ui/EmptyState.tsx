import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
}

export default function EmptyState({
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex min-h-60 items-center justify-center rounded-2xl border border-dashed border-border bg-surface p-8 text-foreground">
      <div className="max-w-sm text-center">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-surface-elevated text-sm font-medium text-foreground-muted">
          —
        </div>

        <h3 className="mt-4 text-sm font-semibold">{title}</h3>

        <p className="mt-2 text-sm leading-6 text-foreground-secondary">
          {description}
        </p>

        {action && <div className="mt-5">{action}</div>}
      </div>
    </div>
  );
}
