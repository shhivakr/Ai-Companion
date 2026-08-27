import type { HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "muted";
}

export default function Badge({
  variant = "default",
  className = "",
  children,
  ...props
}: BadgeProps) {
  const variants = {
    default:
      "border border-neutral-200 bg-neutral-100 text-neutral-700 dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-100",
    muted:
      "border border-transparent bg-neutral-50 text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
