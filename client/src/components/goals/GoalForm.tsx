"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Button from "@/components/ui/Button";
import { useCreateGoal } from "@/hooks/useGoals";
import {
  goalFormSchema,
  type GoalFormValues,
} from "@/lib/validation/goal.schema";

interface GoalFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const inputClassName =
  "mt-2 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-neutral-400 focus:ring-2 focus:ring-neutral-100";

export default function GoalForm({ onSuccess, onCancel }: GoalFormProps) {
  const createGoalMutation = useCreateGoal();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<GoalFormValues>({
    resolver: zodResolver(goalFormSchema),

    defaultValues: {
      title: "",
      description: "",
      category: "",
      milestone: "",
      nextAction: "",
      targetDate: "",
    },
  });

  async function onSubmit(values: GoalFormValues) {
    try {
      await createGoalMutation.mutateAsync({
        title: values.title.trim(),

        description: values.description?.trim() || undefined,

        category: values.category?.trim() || undefined,

        milestone: values.milestone?.trim() || undefined,

        nextAction: values.nextAction?.trim() || undefined,

        targetDate: values.targetDate || undefined,
      });

      reset();
      onSuccess?.();
    } catch {
      // Mutation error is displayed below.
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label
          htmlFor="goal-title"
          className="text-sm font-medium text-neutral-900"
        >
          Goal title
        </label>

        <input
          id="goal-title"
          {...register("title")}
          placeholder="What do you want to achieve?"
          className={inputClassName}
        />

        {errors.title && (
          <p className="mt-1.5 text-xs text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="goal-description"
          className="text-sm font-medium text-neutral-900"
        >
          Description
        </label>

        <textarea
          id="goal-description"
          {...register("description")}
          rows={3}
          placeholder="Add some context about this goal..."
          className={`${inputClassName} resize-none`}
        />

        {errors.description && (
          <p className="mt-1.5 text-xs text-red-600">
            {errors.description.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="goal-category"
          className="text-sm font-medium text-neutral-900"
        >
          Category
        </label>

        <input
          id="goal-category"
          {...register("category")}
          placeholder="Career, Health, Personal..."
          className={inputClassName}
        />

        {errors.category && (
          <p className="mt-1.5 text-xs text-red-600">
            {errors.category.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="goal-milestone"
          className="text-sm font-medium text-neutral-900"
        >
          Milestone
        </label>

        <input
          id="goal-milestone"
          {...register("milestone")}
          placeholder="What's the current milestone?"
          className={inputClassName}
        />

        {errors.milestone && (
          <p className="mt-1.5 text-xs text-red-600">
            {errors.milestone.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="goal-next-action"
          className="text-sm font-medium text-neutral-900"
        >
          Next action
        </label>

        <input
          id="goal-next-action"
          {...register("nextAction")}
          placeholder="What's the next concrete step?"
          className={inputClassName}
        />

        {errors.nextAction && (
          <p className="mt-1.5 text-xs text-red-600">
            {errors.nextAction.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="goal-target-date"
          className="text-sm font-medium text-neutral-900"
        >
          Target date
        </label>

        <input
          id="goal-target-date"
          type="date"
          {...register("targetDate")}
          className={inputClassName}
        />

        {errors.targetDate && (
          <p className="mt-1.5 text-xs text-red-600">
            {errors.targetDate.message}
          </p>
        )}
      </div>

      {createGoalMutation.isError && (
        <p className="text-sm text-red-600">
          {createGoalMutation.error instanceof Error
            ? createGoalMutation.error.message
            : "Unable to create goal."}
        </p>
      )}

      <div className="flex justify-end gap-3 border-t border-neutral-100 pt-5">
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isSubmitting || createGoalMutation.isPending}
          >
            Cancel
          </Button>
        )}

        <Button
          type="submit"
          disabled={isSubmitting || createGoalMutation.isPending}
        >
          {createGoalMutation.isPending ? "Creating..." : "Create goal"}
        </Button>
      </div>
    </form>
  );
}
