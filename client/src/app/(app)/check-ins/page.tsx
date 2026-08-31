"use client";

import { useState } from "react";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import CheckinOption from "@/components/checkins/CheckinOption";
import CheckinSummary from "@/components/checkins/CheckinSummary";

import {
  type CheckInEnergy,
  type CheckInFeeling,
  type CheckInFocus,
} from "@/lib/api/checkin.api";

import { useCheckIns } from "@/hooks/useCheckIns";

const feelingOptions: {
  label: string;
  value: CheckInFeeling;
  description: string;
}[] = [
  {
    label: "Good",
    value: "good",
    description: "Feeling positive and steady.",
  },
  {
    label: "Okay",
    value: "okay",
    description: "Nothing major, just getting through it.",
  },
  {
    label: "Low",
    value: "low",
    description: "Feeling a little off today.",
  },
];

const energyOptions: {
  label: string;
  value: CheckInEnergy;
  description: string;
}[] = [
  {
    label: "High",
    value: "high",
    description: "Ready to take on meaningful work.",
  },
  {
    label: "Medium",
    value: "medium",
    description: "Can focus, but need reasonable pacing.",
  },
  {
    label: "Low",
    value: "low",
    description: "Better suited for lighter work.",
  },
];

const focusOptions: {
  label: string;
  value: CheckInFocus;
}[] = [
  {
    label: "Product work",
    value: "product_work",
  },
  {
    label: "Client work",
    value: "client_work",
  },
  {
    label: "Learning",
    value: "learning",
  },
];

function formatLabel(value: string) {
  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export default function CheckinsPage() {
  const {
    checkIns,
    todayCheckIn,
    isLoading,
    isCreating,
    error,
    createCheckIn,
  } = useCheckIns();

  const [feeling, setFeeling] = useState<CheckInFeeling | "">("");
  const [energy, setEnergy] = useState<CheckInEnergy | "">("");
  const [focus, setFocus] = useState<CheckInFocus | "">("");
  const [note, setNote] = useState("");

  async function handleSubmit() {
    if (!feeling || !energy || !focus || isCreating) {
      return;
    }

    try {
      await createCheckIn({
        feeling,
        energy,
        focus,
        note: note.trim() || undefined,
      });

      setFeeling("");
      setEnergy("");
      setFocus("");
      setNote("");
    } catch {
      // Error is exposed through the hook.
    }
  }

  return (
    <div className="space-y-8 py-6">
      {/* Header */}

      <section>
        <p className="text-sm text-neutral-500">Reflection</p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Check-in
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500">
          Take a moment to capture where you are right now.
        </p>
      </section>

      {/* Today's Check-in */}

      {todayCheckIn && (
        <Card className="border-neutral-200 bg-neutral-50 p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
            Today's check-in
          </p>

          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            <span className="rounded-full border border-neutral-200 bg-white px-3 py-1.5">
              Feeling · {formatLabel(todayCheckIn.feeling)}
            </span>

            <span className="rounded-full border border-neutral-200 bg-white px-3 py-1.5">
              Energy · {formatLabel(todayCheckIn.energy)}
            </span>

            <span className="rounded-full border border-neutral-200 bg-white px-3 py-1.5">
              Focus · {formatLabel(todayCheckIn.focus)}
            </span>
          </div>

          {todayCheckIn.note && (
            <p className="mt-4 text-sm leading-6 text-neutral-600">
              {todayCheckIn.note}
            </p>
          )}
        </Card>
      )}

      {/* Error */}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm text-red-600">
            {error instanceof Error
              ? error.message
              : "Unable to load check-ins."}
          </p>
        </div>
      )}

      {/* Check-in Form */}

      <Card className="p-6 sm:p-8">
        <div className="space-y-8">
          {/* Feeling */}

          <section>
            <div className="mb-4">
              <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                01
              </p>

              <h2 className="mt-1 text-lg font-semibold">
                How are you feeling?
              </h2>

              <p className="mt-1 text-sm text-neutral-500">
                Choose what feels closest right now.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {feelingOptions.map((option) => (
                <CheckinOption
                  key={option.value}
                  label={option.label}
                  description={option.description}
                  selected={feeling === option.value}
                  onClick={() => setFeeling(option.value)}
                />
              ))}
            </div>
          </section>

          {/* Energy */}

          <section className="border-t border-neutral-100 pt-8">
            <div className="mb-4">
              <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                02
              </p>

              <h2 className="mt-1 text-lg font-semibold">
                How is your energy?
              </h2>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {energyOptions.map((option) => (
                <CheckinOption
                  key={option.value}
                  label={option.label}
                  description={option.description}
                  selected={energy === option.value}
                  onClick={() => setEnergy(option.value)}
                />
              ))}
            </div>
          </section>

          {/* Focus */}

          <section className="border-t border-neutral-100 pt-8">
            <div className="mb-4">
              <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                03
              </p>

              <h2 className="mt-1 text-lg font-semibold">
                What deserves your attention?
              </h2>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {focusOptions.map((option) => (
                <CheckinOption
                  key={option.value}
                  label={option.label}
                  selected={focus === option.value}
                  onClick={() => setFocus(option.value)}
                />
              ))}
            </div>
          </section>

          {/* Note */}

          <section className="border-t border-neutral-100 pt-8">
            <div className="mb-4">
              <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                04 · Optional
              </p>

              <h2 className="mt-1 text-lg font-semibold">
                Anything else on your mind?
              </h2>
            </div>

            <textarea
              rows={4}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              maxLength={1000}
              placeholder="Write a short note..."
              className="w-full resize-none rounded-xl border border-neutral-200 p-4 text-sm outline-none placeholder:text-neutral-400 focus:border-neutral-400"
            />

            <p className="mt-2 text-right text-xs text-neutral-400">
              {note.length}/1000
            </p>
          </section>

          <div className="flex justify-end border-t border-neutral-100 pt-6">
            <Button
              onClick={handleSubmit}
              disabled={!feeling || !energy || !focus || isCreating}
            >
              {isCreating ? "Saving..." : "Complete check-in"}
            </Button>
          </div>
        </div>
      </Card>

      {/* Recent Check-ins */}

      <section>
        <div className="mb-4">
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
            History
          </p>

          <h2 className="mt-1 text-xl font-semibold">Recent check-ins</h2>
        </div>

        <div className="space-y-3">
          {isLoading ? (
            <p className="text-sm text-neutral-500">
              Loading your check-ins...
            </p>
          ) : checkIns.length > 0 ? (
            checkIns.map((checkIn) => (
              <CheckinSummary
                key={checkIn._id}
                date={formatDate(checkIn.createdAt)}
                feeling={formatLabel(checkIn.feeling)}
                energy={formatLabel(checkIn.energy)}
                focus={formatLabel(checkIn.focus)}
              />
            ))
          ) : (
            <p className="text-sm text-neutral-500">No check-ins yet.</p>
          )}
        </div>
      </section>

      {/* Companion */}

      <section className="rounded-2xl border border-neutral-200 bg-neutral-100 p-6">
        <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
          Companion
        </p>

        <h2 className="mt-3 text-lg font-semibold">
          Your check-ins help me understand your patterns.
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600">
          Over time, these small reflections can help surface useful patterns
          around your energy, focus and progress.
        </p>
      </section>
    </div>
  );
}
