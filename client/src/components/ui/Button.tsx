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
    primary: "bg-neutral-950 text-white hover:bg-neutral-800",
    secondary:
      "border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50",
    ghost: "text-neutral-700 hover:bg-neutral-100",
  };

  return (
    <button
      className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
