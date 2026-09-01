"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";

import TaskItem from "@/components/tasks/TaskItem";
import TaskForm from "@/components/tasks/TaskForm";
import GoalModal from "@/components/goals/GoalModal";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

import {
  useCreateTask,
  useDeleteTask,
  useTasks,
  useUpdateTask,
} from "@/hooks/useTasks";

import type { Task } from "@/lib/api/tasks.api";
import ConfirmModal from "@/components/ui/ConfirmModal";

type TaskFilter = "all" | "today" | "upcoming" | "completed";

const filters: {
  value: TaskFilter;
  label: string;
}[] = [
  {
    value: "all",
    label: "All",
  },
  {
    value: "today",
    label: "Today",
  },
  {
    value: "upcoming",
    label: "Upcoming",
  },
  {
    value: "completed",
    label: "Completed",
  },
];

function getDateKey(date: Date) {
  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, "0");

  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getTodayKey() {
  return getDateKey(new Date());
}

function getTaskDate(task: Task) {
  if (!task.dueDate) {
    return null;
  }

  const date = new Date(task.dueDate);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return getDateKey(date);
}

function isToday(task: Task) {
  return task.status === "pending" && getTaskDate(task) === getTodayKey();
}

function isUpcoming(task: Task) {
  const taskDate = getTaskDate(task);

  if (!taskDate) {
    return false;
  }

  return task.status === "pending" && taskDate > getTodayKey();
}

function isUndated(task: Task) {
  return task.status === "pending" && !task.dueDate;
}

function isCompleted(task: Task) {
  return task.status === "completed";
}

