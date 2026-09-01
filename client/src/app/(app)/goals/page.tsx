"use client";

import { useState } from "react";

import GoalCard from "@/components/goals/GoalCard";
import GoalForm from "@/components/goals/GoalForm";
import GoalModal from "@/components/goals/GoalModal";
import Button from "@/components/ui/Button";
import { useGoals } from "@/hooks/useGoals";

type GoalFilter = "all" | "active" | "completed" | "paused";

const filters: {
  value: GoalFilter;
  label: string;
}[] = [
  {
    value: "all",
    label: "All",
  },
  {
    value: "active",
    label: "Active",
  },
  {
    value: "completed",
    label: "Completed",
  },
  {
    value: "paused",
    label: "Paused",
  },
];

export default function GoalsPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const [statusFilter, setStatusFilter] = useState<GoalFilter>("all");

  /* ================================ Hooks ================================ */

  const { data: goals = [], isLoading, isError, error } = useGoals();

  /* ================================ Filter ================================ */

  const filteredGoals =
    statusFilter === "all"
      ? goals
      : goals.filter((goal) => goal.status === statusFilter);

  /* ================================ Render ================================ */

  return (
    <div className="space-y-8 py-6">
      {/* ================================ Header ================================ */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <section>
          <p className="text-sm text-foreground-secondary">Direction</p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Goals
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-foreground-secondary">
            What you are moving toward, and what matters next.
          </p>
        </section>

        <Button type="button" onClick={() => setIsCreateOpen(true)}>
          Add goal
        </Button>
      </div>

      {/* ================================ Filters ================================ */}

      <div className="flex flex-wrap items-center gap-1 border-b border-border">
        {filters.map((filter) => {
          const isActive = statusFilter === filter.value;

          return (
            <button
              key={filter.value}
              type="button"
              onClick={() => setStatusFilter(filter.value)}
              className={[
                "rounded-t-lg px-3 py-3 text-sm transition-colors",
                isActive
                  ? "border-b-2 border-foreground font-medium text-foreground"
                  : "text-foreground-secondary hover:text-foreground",
              ].join(" ")}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      {/* ================================ Goals ================================ */}

      <section className="grid gap-5 lg:grid-cols-2">
        {isLoading ? (
          <>
            <GoalSkeleton />
            <GoalSkeleton />
          </>
        ) : isError ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 lg:col-span-2 dark:border-red-900/50 dark:bg-red-900/20">
            <p className="text-sm text-red-600 dark:text-red-400">
              {error instanceof Error ? error.message : "Unable to load goals."}
            </p>
          </div>
        ) : filteredGoals.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-surface p-8 lg:col-span-2">
            <p className="text-sm font-medium">
              {statusFilter === "all"
                ? "No goals yet."
                : `No ${statusFilter} goals.`}
            </p>

            <p className="mt-1 text-sm text-foreground-secondary">
              {statusFilter === "all"
                ? "Create your first goal to give Companion something meaningful to work with."
                : "Goals with this status will appear here."}
            </p>

            {statusFilter === "all" && (
              <Button
                type="button"
                className="mt-5"
                onClick={() => setIsCreateOpen(true)}
              >
                Create your first goal
              </Button>
            )}
          </div>
        ) : (
          filteredGoals.map((goal) => <GoalCard key={goal._id} {...goal} />)
        )}
      </section>

      {/* ================================ Companion Context ================================ */}

      <section className="rounded-2xl border border-border bg-surface-elevated p-6">
        <p className="text-xs font-medium uppercase tracking-wide text-foreground-secondary">
          Companion perspective
        </p>

        <h2 className="mt-3 text-lg font-semibold">
          Your product goal is currently getting the most momentum.
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-foreground-secondary">
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

      {/* ================================ Create Goal Modal ================================ */}

      <GoalModal open={isCreateOpen} onClose={() => setIsCreateOpen(false)}>
        <GoalForm
          onSuccess={() => setIsCreateOpen(false)}
          onCancel={() => setIsCreateOpen(false)}
        />
      </GoalModal>
    </div>
  );
}

/* ================================ Skeleton ================================ */

function GoalSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-border bg-surface p-6">
      <div className="h-4 w-20 rounded bg-neutral-100 dark:bg-neutral-800" />
      <div className="mt-4 h-6 w-2/3 rounded bg-neutral-100 dark:bg-neutral-800" />
      <div className="mt-3 h-4 w-full rounded bg-neutral-100 dark:bg-neutral-800" />
      <div className="mt-2 h-4 w-4/5 rounded bg-neutral-100 dark:bg-neutral-800" />
      <div className="mt-6 h-1.5 w-full rounded bg-neutral-100 dark:bg-neutral-800" />
      <div className="mt-6 h-4 w-32 rounded bg-neutral-100 dark:bg-neutral-800" />
      <div className="mt-5 h-9 w-24 rounded-lg bg-neutral-100 dark:bg-neutral-800" />
    </div>
  );
}
