import TaskItem from "@/components/tasks/TaskItem";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

const todayTasks = [
  {
    title: "Finish onboarding UI",
    goal: "Build my product",
    priority: "High" as const,
    due: "Today",
  },
  {
    title: "Review client proposal",
    goal: "Client work",
    priority: "Medium" as const,
    due: "Today",
  },
  {
    title: "45 minutes of focused learning",
    goal: "Grow my development career",
    priority: "Low" as const,
    due: "Today",
  },
];

const upcomingTasks = [
  {
    title: "Design settings experience",
    goal: "Build my product",
    priority: "Medium" as const,
    due: "Tomorrow",
  },
  {
    title: "Review portfolio project",
    goal: "Grow my development career",
    priority: "Low" as const,
    due: "Wednesday",
  },
];

const completedTasks = [
  {
    title: "Set up project repository",
    goal: "Build my product",
    priority: "Medium" as const,
    due: "Yesterday",
    completed: true,
  },
  {
    title: "Define initial product scope",
    goal: "Build my product",
    priority: "High" as const,
    due: "Yesterday",
    completed: true,
  },
];

export default function TasksPage() {
  return (
    <div className="space-y-8 py-6">
      {/* Header */}

      <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm text-neutral-500">Execution</p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Tasks
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500">
            Turn your priorities into small, actionable steps.
          </p>
        </div>

        <Button>Add task</Button>
      </section>

      {/* Quick Add */}

      <Card className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            placeholder="What needs to be done?"
            className="h-11 min-w-0 flex-1 rounded-lg border border-neutral-200 px-3 text-sm outline-none placeholder:text-neutral-400 focus:border-neutral-400"
          />

          <Button>Add task</Button>
        </div>
      </Card>

      {/* Filters */}

      <div className="flex items-center gap-1 overflow-x-auto border-b border-neutral-200">
        {["All", "Today", "Upcoming", "Completed"].map((filter, index) => (
          <button
            key={filter}
            type="button"
            className={[
              "shrink-0 px-3 py-3 text-sm",
              index === 0
                ? "border-b-2 border-neutral-950 font-medium text-neutral-950"
                : "text-neutral-500",
            ].join(" ")}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Today's Tasks */}

      <section>
        <div className="mb-3 flex items-end justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
              Today
            </p>

            <h2 className="mt-1 text-xl font-semibold">What matters now</h2>
          </div>

          <span className="text-xs text-neutral-500">
            {todayTasks.length} tasks
          </span>
        </div>

        <Card className="px-5">
          <div className="divide-y divide-neutral-100">
            {todayTasks.map((task) => (
              <TaskItem key={task.title} {...task} />
            ))}
          </div>
        </Card>
      </section>

      {/* Upcoming */}

      <section>
        <div className="mb-3">
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
            Upcoming
          </p>

          <h2 className="mt-1 text-xl font-semibold">Next up</h2>
        </div>

        <Card className="px-5">
          <div className="divide-y divide-neutral-100">
            {upcomingTasks.map((task) => (
              <TaskItem key={task.title} {...task} />
            ))}
          </div>
        </Card>
      </section>

      {/* Completed */}

      <section>
        <div className="mb-3">
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
            Completed
          </p>

          <h2 className="mt-1 text-xl font-semibold">Recently done</h2>
        </div>

        <Card className="px-5">
          <div className="divide-y divide-neutral-100">
            {completedTasks.map((task) => (
              <TaskItem key={task.title} {...task} />
            ))}
          </div>
        </Card>
      </section>

      {/* Companion Perspective */}

      <section className="rounded-2xl border border-neutral-200 bg-neutral-100 p-6">
        <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
          Companion perspective
        </p>

        <h2 className="mt-3 text-lg font-semibold">
          Keep today's list smaller than your ambition.
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600">
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
    </div>
  );
}
