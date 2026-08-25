import CompanionHeader from "@/components/companion/CompanionHeader";
import MessageBubble from "@/components/companion/MessageBubble";
import SuggestedAction from "@/components/companion/SuggestedAction";
import Composer from "@/components/companion/Composer";
import Card from "@/components/ui/Card";

export default function CompanionPage() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-6xl flex-col">
      <CompanionHeader />

      <div className="grid flex-1 gap-6 py-6 lg:grid-cols-[1fr_280px]">
        {/* Conversation */}

        <div className="flex min-w-0 flex-col">
          <div className="flex-1 space-y-5">
            <MessageBubble role="companion">
              You have a few things competing for your attention today. Looking
              at your current goals, finishing the onboarding UI seems like the
              most useful place to start.
            </MessageBubble>

            <MessageBubble role="user">
              I feel like I have too many things to do today.
            </MessageBubble>

            <MessageBubble role="companion">
              Then let's make this smaller. You don't need to solve everything
              today.
            </MessageBubble>

            <Card className="max-w-2xl bg-neutral-100 p-5">
              <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                Suggested next step
              </p>

              <h2 className="mt-2 text-lg font-semibold">
                Finish onboarding UI
              </h2>

              <p className="mt-2 text-sm leading-6 text-neutral-600">
                It's connected to your main product goal and is currently
                blocking the next development step.
              </p>

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  className="rounded-lg bg-neutral-950 px-4 py-2.5 text-sm font-medium text-white"
                >
                  Start this
                </button>

                <button
                  type="button"
                  className="rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700"
                >
                  Break it down
                </button>
              </div>
            </Card>

            <div className="max-w-2xl">
              <p className="mb-3 text-xs font-medium uppercase tracking-wide text-neutral-500">
                You could also
              </p>

              <div className="grid gap-3 sm:grid-cols-2">
                <SuggestedAction
                  title="Plan my day"
                  description="Choose what deserves your attention."
                />

                <SuggestedAction
                  title="Review my goals"
                  description="See what you're currently working toward."
                />
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Composer />
          </div>
        </div>

        {/* Context */}

        <aside className="hidden lg:block">
          <Card className="sticky top-6 p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
              Current context
            </p>

            <div className="mt-5 space-y-5">
              <div>
                <p className="text-xs text-neutral-500">Today's focus</p>

                <p className="mt-1 text-sm font-medium">Finish onboarding UI</p>
              </div>

              <div>
                <p className="text-xs text-neutral-500">Active goal</p>

                <p className="mt-1 text-sm font-medium">Build my product</p>
              </div>

              <div>
                <p className="text-xs text-neutral-500">Recent check-in</p>

                <p className="mt-1 text-sm font-medium">
                  Good energy · Product focus
                </p>
              </div>

              <div className="border-t border-neutral-100 pt-4">
                <p className="text-xs text-neutral-500">Relevant memory</p>

                <p className="mt-1 text-sm leading-5">
                  You work better with one clear priority.
                </p>
              </div>
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}
