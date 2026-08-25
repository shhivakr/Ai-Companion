"use client";

import { useState } from "react";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import CommandAction from "@/components/command/CommandAction";

const actions = [
  {
    title: "Ask Companion",
    description: "Talk through a decision, problem or idea.",
    shortcut: "A",
  },
  {
    title: "Plan my day",
    description: "Turn your priorities into a realistic plan.",
    shortcut: "P",
  },
  {
    title: "Add a task",
    description: "Capture something you need to get done.",
    shortcut: "T",
  },
  {
    title: "Add a goal",
    description: "Create something meaningful to work toward.",
    shortcut: "G",
  },
  {
    title: "Start a check-in",
    description: "Capture how you're feeling and where your attention is.",
    shortcut: "C",
  },
  {
    title: "Review progress",
    description: "Look at what you've been working on recently.",
    shortcut: "R",
  },
];

const recentActions = [
  {
    title: "Started onboarding UI",
    time: "10:18 AM",
  },
  {
    title: "Completed morning check-in",
    time: "10:42 AM",
  },
  {
    title: "Reviewed product goal",
    time: "Yesterday",
  },
];

export default function CommandPage() {
  const [query, setQuery] = useState("");

  const filteredActions = actions.filter((action) => {
    const value = query.toLowerCase();

    return (
      action.title.toLowerCase().includes(value) ||
      action.description.toLowerCase().includes(value)
    );
  });

  return (
    <div className="space-y-8 py-6">
      {/* Header */}

      <section>
        <p className="text-sm text-neutral-500">Quick actions</p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Command Center
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500">
          Tell Companion what you want to do next.
        </p>
      </section>

      {/* Command Input */}

      <Card className="p-4 sm:p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-sm font-medium">
            /
          </div>

          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            type="text"
            placeholder="What do you want to do?"
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-neutral-400"
          />

          <span className="hidden rounded-md border border-neutral-200 px-2 py-1 text-[11px] text-neutral-400 sm:block">
            ESC
          </span>
        </div>
      </Card>

      {/* Actions */}

      <section>
        <div className="mb-4">
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
            Actions
          </p>

          <h2 className="mt-1 text-xl font-semibold">What can I help with?</h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {filteredActions.map((action) => (
            <CommandAction key={action.title} {...action} />
          ))}
        </div>

        {filteredActions.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-sm font-medium">No matching actions</p>

            <p className="mt-1 text-xs text-neutral-500">
              Try searching for something else.
            </p>
          </Card>
        )}
      </section>

      {/* Recent Actions */}

      <section>
        <div className="mb-4">
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
            Recent
          </p>

          <h2 className="mt-1 text-xl font-semibold">Recent actions</h2>
        </div>

        <Card className="divide-y divide-neutral-100">
          {recentActions.map((action) => (
            <div
              key={`${action.title}-${action.time}`}
              className="flex items-center justify-between gap-4 px-5 py-4"
            >
              <p className="text-sm font-medium">{action.title}</p>

              <span className="shrink-0 text-xs text-neutral-400">
                {action.time}
              </span>
            </div>
          ))}
        </Card>
      </section>

      {/* Companion */}

      <section className="rounded-2xl border border-neutral-200 bg-neutral-100 p-6">
        <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
          Companion
        </p>

        <h2 className="mt-3 text-lg font-semibold">
          You can also just tell me what you need.
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600">
          Instead of choosing an action, describe what you want in your own
          words and Companion can figure out the next step.
        </p>

        <Button
          variant="ghost"
          className="mt-5 px-0 underline underline-offset-4"
        >
          Start conversation
        </Button>
      </section>
    </div>
  );
}
