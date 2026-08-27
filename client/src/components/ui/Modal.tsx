"use client";

import type { ReactNode } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
}

export default function Modal({
  open,
  onClose,
  title,
  description,
  children,
}: ModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close modal"
        onClick={onClose}
        className="absolute inset-0 bg-black/20"
      />

      <div className="relative w-full max-w-lg rounded-2xl border border-neutral-200 bg-white p-6 text-neutral-950 shadow-xl dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">{title}</h2>

            {description && (
              <p className="mt-1 text-sm leading-6 text-neutral-500 dark:text-neutral-400">
                {description}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
          >
            ×
          </button>
        </div>

        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}
