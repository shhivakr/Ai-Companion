"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { useGoal } from "@/hooks/useGoals";
import { useState } from "react";
import GoalEditForm from "@/components/goals/GoalEditForm";
import GoalModal from "@/components/goals/GoalModal";
import GoalDeleteDialog from "@/components/goals/GoalDeleteDialog";

export default function GoalDetailPage() {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const params = useParams();
  const goalId = typeof params.id === "string" ? params.id : "";
  const router = useRouter();
  const { data: goal, isLoading, isError, error } = useGoal(goalId);

  if (isLoading) {
    return (
      <div className="py-10">
        <p className="text-sm text-neutral-500">Loading goal...</p>
      </div>
    );
  }

  if (isError || !goal) {
    return (
      <div className="space-y-4 py-10">
        <p className="text-sm text-red-600">
          {error instanceof Error ? error.message : "Goal not found."}
        </p>

        <Link href="/goals">
          <Button variant="secondary">Back to goals</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-6">
      <section>
        <Link
          href="/goals"
          className="text-sm text-neutral-500 hover:text-neutral-950"
        >
          ← Back to goals
        </Link>

        <div className="mt-6 flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
          <div>
            {goal.category && <Badge variant="muted">{goal.category}</Badge>}

            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              {goal.title}
            </h1>

            {goal.description && (
              <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-500">
                {goal.description}
              </p>
            )}
          </div>

          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setIsEditOpen(true)}>
              Edit
            </Button>
            <Button variant="ghost" onClick={() => setIsDeleteOpen(true)}>
              Delete
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-neutral-500">Progress</p>

              <p className="mt-2 text-3xl font-semibold">{goal.progress}%</p>
            </div>

            <Badge variant="muted">{goal.status}</Badge>
          </div>

          <div className="mt-6 h-2 overflow-hidden rounded-full bg-neutral-100">
            <div
              className="h-full rounded-full bg-neutral-900"
              style={{
                width: `${goal.progress}%`,
              }}
            />
          </div>
        </Card>

        <Card className="p-6">
          <p className="text-xs text-neutral-500">Target date</p>

          <p className="mt-2 text-sm font-medium">
            {goal.targetDate
              ? new Date(goal.targetDate).toLocaleDateString()
              : "No target date"}
          </p>
        </Card>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        {goal.milestone && (
          <Card className="p-6">
            <p className="text-xs text-neutral-500">Current milestone</p>

            <p className="mt-2 text-sm font-medium">{goal.milestone}</p>
          </Card>
        )}

        {goal.nextAction && (
          <Card className="p-6">
            <p className="text-xs text-neutral-500">Next action</p>

            <p className="mt-2 text-sm font-medium">{goal.nextAction}</p>
          </Card>
        )}
      </section>

      <Card className="bg-neutral-100 p-6">
        <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
          Companion perspective
        </p>

        <h2 className="mt-3 text-lg font-semibold">
          Keep your next action clear.
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600">
          Companion can use this goal and its context to help you decide what to
          focus on next.
        </p>
      </Card>
      <GoalModal open={isEditOpen} onClose={() => setIsEditOpen(false)}>
        {goal && (
          <GoalEditForm
            goal={goal}
            onSuccess={() => setIsEditOpen(false)}
            onCancel={() => setIsEditOpen(false)}
          />
        )}
      </GoalModal>
      <GoalDeleteDialog
        goalId={goal._id}
        open={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onSuccess={() => {
          router.push("/goals");
        }}
      />
    </div>
  );
}
