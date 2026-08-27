import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
}

export default function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const variants = {
    primary:
      "bg-neutral-950 text-white hover:bg-neutral-800 dark:bg-neutral-50 dark:text-neutral-950 dark:hover:bg-white",
    secondary:
      "border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800",
    ghost:
      "text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-900",
  };

  return (
    <button
      className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 dark:focus-visible:ring-neutral-600 dark:focus-visible:ring-offset-neutral-950 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
