import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import LoadingState from "@/components/ui/LoadingState";

export default function UIStatesPage() {
  return (
    <div className="space-y-8 py-6">
      <section>
        <p className="text-sm text-neutral-500">Design system</p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          UI States
        </h1>

        <p className="mt-2 text-sm text-neutral-500">
          Reusable states used throughout SIVRA.
        </p>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold">Loading</h2>

        <LoadingState label="Loading your goals..." />
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold">Empty</h2>

        <EmptyState
          title="No goals yet"
          description="Create your first goal and start turning your ideas into progress."
          action={<Button>Create goal</Button>}
        />
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold">Error</h2>

        <ErrorState
          title="Couldn't load your goals"
          description="Something interrupted the request. Try again in a moment."
          action={<Button variant="secondary">Try again</Button>}
        />
      </section>
    </div>
  );
}
