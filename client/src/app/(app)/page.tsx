"use client";

import { useAuth } from "@/providers/AuthProvider";
import { useTasks, useUpdateTask } from "@/hooks/useTasks";
import { useGoals } from "@/hooks/useGoals";
import { useCheckIns } from "@/hooks/useCheckIns";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import Link from "next/link";
import router from "next/dist/shared/lib/router/router";

const rhythm = [
  {
    label: "Morning",
    title: "Morning check-in",
    status: "Completed",
  },
  {
    label: "Focus",
    title: "Product UI work",
    status: "Current",
  },
  {
    label: "Evening",
    title: "Evening reflection",
    status: "9:30 PM",
  },
];

export default function HomePage() {
  /* =============================== Hooks =============================== */
  const { user } = useAuth();
  const {
    data: tasks = [],
    isLoading: isTasksLoading,
    error: tasksError,
  } = useTasks();

  const { mutate: updateTask, isPending: isUpdatingTask } = useUpdateTask();

  const {
    data: goals = [],
    isLoading: isGoalsLoading,
    error: goalsError,
  } = useGoals();

  const {
    todayCheckIn,
    isLoading: isCheckInsLoading,
    error: checkInsError,
  } = useCheckIns();

  /* =============================== Handlers =============================== */
  const handleCompleteTask = (taskId: string) => {
    updateTask({
      id: taskId,
      payload: {
        status: "completed",
      },
    });
  };

  const priorityRank = {
    high: 3,
    medium: 2,
    low: 1,
  };

  const pendingTasks = tasks.filter((task) => task.status === "pending");

  const focusTask = [...pendingTasks].sort((a, b) => {
    const priorityDifference =
      priorityRank[b.priority] - priorityRank[a.priority];

    if (priorityDifference !== 0) {
      return priorityDifference;
    }

    const aDueDate = a.dueDate
      ? new Date(a.dueDate).getTime()
      : Number.MAX_SAFE_INTEGER;

    const bDueDate = b.dueDate
      ? new Date(b.dueDate).getTime()
      : Number.MAX_SAFE_INTEGER;

    if (aDueDate !== bDueDate) {
      return aDueDate - bDueDate;
    }

    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  })[0];

  const completedTasksCount = tasks.filter(
    (task) => task.status === "completed",
  ).length;

  const pendingTasksCount = tasks.filter(
    (task) => task.status === "pending",
  ).length;

  const activeGoalsCount = goals.filter(
    (goal) => goal.status === "active",
  ).length;

  let insightTitle = "Keep your attention on what matters.";

  let insightDescription =
    "Choose one meaningful task and make progress before adding more to your list.";

  if (todayCheckIn) {
    if (todayCheckIn.energy === "low") {
      insightTitle = "Protect your energy today.";

      insightDescription =
        "Your check-in shows lower energy. Consider keeping your focus narrow and starting with the most important manageable task.";
    } else if (todayCheckIn.energy === "high") {
      insightTitle = "You have energy to make meaningful progress.";

      insightDescription =
        "Use that momentum on your highest-priority task before moving on to lower-priority work.";
    } else if (focusTask) {
      insightTitle = `Your next step is clear: ${focusTask.title}.`;

      insightDescription =
        "You already have a focused task in front of you. Completing it can create momentum without spreading your attention across everything else.";
    }
  } else if (focusTask) {
    insightTitle = `Start with ${focusTask.title}.`;

    insightDescription =
      "You haven't checked in yet, but your current task list already points to a clear next step.";
  } else if (completedTasksCount > 0) {
    insightTitle = "You're making progress.";

    insightDescription = `You've completed ${completedTasksCount} ${
      completedTasksCount === 1 ? "task" : "tasks"
    }. Keep the momentum by choosing one meaningful next step.`;
  } else if (activeGoalsCount > 0 && pendingTasksCount === 0) {
    insightTitle = "Your goals need a next step.";

    insightDescription =
      "You have active goals but no pending tasks. Consider turning one of your goals into a concrete action.";
  }

  const now = new Date();

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(now);

  const hour = now.getHours();

  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  /* =============================== Logs =============================== */
  console.log("HOME TASKS", tasks);
  console.log("HOME GOALS", goals);
  console.log("HOME TODAY CHECK-IN", todayCheckIn);
  console.log("AUTH USER", user);

  return (
    <div className="space-y-8 py-6">
      {/* Header */}

      <section>
        <p className="text-sm text-foreground-secondary">{formattedDate}</p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          {greeting}, {user?.name || "there"}.
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-foreground-secondary">
          You don't need to figure everything out today. Let's focus on what
          matters most.
        </p>
      </section>

      {/* Companion Recommendation */}
      <Card className="p-6 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-foreground-muted">
              Companion
            </p>

            <h2 className="mt-2 text-xl font-semibold">
              {focusTask
                ? "Start with one clear priority."
                : "You have space in your day."}
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-foreground-secondary">
              {focusTask
                ? `Your next useful step is "${focusTask.title}". Focusing on this task first can help you make clear progress without trying to handle everything at once.`
                : "You don't have any pending tasks right now. This is a good time to review your goals or decide what matters next."}
            </p>
          </div>

          <Avatar name={user?.name || "User"} size="md" />
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          {focusTask && <Button>Make this my focus</Button>}

          <Link
            href="/companion"
            className="inline-flex h-10 items-center justify-center rounded-lg border border-input bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            Talk to Companion
          </Link>
          {/* <Button variant="secondary">Talk to Companion</Button> */}
        </div>
      </Card>

      {/* Main Grid */}

      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        {/* Today's Focus */}

        <Card className="p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-foreground-muted">
                Today's focus
              </p>

              <h2 className="mt-1 text-xl font-semibold">
                {isTasksLoading
                  ? "Finding your focus..."
                  : focusTask?.title || "You're clear for today"}
              </h2>
            </div>

            {focusTask && (
              <Badge>
                {focusTask.priority.charAt(0).toUpperCase() +
                  focusTask.priority.slice(1)}
              </Badge>
            )}
          </div>

          {focusTask ? (
            <>
              <p className="mt-4 text-sm leading-6 text-foreground-secondary">
                {focusTask.description ||
                  "Focus on completing this task today."}
              </p>

              <div className="mt-6 border-t border-border pt-5">
                <p className="text-xs text-foreground-muted">Connected goal</p>

                <p className="mt-1 text-sm font-medium">
                  {typeof focusTask.goal === "object"
                    ? focusTask.goal?.title
                    : focusTask.goal || "No goal"}
                </p>
              </div>

              <div className="mt-5 flex gap-3">
                <Link
                  href="/tasks"
                  className="inline-flex h-10 items-center justify-center rounded-lg bg-foreground px-4 text-sm font-medium text-background transition-opacity hover:opacity-90"
                >
                  Start task
                </Link>
                <Button variant="secondary">Change focus</Button>
              </div>
            </>
          ) : (
            <p className="mt-4 text-sm leading-6 text-foreground-secondary">
              You don't have any pending tasks right now. Enjoy the space or
              create something new.
            </p>
          )}
        </Card>

        {/* Companion Insight */}

        <Card className="bg-surface-elevated p-6">
          <p className="text-xs font-medium uppercase tracking-wide text-foreground-muted">
            Companion insight
          </p>

          <h2 className="mt-3 text-lg font-semibold">
            {isTasksLoading || isGoalsLoading || isCheckInsLoading
              ? "Looking at your day..."
              : insightTitle}
          </h2>

          <p className="mt-3 text-sm leading-6 text-foreground-secondary">
            {isTasksLoading || isGoalsLoading || isCheckInsLoading
              ? "SIVRA is putting together your current priorities."
              : insightDescription}
          </p>

          <Link
            href="/companion"
            className="mt-6 inline-flex text-sm font-medium text-foreground underline underline-offset-4"
          >
            Explore with Companion
          </Link>
        </Card>
      </div>

      {/* Today's Tasks */}

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
              Today
            </p>

            <h2 className="mt-1 text-xl font-semibold">Your tasks</h2>
          </div>

          <Link
            href="/tasks"
            className="text-sm text-foreground-secondary transition-colors hover:text-foreground"
          >
            View all
          </Link>
        </div>

        <div className="mt-5 divide-y divide-border">
          {isTasksLoading ? (
            <div className="py-8 text-center text-sm text-foreground-muted">
              Loading your tasks...
            </div>
          ) : tasksError ? (
            <div className="py-8 text-center text-sm text-foreground-muted">
              Unable to load your tasks.
            </div>
          ) : tasks.length === 0 ? (
            <div className="py-8 text-center text-sm text-foreground-muted">
              No tasks yet. You're clear for today.
            </div>
          ) : (
            tasks.map((task) => {
              const isCompleted = task.status === "completed";

              return (
                <div key={task._id} className="flex items-center gap-4 py-4">
                  <button
                    type="button"
                    aria-label={
                      isCompleted
                        ? `${task.title} completed`
                        : `Complete ${task.title}`
                    }
                    disabled={isCompleted || isUpdatingTask}
                    onClick={() => handleCompleteTask(task._id)}
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors ${
                      isCompleted
                        ? "border-foreground bg-foreground"
                        : "border-border hover:border-foreground"
                    }`}
                  >
                    {isCompleted && (
                      <span className="text-[10px] font-bold text-background">
                        ✓
                      </span>
                    )}
                  </button>

                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-sm font-medium ${
                        isCompleted
                          ? "text-foreground-muted line-through"
                          : "text-foreground"
                      }`}
                    >
                      {task.title}
                    </p>

                    <p className="mt-1 text-xs text-foreground-muted">
                      {typeof task.goal === "object"
                        ? task.goal?.title
                        : task.goal || "No goal"}
                    </p>
                  </div>

                  <span className="hidden text-xs text-foreground-muted sm:block">
                    {task.priority}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </Card>

      {/* Today's Rhythm */}
      {/* Today's Check-in */}

      <section>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-foreground-muted">
            Today
          </p>

          <h2 className="mt-1 text-xl font-semibold">Check-in</h2>
        </div>

        <div className="mt-4">
          <Card className="p-6">
            {isCheckInsLoading ? (
              <div className="space-y-3">
                <div className="h-4 w-24 animate-pulse rounded bg-surface-elevated" />
                <div className="h-6 w-48 animate-pulse rounded bg-surface-elevated" />
                <div className="h-4 w-72 animate-pulse rounded bg-surface-elevated" />
              </div>
            ) : checkInsError ? (
              <div>
                <p className="text-sm font-medium">
                  Unable to load today's check-in.
                </p>

                <p className="mt-1 text-sm text-foreground-secondary">
                  Please try again later.
                </p>
              </div>
            ) : todayCheckIn ? (
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-foreground-muted">
                    Today's state
                  </p>

                  <h3 className="mt-2 text-xl font-semibold capitalize">
                    Feeling {todayCheckIn.feeling}
                  </h3>

                  <p className="mt-1 text-sm text-foreground-secondary">
                    Energy is {todayCheckIn.energy}
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-border bg-surface-elevated p-4">
                    <p className="text-xs text-foreground-muted">Focus</p>

                    <p className="mt-1 text-sm font-medium">
                      {todayCheckIn.focus === "product_work"
                        ? "Product work"
                        : todayCheckIn.focus === "client_work"
                          ? "Client work"
                          : "Learning"}
                    </p>
                  </div>

                  <div className="rounded-xl border border-border bg-surface-elevated p-4">
                    <p className="text-xs text-foreground-muted">Energy</p>

                    <p className="mt-1 text-sm font-medium capitalize">
                      {todayCheckIn.energy}
                    </p>
                  </div>
                </div>

                {todayCheckIn.note && (
                  <div className="border-t border-border pt-5">
                    <p className="text-xs text-foreground-muted">Note</p>

                    <p className="mt-2 text-sm leading-6 text-foreground-secondary">
                      {todayCheckIn.note}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <p className="text-sm font-medium">
                  You haven't checked in today.
                </p>

                <p className="mt-1 max-w-xl text-sm leading-6 text-foreground-secondary">
                  Take a moment to tell SIVRA how you're feeling, how much
                  energy you have, and what you want to focus on today.
                </p>

                <Link
                  href="/check-ins"
                  className="mt-5 inline-flex h-10 items-center justify-center rounded-lg border border-border bg-surface px-4 text-sm font-medium text-foreground transition-colors hover:bg-surface-elevated"
                >
                  Start check-in
                </Link>
              </div>
            )}
          </Card>
        </div>
      </section>
    </div>
  );
}
