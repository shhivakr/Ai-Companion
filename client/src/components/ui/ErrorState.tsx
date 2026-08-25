import type { ReactNode } from "react";

interface ErrorStateProps {
  title?: string;
  description?: string;
  action?: ReactNode;
}

export default function ErrorState({
  title = "Something went wrong",
  description = "We couldn't load this information. Please try again.",
  action,
}: ErrorStateProps) {
  return (
    <div className="flex min-h-60 items-center justify-center rounded-2xl border border-neutral-200 bg-white p-8">
      <div className="max-w-sm text-center">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-sm font-semibold text-neutral-600">
          !
        </div>

        <h3 className="mt-4 text-sm font-semibold text-neutral-950">{title}</h3>

        <p className="mt-2 text-sm leading-6 text-neutral-500">{description}</p>

        {action && <div className="mt-5">{action}</div>}
      </div>
    </div>
  );
}
