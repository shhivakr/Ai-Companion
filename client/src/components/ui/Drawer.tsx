"use client";

import type { ReactNode } from "react";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export default function Drawer({
  open,
  onClose,
  title,
  children,
}: DrawerProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Close drawer"
        onClick={onClose}
        className="absolute inset-0 bg-black/20"
      />

      <aside className="absolute right-0 top-0 h-full w-full max-w-md border-l border-neutral-200 bg-white text-neutral-950 shadow-xl dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100">
        <div className="flex h-16 items-center justify-between border-b border-neutral-200 px-5 dark:border-neutral-800">
          <h2 className="text-base font-semibold">{title}</h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-900"
          >
            ×
          </button>
        </div>

        <div className="h-[calc(100%-4rem)] overflow-y-auto p-5">
          {children}
        </div>
      </aside>
    </div>
  );
}
