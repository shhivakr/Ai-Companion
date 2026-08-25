import Card from "@/components/ui/Card";
import TimelineItem from "@/components/timeline/TimelineItem";

const today = [
  {
    time: "10:42 AM",
    title: "Completed morning check-in",
    description:
      "You reported good energy and chose product work as your main focus.",
    type: "checkin" as const,
  },
  {
    time: "10:18 AM",
    title: "Started onboarding UI",
    description:
      "You started working on the next milestone for your product goal.",
    type: "task" as const,
  },
  {
    time: "9:55 AM",
    title: "Companion suggested a focus",
    description:
      "Finish onboarding UI was identified as the most useful next step.",
    type: "companion" as const,
  },
  {
    time: "9:30 AM",
    title: "Product goal moved forward",
    description:
      "Your progress increased after completing the project setup milestone.",
    type: "goal" as const,
  },
];

const yesterday = [
  {
    time: "8:40 PM",
    title: "Completed project setup",
    description:
      "Repository and initial development environment were completed.",
    type: "task" as const,
  },
  {
    time: "8:15 AM",
    title: "Morning check-in",
    description: "You reported medium energy and chose learning as your focus.",
    type: "checkin" as const,
  },
];

export default function TimelinePage() {
  return (
    <div className="space-y-8 py-6">
      {/* Header */}

      <section>
        <p className="text-sm text-neutral-500">Your journey</p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Timeline
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500">
          A chronological view of the things you've done, noticed and moved
          forward.
        </p>
      </section>

      {/* Filters */}

      <div className="flex items-center gap-1 overflow-x-auto border-b border-neutral-200">
        {["All", "Tasks", "Goals", "Check-ins", "Companion"].map(
          (filter, index) => (
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
          ),
        )}
      </div>

      {/* Today */}

      <section>
        <div className="mb-4">
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
            Monday, August 25
          </p>

          <h2 className="mt-1 text-xl font-semibold">Today</h2>
        </div>

        <Card className="p-6">
          {today.map((item) => (
            <TimelineItem key={`${item.time}-${item.title}`} {...item} />
          ))}
        </Card>
      </section>

      {/* Yesterday */}

      <section>
        <div className="mb-4">
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
            Sunday, August 24
          </p>

          <h2 className="mt-1 text-xl font-semibold">Yesterday</h2>
        </div>

        <Card className="p-6">
          {yesterday.map((item) => (
            <TimelineItem key={`${item.time}-${item.title}`} {...item} />
          ))}
        </Card>
      </section>

      {/* Companion Insight */}

      <section className="rounded-2xl border border-neutral-200 bg-neutral-100 p-6">
        <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
          Companion perspective
        </p>

        <h2 className="mt-3 text-lg font-semibold">
          Small actions are adding up.
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600">
          Your recent activity shows a consistent pattern of turning goals into
          smaller actions and returning to them regularly.
        </p>
      </section>
    </div>
  );
}
