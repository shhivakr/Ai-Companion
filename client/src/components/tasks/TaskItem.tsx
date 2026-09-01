"use client";

import Badge from "@/components/ui/Badge";

import type { Task, TaskPriority } from "@/lib/api/tasks.api";

interface TaskItemProps extends Task {
  onToggle?: (task: Task) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
}

const priorityLabels: Record<TaskPriority, string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
};

function formatDueDate(dueDate?: string) {
  if (!dueDate) {
    return null;
  }

  const date = new Date(dueDate);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export default function TaskItem({
  onToggle,
  onEdit,
  onDelete,
  ...task
}: TaskItemProps) {
  const completed = task.status === "completed";

  const goalTitle = typeof task.goal === "object" ? task.goal.title : task.goal;

  const due = formatDueDate(task.dueDate);

  return (
    <article
      className={[
        "group flex items-start gap-3 py-4 sm:gap-4",
        completed ? "opacity-80" : "",
      ].join(" ")}
    >
      {/* Complete */}

      <button
        type="button"
        aria-label={
          completed
            ? `Mark "${task.title}" as pending`
            : `Mark "${task.title}" as completed`
        }
        aria-pressed={completed}
        onClick={() => onToggle?.(task)}
        className={[
          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border outline-none transition",
          "focus-visible:ring-2 focus-visible:ring-foreground-muted/40 focus-visible:ring-offset-2",
          completed
            ? "border-foreground bg-foreground"
            : "border-border hover:border-foreground",
        ].join(" ")}
      >
        {completed && (
          <span aria-hidden="true" className="h-2 w-2 rounded-full bg-surface" />
        )}
      </button>

      {/* Content */}

      <div className="min-w-0 flex-1">
        <p
          className={[
            "break-words text-sm font-medium",
            completed ? "text-foreground-muted line-through" : "text-foreground",
          ].join(" ")}
        >
          {task.title}
        </p>

        {task.description && (
          <p
            className={[
              "mt-1 line-clamp-2 text-xs leading-5",
              completed ? "text-foreground-muted" : "text-foreground-secondary",
            ].join(" ")}
          >
            {task.description}
          </p>
        )}

        {(goalTitle || due) && (
          <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
            {goalTitle && (
              <span className="max-w-full truncate text-xs text-foreground-secondary">
                {goalTitle}
              </span>
            )}

            {goalTitle && due && (
              <span aria-hidden="true" className="text-foreground-muted">
                ·
              </span>
            )}

            {due && <span className="text-xs text-foreground-secondary">{due}</span>}
          </div>
        )}
      </div>

      {/* Priority */}

      <div className="shrink-0">
        <Badge variant={task.priority === "high" ? "default" : "muted"}>
          {priorityLabels[task.priority]}
        </Badge>
      </div>

      {/* Actions */}

      <div
        className={[
          "flex shrink-0 items-center gap-1",
          "opacity-100 sm:opacity-0",
          "sm:transition-opacity sm:group-hover:opacity-100",
          "sm:group-focus-within:opacity-100",
        ].join(" ")}
      >
        {onEdit && (
          <button
            type="button"
            onClick={() => onEdit(task)}
            aria-label={`Edit "${task.title}"`}
            className="rounded-md px-2 py-1.5 text-xs text-foreground-secondary outline-none transition-colors hover:bg-surface-elevated hover:text-foreground focus-visible:ring-2 focus-visible:ring-foreground-muted/40"
          >
            Edit
          </button>
        )}

        {onDelete && (
          <button
            type="button"
            onClick={() => onDelete(task)}
            aria-label={`Delete "${task.title}"`}
            className="rounded-md px-2 py-1.5 text-xs text-red-500 outline-none transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:ring-2 focus-visible:ring-red-200"
          >
            Delete
          </button>
        )}
      </div>
    </article>
  );
}
