import type { HTMLAttributes } from "react";

export default function Card({
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-2xl border border-neutral-200 bg-white text-neutral-950 dark:!border-neutral-800 dark:!bg-neutral-900 dark:!text-neutral-100 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
