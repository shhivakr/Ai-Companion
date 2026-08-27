import type { TextareaHTMLAttributes } from "react";

export default function Textarea({
  className = "",
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={`min-h-24 w-full resize-y rounded-xl border border-neutral-200 bg-white px-3.5 py-3 text-sm text-neutral-950 outline-none transition-colors placeholder:text-neutral-400 hover:border-neutral-300 focus:border-neutral-400 focus:ring-4 focus:ring-neutral-100 disabled:cursor-not-allowed disabled:bg-neutral-50 disabled:text-neutral-400 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-50 dark:placeholder:text-neutral-500 dark:hover:border-neutral-700 dark:focus:border-neutral-700 dark:focus:ring-neutral-900/40 dark:disabled:bg-neutral-900 dark:disabled:text-neutral-500 ${className}`}
      {...props}
    />
  );
}
