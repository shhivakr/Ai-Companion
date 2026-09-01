"use client";

import type { ReactNode } from "react";

interface MemoryModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function MemoryModal({
  open,
  onClose,
  children,
}: MemoryModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-lg rounded-2xl border border-border bg-surface p-6 text-foreground shadow-xl">
        {children}
      </div>
    </div>
  );
}
