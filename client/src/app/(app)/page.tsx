import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";

const focus = {
  title: "Finish onboarding UI",
  description:
    "Complete the onboarding flow so the next development step can begin.",
  goal: "Build my product",
  priority: "High",
};

const tasks = [
  {
    title: "Finish onboarding UI",
    goal: "Build my product",
    priority: "High",
  },
  {
    title: "Review client proposal",
    goal: "Client work",
    priority: "Medium",
  },
  {
    title: "45 minutes of focused learning",
    goal: "Grow my development career",
    priority: "Low",
  },
];

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
  return (
    <div className="space-y-8 py-6">
      {/* Header */}

      <section>
        <p className="text-sm text-neutral-500">Monday, August 25</p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Good morning, Shiva.
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500">
          You don't need to figure everything out today. Let's focus on what
          matters most.
        </p>
      </section>

      {/* Companion Recommendation */}

      <Card className="p-6 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
              Companion
            </p>

            <h2 className="mt-2 text-xl font-semibold">
              Start with one clear priority.
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600">
              You have several things planned today, but finishing the
              onboarding UI is currently the most useful next step.
            </p>
          </div>

          <Avatar name="Companion" size="md" />
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <Button>Make this my focus</Button>

          <Button variant="secondary">Talk to Companion</Button>
        </div>
      </Card>

      {/* Main Grid */}

      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        {/* Today's Focus */}

        <Card className="p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                Today's focus
              </p>

              <h2 className="mt-1 text-xl font-semibold">{focus.title}</h2>
            </div>

            <Badge>{focus.priority}</Badge>
          </div>

          <p className="mt-4 text-sm leading-6 text-neutral-600">
            {focus.description}
          </p>

          <div className="mt-6 border-t border-neutral-100 pt-5">
            <p className="text-xs text-neutral-500">Connected goal</p>

            <p className="mt-1 text-sm font-medium">{focus.goal}</p>
          </div>

          <div className="mt-5 flex gap-3">
            <Button>Start task</Button>

            <Button variant="secondary">Change focus</Button>
          </div>
        </Card>

        {/* Companion Insight */}

        <Card className="bg-neutral-100 p-6">
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
            Companion insight
          </p>

          <h2 className="mt-3 text-lg font-semibold">
            Your product work is moving forward.
          </h2>

          <p className="mt-3 text-sm leading-6 text-neutral-600">
            You've made steady progress recently. The onboarding flow appears to
            be the main remaining blocker before development can move ahead.
          </p>

          <Button
            variant="ghost"
            className="mt-6 px-0 underline underline-offset-4"
          >
            Explore with Companion
          </Button>
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

          <Button variant="ghost" className="px-0">
            View all
          </Button>
        </div>

        <div className="mt-5 divide-y divide-neutral-100">
          {tasks.map((task) => (
            <div key={task.title} className="flex items-center gap-4 py-4">
              <button
                type="button"
                aria-label={`Complete ${task.title}`}
                className="h-5 w-5 shrink-0 rounded-full border border-neutral-300 transition-colors hover:border-neutral-900"
              />

              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{task.title}</p>

                <p className="mt-1 text-xs text-neutral-500">{task.goal}</p>
              </div>

              <span className="hidden text-xs text-neutral-500 sm:block">
                {task.priority}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Today's Rhythm */}

      <section>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
            Today's rhythm
          </p>

          <h2 className="mt-1 text-xl font-semibold">
            A simple day, not a perfect one.
          </h2>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {rhythm.map((item) => (
            <Card key={item.label} className="rounded-xl p-5">
              <p className="text-xs text-neutral-500">{item.label}</p>

              <p className="mt-2 text-sm font-medium">{item.title}</p>

              <p className="mt-1 text-xs text-neutral-500">{item.status}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
