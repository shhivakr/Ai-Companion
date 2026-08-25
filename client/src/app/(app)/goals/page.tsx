import GoalCard from "@/components/goals/GoalCard";
import Button from "@/components/ui/Button";

const goals = [
  {
    title: "Build my product",
    description: "Turn the Personal AI Companion idea into a usable product.",
    progress: 62,
    milestone: "Complete core UI",
    nextAction: "Finish onboarding experience",
    category: "Business",
  },
  {
    title: "Grow my development career",
    description:
      "Build stronger full-stack development skills and create better projects.",
    progress: 38,
    milestone: "Complete portfolio projects",
    nextAction: "Finish current project",
    category: "Career",
  },
  {
    title: "Build a consistent learning routine",
    description: "Create a sustainable daily learning habit.",
    progress: 45,
    milestone: "Maintain weekly consistency",
    nextAction: "Complete today's learning session",
    category: "Learning",
  },
];

export default function GoalsPage() {
  return (
    <div className="space-y-8 py-6">
      {/* Header */}

      <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm text-neutral-500">Direction</p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Goals
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500">
            The things you're working toward.
          </p>
        </div>

        <Button>Add goal</Button>
      </section>

      {/* Filters */}

      <div className="flex items-center gap-1 border-b border-neutral-200">
        {["Active", "Completed", "Paused"].map((filter, index) => (
          <button
            key={filter}
            type="button"
            className={[
              "px-3 py-3 text-sm",
              index === 0
                ? "border-b-2 border-neutral-950 font-medium text-neutral-950"
                : "text-neutral-500",
            ].join(" ")}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Goals */}

      <section className="grid gap-5 lg:grid-cols-2">
        {goals.map((goal) => (
          <GoalCard key={goal.title} {...goal} />
        ))}
      </section>

      {/* Companion Context */}

      <section className="rounded-2xl border border-neutral-200 bg-neutral-100 p-6">
        <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
          Companion perspective
        </p>

        <h2 className="mt-3 text-lg font-semibold">
          Your product goal is currently getting the most momentum.
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600">
          Finishing the current UI milestone could unlock the next stage of
          development.
        </p>

        <Button
          variant="ghost"
          className="mt-5 px-0 underline underline-offset-4"
        >
          Discuss my goals
        </Button>
      </section>
    </div>
  );
}
