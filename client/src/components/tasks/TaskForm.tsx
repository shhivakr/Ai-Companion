"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import Button from "@/components/ui/Button";
import { useCreateTask, useUpdateTask } from "@/hooks/useTasks";
import { useGoals } from "@/hooks/useGoals";

import { taskSchema, type TaskFormValues } from "@/lib/validation/task.schema";

import type { Task } from "@/lib/api/tasks.api";

interface TaskFormProps {
  task?: Task;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const inputClassName =
  "mt-2 w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-foreground outline-none transition placeholder:text-foreground-muted focus:border-foreground-muted focus:ring-2 focus:ring-foreground-muted/20";

export default function TaskForm({ task, onSuccess, onCancel }: TaskFormProps) {
  const isEditing = Boolean(task);

  const createTaskMutation = useCreateTask();

  const updateTaskMutation = useUpdateTask();

  const { data: goals = [], isLoading: goalsLoading } = useGoals();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),

    defaultValues: {
      title: task?.title ?? "",

      description: task?.description ?? "",

      goal: typeof task?.goal === "object" ? task.goal._id : (task?.goal ?? ""),

      priority: task?.priority ?? "medium",

      dueDate: task?.dueDate ? task.dueDate.slice(0, 10) : "",
    },
  });

  const isSaving =
    isSubmitting ||
    createTaskMutation.isPending ||
    updateTaskMutation.isPending;

  async function onSubmit(values: TaskFormValues) {
    try {
      const payload = {
        title: values.title.trim(),

        description: values.description?.trim() || undefined,

        goal: values.goal || undefined,

        priority: values.priority,

        dueDate: values.dueDate || undefined,
      };

      if (isEditing && task) {
        await updateTaskMutation.mutateAsync({
          id: task._id,
          payload,
        });

        toast.success("Task updated successfully");
      } else {
        await createTaskMutation.mutateAsync(payload);

        toast.success("Task created successfully");
      }

      onSuccess?.();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : isEditing
            ? "Unable to update task."
            : "Unable to create task.",
      );
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Title */}

      <div>
        <label htmlFor="task-title" className="text-sm font-medium">
          Task title
        </label>

        <input
          id="task-title"
          type="text"
          {...register("title")}
          className={inputClassName}
          placeholder="What needs to be done?"
          disabled={isSaving}
        />

        {errors.title && (
          <p className="mt-1.5 text-xs text-red-600">{errors.title.message}</p>
        )}
      </div>

      {/* Description */}

      <div>
        <label htmlFor="task-description" className="text-sm font-medium">
          Description
        </label>

        <textarea
          id="task-description"
          {...register("description")}
          rows={3}
          className={`${inputClassName} resize-none`}
          placeholder="Add some context..."
          disabled={isSaving}
        />

        {errors.description && (
          <p className="mt-1.5 text-xs text-red-600">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Goal */}

      <div>
        <label htmlFor="task-goal" className="text-sm font-medium">
          Goal
        </label>

        <select
          id="task-goal"
          {...register("goal")}
          className={inputClassName}
          disabled={isSaving || goalsLoading}
        >
          <option value="">No goal</option>

          {goals.map((goal) => (
            <option key={goal._id} value={goal._id}>
              {goal.title}
            </option>
          ))}
        </select>

        {goalsLoading && (
          <p className="mt-1.5 text-xs text-foreground-muted">Loading goals...</p>
        )}

        {!goalsLoading && goals.length === 0 && (
          <p className="mt-1.5 text-xs text-foreground-muted">
            No goals available. You can create the task without a goal.
          </p>
        )}

        {errors.goal && (
          <p className="mt-1.5 text-xs text-red-600">{errors.goal.message}</p>
        )}
      </div>

      {/* Priority + Due Date */}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="task-priority" className="text-sm font-medium">
            Priority
          </label>

          <select
            id="task-priority"
            {...register("priority")}
            className={inputClassName}
            disabled={isSaving}
          >
            <option value="low">Low</option>

            <option value="medium">Medium</option>

            <option value="high">High</option>
          </select>

          {errors.priority && (
            <p className="mt-1.5 text-xs text-red-600">
              {errors.priority.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="task-due-date" className="text-sm font-medium">
            Due date
          </label>

          <input
            id="task-due-date"
            type="date"
            {...register("dueDate")}
            className={inputClassName}
            disabled={isSaving}
          />

          {errors.dueDate && (
            <p className="mt-1.5 text-xs text-red-600">
              {errors.dueDate.message}
            </p>
          )}
        </div>
      </div>

      {/* API Error */}

      {(createTaskMutation.isError || updateTaskMutation.isError) && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5">
          <p className="text-sm text-red-600">
            {(createTaskMutation.error ?? updateTaskMutation.error) instanceof
            Error
              ? (createTaskMutation.error ?? updateTaskMutation.error)?.message
              : isEditing
                ? "Unable to update task."
                : "Unable to create task."}
          </p>
        </div>
      )}

      {/* Actions */}

      <div className="flex justify-end gap-3 border-t border-border pt-5">
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isSaving}
          >
            Cancel
          </Button>
        )}

        <Button type="submit" disabled={isSaving}>
          {isSaving
            ? isEditing
              ? "Saving..."
              : "Creating..."
            : isEditing
              ? "Save changes"
              : "Create task"}
        </Button>
      </div>
    </form>
  );
}