export default function TasksPage() {
  /* =============================== State ================================ */
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [filter, setFilter] = useState<TaskFilter>("all");
  const [quickTaskTitle, setQuickTaskTitle] = useState("");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  /* =============================== Hooks ================================ */
  const { data: tasks = [], isLoading, isError, error } = useTasks();
  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();

  /* =============================== Memoized Values ================================ */
  const todayTasks = useMemo(() => tasks.filter(isToday), [tasks]);
  const upcomingTasks = useMemo(() => tasks.filter(isUpcoming), [tasks]);
  const undatedTasks = useMemo(() => tasks.filter(isUndated), [tasks]);
  const completedTasks = useMemo(() => tasks.filter(isCompleted), [tasks]);

  const filteredTasks = useMemo(() => {
    switch (filter) {
      case "today":
        return todayTasks;

      case "upcoming":
        return upcomingTasks;

      case "completed":
        return completedTasks;

      case "all":
      default:
        return tasks;
    }
  }, [filter, tasks, todayTasks, upcomingTasks, completedTasks]);

  /* =============================== Handlers ================================ */

  async function handleQuickAdd() {
    const title = quickTaskTitle.trim();

    if (!title) {
      toast.error("Enter a task title.");
      return;
    }

    try {
      await createTaskMutation.mutateAsync({
        title,
        priority: "medium",
      });

      setQuickTaskTitle("");

      toast.success("Task created successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to create task.",
      );
    }
  }

  async function handleToggleTask(task: Task) {
    try {
      const nextStatus = task.status === "completed" ? "pending" : "completed";

      await updateTaskMutation.mutateAsync({
        id: task._id,

        payload: {
          status: nextStatus,
        },
      });

      toast.success(
        nextStatus === "completed"
          ? "Task completed"
          : "Task marked as pending",
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to update task.",
      );
    }
  }

  function handleCreateTask() {
    setEditingTask(null);
    setIsCreateOpen(true);
  }

  function handleEditTask(task: Task) {
    setEditingTask(task);
    setIsCreateOpen(true);
  }

  function handleDeleteTask(task: Task) {
    setDeletingTask(task);
  }

  async function confirmDeleteTask() {
    if (!deletingTask) {
      return;
    }

    try {
      await deleteTaskMutation.mutateAsync(deletingTask._id);

      toast.success("Task deleted successfully");

      setDeletingTask(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to delete task.",
      );
    }
  }

  function handleCloseModal() {
    setIsCreateOpen(false);
    setEditingTask(null);
  }

  return (
    <div className="space-y-8 py-6">
      {/* ================================ Header ================================ */}

      <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm text-foreground-secondary">Execution</p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Tasks
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-foreground-secondary">
            Turn your priorities into small, actionable steps.
          </p>
        </div>

        <Button type="button" onClick={handleCreateTask}>
          Add task
        </Button>
      </section>

      {/* ================================ Quick Add ================================ */}

      <Card className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={quickTaskTitle}
            onChange={(event) => setQuickTaskTitle(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !createTaskMutation.isPending) {
                void handleQuickAdd();
              }
            }}
            placeholder="What needs to be done?"
            className="h-11 min-w-0 flex-1 rounded-lg border border-border px-3 text-sm outline-none placeholder:text-foreground-muted focus:border-foreground-muted"
            disabled={createTaskMutation.isPending}
          />

          <Button
            type="button"
            onClick={() => void handleQuickAdd()}
            disabled={createTaskMutation.isPending}
          >
            {createTaskMutation.isPending ? "Adding..." : "Add task"}
          </Button>
        </div>
      </Card>

      {/* ================================ Filters ================================ */}

      <div className="flex items-center gap-1 overflow-x-auto border-b border-border">
        {filters.map((item) => {
          const active = filter === item.value;

          return (
            <button
              key={item.value}
              type="button"
              onClick={() => setFilter(item.value)}
              className={[
                "shrink-0 px-3 py-3 text-sm transition-colors",
                active
                  ? "border-b-2 border-foreground font-medium text-foreground"
                  : "text-foreground-secondary hover:text-foreground",
              ].join(" ")}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {/* ================================ Loading ================================ */}

      {isLoading && (
        <section className="space-y-8">
          <TaskSectionSkeleton />
          <TaskSectionSkeleton />
        </section>
      )}

      {/* ================================ Error ================================ */}

      {isError && (
        <Card className="border-red-200 bg-red-50 p-6">
          <p className="text-sm text-red-600">
            {error instanceof Error ? error.message : "Unable to load tasks."}
          </p>
        </Card>
      )}

      {/* ================================ Filtered View ================================ */}

      {!isLoading && !isError && filter !== "all" && (
        <section>
          <div className="mb-3 flex items-end justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-foreground-secondary">
                {filter === "today"
                  ? "Today"
                  : filter === "upcoming"
                    ? "Upcoming"
                    : "Completed"}
              </p>

              <h2 className="mt-1 text-xl font-semibold">
                {filter === "today"
                  ? "What matters now"
                  : filter === "upcoming"
                    ? "Next up"
                    : "Recently done"}
              </h2>
            </div>

            <span className="text-xs text-foreground-secondary">
              {filteredTasks.length}{" "}
              {filteredTasks.length === 1 ? "task" : "tasks"}
            </span>
          </div>

          <TaskList
            tasks={filteredTasks}
            onToggle={handleToggleTask}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
            emptyMessage={
              filter === "today"
                ? "Nothing due today."
                : filter === "upcoming"
                  ? "No upcoming tasks."
                  : "No completed tasks yet."
            }
          />
        </section>
      )}

      {/* ================================ All View ================================ */}

      {!isLoading && !isError && filter === "all" && (
        <>
          <TaskSection
            label="Today"
            title="What matters now"
            count={todayTasks.length}
          >
            <TaskList
              tasks={todayTasks}
              onToggle={handleToggleTask}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              emptyMessage="Nothing due today."
            />
          </TaskSection>

          <TaskSection
            label="Upcoming"
            title="Next up"
            count={upcomingTasks.length}
          >
            <TaskList
              tasks={upcomingTasks}
              onToggle={handleToggleTask}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              emptyMessage="No upcoming tasks."
            />
          </TaskSection>

          <TaskSection
            label="No due date"
            title="Whenever you're ready"
            count={undatedTasks.length}
          >
            <TaskList
              tasks={undatedTasks}
              onToggle={handleToggleTask}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              emptyMessage="No tasks without a due date."
            />
          </TaskSection>

          <TaskSection
            label="Completed"
            title="Recently done"
            count={completedTasks.length}
          >
            <TaskList
              tasks={completedTasks}
              onToggle={handleToggleTask}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              emptyMessage="No completed tasks yet."
            />
          </TaskSection>
        </>
      )}

      {/* ================================ Companion Perspective ================================ */}

      <section className="rounded-2xl border border-border bg-surface-elevated p-6">
        <p className="text-xs font-medium uppercase tracking-wide text-foreground-secondary">
          Companion perspective
        </p>

        <h2 className="mt-3 text-lg font-semibold">
          Keep today's list smaller than your ambition.
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-foreground-secondary">
          Your highest-priority task is connected to your main product goal.
          Finishing it could create more momentum than starting another task.
        </p>

        <Button
          variant="ghost"
          className="mt-5 px-0 underline underline-offset-4"
        >
          Ask Companion what to do next
        </Button>
      </section>

      {/* ================================ Task Modal ================================ */}

      <GoalModal open={isCreateOpen} onClose={handleCloseModal}>
        <TaskForm
          task={editingTask ?? undefined}
          onSuccess={handleCloseModal}
          onCancel={handleCloseModal}
        />
      </GoalModal>
      <ConfirmModal
        open={Boolean(deletingTask)}
        title="Delete task?"
        description={
          deletingTask
            ? `Are you sure you want to delete "${deletingTask.title}"? This action cannot be undone.`
            : undefined
        }
        confirmLabel="Delete"
        loading={deleteTaskMutation.isPending}
        onConfirm={() => {
          void confirmDeleteTask();
        }}
        onCancel={() => {
          if (!deleteTaskMutation.isPending) {
            setDeletingTask(null);
          }
        }}
      />
    </div>
  );
}

/* ================================ Task Section ================================ */

function TaskSection({
  label,
  title,
  count,
  children,
}: {
  label: string;
  title: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-3 flex items-end justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-foreground-secondary">
            {label}
          </p>

          <h2 className="mt-1 text-xl font-semibold">{title}</h2>
        </div>

        <span className="text-xs text-foreground-secondary">
          {count} {count === 1 ? "task" : "tasks"}
        </span>
      </div>

      {children}
    </section>
  );
}

/* ================================ Task List ================================ */

function TaskList({
  tasks,
  emptyMessage,
  onToggle,
  onEdit,
  onDelete,
}: {
  tasks: Task[];
  emptyMessage: string;
  onToggle: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}) {
  if (tasks.length === 0) {
    return (
      <Card className="px-5">
        <div className="py-8 text-center">
          <p className="text-sm font-medium text-foreground-secondary">{emptyMessage}</p>

          <p className="mt-1 text-sm text-foreground-secondary">
            Add a task when you're ready.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="px-5">
      <div className="divide-y divide-border">
        {tasks.map((task) => (
          <TaskItem
            key={task._id}
            {...task}
            onToggle={onToggle}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </Card>
  );
}

/* ================================ Skeleton ================================ */

function TaskSectionSkeleton() {
  return (
    <section>
      <div className="mb-3">
        <div className="h-3 w-16 animate-pulse rounded bg-surface-elevated" />

        <div className="mt-2 h-6 w-32 animate-pulse rounded bg-surface-elevated" />
      </div>

      <Card className="px-5">
        <div className="divide-y divide-border">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex items-center gap-4 py-4">
              <div className="h-5 w-5 animate-pulse rounded bg-surface-elevated" />

              <div className="flex-1">
                <div className="h-4 w-2/3 animate-pulse rounded bg-surface-elevated" />

                <div className="mt-2 h-3 w-1/3 animate-pulse rounded bg-surface-elevated" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </section>
  );
}
