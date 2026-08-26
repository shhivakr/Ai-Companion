"use client";

import GoalCard from "@/components/goals/GoalCard";
import GoalForm from "@/components/goals/GoalForm";
import GoalModal from "@/components/goals/GoalModal";
import Button from "@/components/ui/Button";
import { useGoals } from "@/hooks/useGoals";
import { useState } from "react";

export default function GoalsPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  /*================================ Hooks ================================*/
  const { data: goals = [], isLoading, isError, error } = useGoals();
  return (
    <div className="space-y-8 py-6">
      {/*========================== Header =================================*/}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <section>
          <p className="text-sm text-neutral-500">Direction</p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Goals
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500">
            What you are moving toward, and what matters next.
          </p>
        </section>

        <Button type="button" onClick={() => setIsCreateOpen(true)}>
          Add goal
        </Button>
      </div>
      <section className="grid gap-5 lg:grid-cols-2">
        {isLoading ? (
          <div className="rounded-2xl border border-neutral-200 bg-white p-6">
            <p className="text-sm text-neutral-500">Loading your goals...</p>
          </div>
        ) : isError ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <p className="text-sm text-red-600">
              {error instanceof Error ? error.message : "Unable to load goals."}
            </p>
          </div>
        ) : goals.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-8 lg:col-span-2">
            <p className="text-sm font-medium">No goals yet.</p>

            <p className="mt-1 text-sm text-neutral-500">
              Create your first goal to give Companion something meaningful to
              work with.
            </p>
          </div>
        ) : (
          goals.map((goal) => <GoalCard key={goal._id} {...goal} />)
        )}
      </section>

      {/* ================================ Filters ================================= */}

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

      {/* ===================================== Goals ===================================== */}

      <section className="grid gap-5 lg:grid-cols-2">
        {goals.map((goal) => (
          <GoalCard key={goal._id} {...goal} />
        ))}
      </section>

      {/* ===================================== Companion Context ===================================== */}

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
      <GoalModal open={isCreateOpen} onClose={() => setIsCreateOpen(false)}>
        <GoalForm
          onSuccess={() => {
            setIsCreateOpen(false);
          }}
          onCancel={() => {
            setIsCreateOpen(false);
          }}
        />
      </GoalModal>
    </div>
  );
}
