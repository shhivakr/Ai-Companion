"use client";

import { useDeleteGoal } from "@/hooks/useGoals";

import Button from "@/components/ui/Button";
import { toast } from "sonner";

interface GoalDeleteDialogProps {
  goalId: string;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function GoalDeleteDialog({
  goalId,
  open,
  onClose,
  onSuccess,
}: GoalDeleteDialogProps) {
  const deleteGoalMutation = useDeleteGoal();

  if (!open) {
    return null;
  }

  async function handleDelete() {
    try {
      await deleteGoalMutation.mutateAsync(goalId);

      onSuccess?.();
    } catch (error) {
  toast.error(
    error instanceof Error
      ? error.message
      : "Unable to delete goal.",
  );
}
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-neutral-950/30 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-goal-title"
    >
      <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-xl">
        <h2
          id="delete-goal-title"
          className="text-lg font-semibold text-neutral-950"
        >
          Delete this goal?
        </h2>

        <p className="mt-2 text-sm leading-6 text-neutral-500">
          This will permanently remove the goal and its associated progress.
          This action cannot be undone.
        </p>

        {deleteGoalMutation.isError && (
          <p className="mt-4 text-sm text-red-600">
            {deleteGoalMutation.error instanceof Error
              ? deleteGoalMutation.error.message
              : "Unable to delete goal."}
          </p>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={deleteGoalMutation.isPending}
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="ghost"
            className="text-red-600 hover:bg-red-50"
            onClick={handleDelete}
            disabled={deleteGoalMutation.isPending}
          >
            {deleteGoalMutation.isPending ? "Deleting..." : "Delete goal"}
          </Button>
        </div>
      </div>
    </div>
  );
}
