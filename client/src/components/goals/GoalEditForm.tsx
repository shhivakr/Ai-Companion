"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Button from "@/components/ui/Button";
import { useUpdateGoal } from "@/hooks/useGoals";

import {
  goalEditSchema,
  type GoalEditFormValues,
} from "@/lib/validation/goal.schema";

import type { Goal } from "@/lib/api/goals.api";

interface GoalEditFormProps {
  goal: Goal;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const inputClassName =
  "mt-2 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-neutral-400 focus:ring-2 focus:ring-neutral-100";

export default function GoalEditForm({
  goal,
  onSuccess,
  onCancel,
}: GoalEditFormProps) {
  const updateGoalMutation = useUpdateGoal();

  const {
    register,
    handleSubmit,
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
    } catch {
      // Mutation error is displayed below.
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label htmlFor="edit-goal-title" className="text-sm font-medium">
          Goal title
        </label>

        <input
          id="edit-goal-title"
          {...register("title")}
          className={inputClassName}
        />

        {errors.title && (
          <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="edit-goal-description" className="text-sm font-medium">
          Description
        </label>

        <textarea
          id="edit-goal-description"
          {...register("description")}
          rows={3}
          className={`${inputClassName} resize-none`}
        />

        {errors.description && (
          <p className="mt-1 text-xs text-red-600">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="edit-goal-category" className="text-sm font-medium">
            Category
          </label>

          <input
            id="edit-goal-category"
            {...register("category")}
            className={inputClassName}
          />

          {errors.category && (
            <p className="mt-1 text-xs text-red-600">
              {errors.category.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="edit-goal-status" className="text-sm font-medium">
            Status
          </label>

          <select
            id="edit-goal-status"
            {...register("status")}
            className={inputClassName}
          >
            <option value="active">Active</option>

            <option value="completed">Completed</option>

            <option value="paused">Paused</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="edit-goal-progress" className="text-sm font-medium">
          Progress
        </label>

        <div className="mt-2 flex items-center gap-3">
          <input
            id="edit-goal-progress"
            type="range"
            min={0}
            max={100}
            {...register("progress", {
              valueAsNumber: true,
            })}
            className="w-full"
          />

          <span className="w-10 text-right text-sm font-medium">
            {goal.progress}%
          </span>
        </div>

        {errors.progress && (
          <p className="mt-1 text-xs text-red-600">{errors.progress.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="edit-goal-milestone" className="text-sm font-medium">
          Milestone
        </label>

        <input
          id="edit-goal-milestone"
          {...register("milestone")}
          className={inputClassName}
        />
      </div>

      <div>
        <label htmlFor="edit-goal-next-action" className="text-sm font-medium">
          Next action
        </label>

        <input
          id="edit-goal-next-action"
          {...register("nextAction")}
          className={inputClassName}
        />
      </div>

      <div>
        <label htmlFor="edit-goal-target-date" className="text-sm font-medium">
          Target date
        </label>

        <input
          id="edit-goal-target-date"
          type="date"
          {...register("targetDate")}
          className={inputClassName}
        />
      </div>

      {updateGoalMutation.isError && (
        <p className="text-sm text-red-600">
          {updateGoalMutation.error instanceof Error
            ? updateGoalMutation.error.message
            : "Unable to update goal."}
        </p>
      )}

      <div className="flex justify-end gap-3 border-t border-neutral-100 pt-5">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting || updateGoalMutation.isPending}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={isSubmitting || updateGoalMutation.isPending}
        >
          {updateGoalMutation.isPending ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
