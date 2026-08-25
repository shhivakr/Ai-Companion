import MemoryCard from "@/components/memory/MemoryCard";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

const memories = [
  {
    title: "Works better with one clear priority",
    content:
      "When there are too many competing tasks, focusing on one meaningful priority helps maintain momentum.",
    category: "Working style",
    updatedAt: "Today",
    source: "Check-ins",
  },
  {
    title: "Building a personal AI productivity companion",
    content:
      "The current product is being built as a personal AI companion for planning, reflection, goals, tasks and context.",
    category: "Project",
    updatedAt: "Today",
    source: "Conversation",
  },
  {
    title: "Product development is a major focus",
    content:
      "Current attention is centered around turning the product concept into a working application.",
    category: "Focus",
    updatedAt: "Yesterday",
    source: "Goals",
  },
  {
    title: "Prefers practical, step-by-step progress",
    content:
      "Breaking large projects into sequential implementation steps makes it easier to keep moving.",
    category: "Working style",
    updatedAt: "2 days ago",
    source: "Conversation",
  },
];

const categories = ["All", "Working style", "Projects", "Focus", "Preferences"];

export default function MemoryPage() {
  return (
    <div className="space-y-8 py-6">
      {/* Header */}

      <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm text-neutral-500">Context</p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Memory
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500">
            Important context that helps Companion understand you over time.
          </p>
        </div>

        <Button>Add memory</Button>
      </section>

      {/* Memory explanation */}

      <Card className="bg-neutral-100 p-6">
        <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
          About memory
        </p>

        <h2 className="mt-3 text-lg font-semibold">
          You stay in control of what Companion remembers.
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600">
          Memories can come from conversations, check-ins, goals and other
          interactions. You can review, edit or remove them whenever you want.
        </p>
      </Card>

      {/* Filters */}

      <div className="flex items-center gap-1 overflow-x-auto border-b border-neutral-200">
        {categories.map((category, index) => (
          <button
            key={category}
            type="button"
            className={[
              "shrink-0 px-3 py-3 text-sm",
              index === 0
                ? "border-b-2 border-neutral-950 font-medium text-neutral-950"
                : "text-neutral-500",
            ].join(" ")}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Memory list */}

      <section className="grid gap-5 lg:grid-cols-2">
        {memories.map((memory) => (
          <MemoryCard key={memory.title} {...memory} />
        ))}
      </section>

      {/* Privacy / control */}

      <section className="rounded-2xl border border-neutral-200 bg-white p-6">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium">Memory controls</p>

            <p className="mt-1 max-w-2xl text-sm leading-6 text-neutral-500">
              Manage what Companion can remember and how your context is used.
            </p>
          </div>

          <Button variant="secondary">Manage settings</Button>
        </div>
      </section>
    </div>
  );
}
