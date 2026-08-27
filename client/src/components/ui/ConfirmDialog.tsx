"use client";

import Button from "./Button";
import Modal from "./Modal";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  destructive?: boolean;
}

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  destructive = false,
}: ConfirmDialogProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      description={description}
    >
      <div className="flex justify-end gap-3">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>

        <Button
          onClick={onConfirm}
          className={
            destructive
              ? "bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:text-white dark:hover:bg-red-600"
              : undefined
          }
        >
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
