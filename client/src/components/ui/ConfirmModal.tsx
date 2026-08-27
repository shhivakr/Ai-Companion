"use client";

import Button from "@/components/ui/Button";

interface ConfirmModalProps {
  open: boolean;
  title?: string;
  description?: string;
  confirmLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  open,
  title = "Delete task?",
  description = "This action cannot be undone.",
  confirmLabel = "Delete",
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) {
          onCancel();
        }
      }}
    >
      <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 text-neutral-950 shadow-xl dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100">
        <h2 className="text-lg font-semibold">{title}</h2>

        <p className="mt-2 text-sm leading-6 text-neutral-500 dark:text-neutral-400">
          {description}
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="bg-neutral-950 text-white hover:bg-neutral-800 dark:bg-neutral-50 dark:text-neutral-950 dark:hover:bg-white"
          >
            {loading ? "Deleting..." : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
