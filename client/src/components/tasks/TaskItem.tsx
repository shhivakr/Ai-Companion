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
    <div className="group flex items-start gap-4 py-4">
      {/* Complete */}

      <button
        type="button"
        aria-label={
          completed ? `Mark ${task.title} as pending` : `Complete ${task.title}`
        }
        onClick={() => onToggle?.(task)}
        className={[
          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors",
          completed
            ? "border-neutral-950 bg-neutral-950"
            : "border-neutral-300 hover:border-neutral-900",
        ].join(" ")}
      >
        {completed && <span className="h-2 w-2 rounded-full bg-white" />}
      </button>

      {/* Content */}

      <div className="min-w-0 flex-1">
        <p
          className={[
            "text-sm font-medium",
            completed ? "text-neutral-400 line-through" : "text-neutral-950",
          ].join(" ")}
        >
          {task.title}
        </p>

        <div className="mt-1 flex flex-wrap items-center gap-2">
          {goalTitle && (
            <span className="text-xs text-neutral-500">{goalTitle}</span>
          )}

          {goalTitle && due && <span className="text-neutral-300">·</span>}

          {due && <span className="text-xs text-neutral-500">{due}</span>}
        </div>
      </div>

      {/* Priority */}

      <Badge variant={task.priority === "high" ? "default" : "muted"}>
        {priorityLabels[task.priority]}
      </Badge>

      {/* Actions */}

      <div className="flex shrink-0 items-center gap-1 opacity-100 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100">
        <button
          type="button"
          onClick={() => onEdit?.(task)}
          className="rounded-md px-2 py-1 text-xs text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-950"
        >
          Edit
        </button>

        <button
          type="button"
          onClick={() => onDelete?.(task)}
          className="rounded-md px-2 py-1 text-xs text-red-500 transition-colors hover:bg-red-50 hover:text-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
