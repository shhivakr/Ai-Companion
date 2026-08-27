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
    <div className="flex min-h-60 items-center justify-center rounded-2xl border border-dashed border-neutral-200 bg-white p-8 text-neutral-950 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100">
      <div className="max-w-sm text-center">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-sm font-medium text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
          —
        </div>

        <h3 className="mt-4 text-sm font-semibold">{title}</h3>

        <p className="mt-2 text-sm leading-6 text-neutral-500 dark:text-neutral-400">
          {description}
        </p>

        {action && <div className="mt-5">{action}</div>}
      </div>
    </div>
  );
}
