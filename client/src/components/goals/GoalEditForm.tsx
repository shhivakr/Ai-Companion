"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Button from "@/components/ui/Button";
import { useUpdateGoal } from "@/hooks/useGoals";

import {
  goalEditSchema,
  type GoalEditFormValues,
} from "@/lib/validation/goal.schema";

import type { Goal } from "@/lib/api/goals.api";
import { toast } from "sonner";

interface GoalEditFormProps {
  goal: Goal;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const inputClassName =
  "mt-2 w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-foreground outline-none transition placeholder:text-foreground-muted focus:border-foreground-muted focus:ring-2 focus:ring-foreground-muted/20";

export default function GoalEditForm({
  goal,
  onSuccess,
  onCancel,
}: GoalEditFormProps) {
  const updateGoalMutation = useUpdateGoal();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<GoalEditFormValues>({
    resolver: zodResolver(goalEditSchema),

    defaultValues: {
      title: goal.title,
      description: goal.description ?? "",
      category: goal.category ?? "",
      milestone: goal.milestone ?? "",
      nextAction: goal.nextAction ?? "",
      targetDate: goal.targetDate ? goal.targetDate.slice(0, 10) : "",
      progress: goal.progress,
      status: goal.status,
    },
  });

  const progress = useWatch({
    control,
    name: "progress",
  });

  async function onSubmit(values: GoalEditFormValues) {
    try {
      await updateGoalMutation.mutateAsync({
        id: goal._id,
        payload: {
          title: values.title.trim(),
          description: values.description?.trim() || undefined,
          category: values.category?.trim() || undefined,
          milestone: values.milestone?.trim() || undefined,
          nextAction: values.nextAction?.trim() || undefined,
          targetDate: values.targetDate || undefined,
          progress: values.progress,
          status: values.status,
        },
      });

      onSuccess?.();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to update goal.",
      );
    }
  }

  const isSaving = isSubmitting || updateGoalMutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Title */}

      <div>
        <label
          htmlFor="edit-goal-title"
          className="text-sm font-medium text-foreground"
        >
          Goal title
        </label>

        <input
          id="edit-goal-title"
          type="text"
          {...register("title")}
          className={inputClassName}
          disabled={isSaving}
        />

        {errors.title && (
          <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{errors.title.message}</p>
        )}
      </div>

      {/* Description */}

      <div>
        <label
          htmlFor="edit-goal-description"
          className="text-sm font-medium text-foreground"
        >
          Description
        </label>

        <textarea
          id="edit-goal-description"
          {...register("description")}
          rows={3}
          className={`${inputClassName} resize-none`}
          disabled={isSaving}
        />

        {errors.description && (
          <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Category + Status */}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="edit-goal-category"
            className="text-sm font-medium text-foreground"
          >
            Category
          </label>

          <input
            id="edit-goal-category"
            type="text"
            {...register("category")}
            className={inputClassName}
            disabled={isSaving}
          />

          {errors.category && (
            <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">
              {errors.category.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="edit-goal-status"
            className="text-sm font-medium text-foreground"
          >
            Status
          </label>

          <select
            id="edit-goal-status"
            {...register("status")}
            className={inputClassName}
            disabled={isSaving}
          >
            <option value="active">Active</option>

            <option value="completed">Completed</option>

            <option value="paused">Paused</option>
          </select>

          {errors.status && (
            <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">
              {errors.status.message}
            </p>
          )}
        </div>
      </div>

      {/* Progress */}

      <div>
        <div className="flex items-center justify-between">
          <label
            htmlFor="edit-goal-progress"
            className="text-sm font-medium text-foreground"
          >
            Progress
          </label>

          <span className="text-sm font-medium text-foreground-secondary">
            {progress ?? 0}%
          </span>
        </div>

        <input
          id="edit-goal-progress"
          type="range"
          min={0}
          max={100}
          step={1}
          {...register("progress", {
            valueAsNumber: true,
          })}
          disabled={isSaving}
          className="mt-3 w-full accent-foreground"
        />

        <div className="mt-1 flex justify-between text-[11px] text-foreground-muted">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>

        {errors.progress && (
          <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">
            {errors.progress.message}
          </p>
        )}
      </div>

      {/* Milestone */}

      <div>
        <label
          htmlFor="edit-goal-milestone"
          className="text-sm font-medium text-foreground"
        >
          Milestone
        </label>

        <input
          id="edit-goal-milestone"
          type="text"
          {...register("milestone")}
          className={inputClassName}
          disabled={isSaving}
        />

        {errors.milestone && (
          <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">
            {errors.milestone.message}
          </p>
        )}
      </div>

      {/* Next Action */}

      <div>
        <label
          htmlFor="edit-goal-next-action"
          className="text-sm font-medium text-foreground"
        >
          Next action
        </label>

        <input
          id="edit-goal-next-action"
          type="text"
          {...register("nextAction")}
          className={inputClassName}
          disabled={isSaving}
        />

        {errors.nextAction && (
          <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">
            {errors.nextAction.message}
          </p>
        )}
      </div>

      {/* Target Date */}

      <div>
        <label
          htmlFor="edit-goal-target-date"
          className="text-sm font-medium text-foreground"
        >
          Target date
        </label>

        <input
          id="edit-goal-target-date"
          type="date"
          {...register("targetDate")}
          className={inputClassName}
          disabled={isSaving}
        />

        {errors.targetDate && (
          <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">
            {errors.targetDate.message}
          </p>
        )}
      </div>

      {/* API Error */}

      {updateGoalMutation.isError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 dark:border-red-900/50 dark:bg-red-900/20">
          <p className="text-sm text-red-600 dark:text-red-400">
            {updateGoalMutation.error instanceof Error
              ? updateGoalMutation.error.message
              : "Unable to update goal."}
          </p>
        </div>
      )}

      {/* Actions */}

      <div className="flex justify-end gap-3 border-t border-border pt-5">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSaving}
        >
          Cancel
        </Button>

        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
