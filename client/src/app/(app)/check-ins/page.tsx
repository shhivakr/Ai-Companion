"use client";

import { useState } from "react";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import CheckinOption from "@/components/checkins/CheckinOption";
import CheckinSummary from "@/components/checkins/CheckinSummary";

const recentCheckins = [
  {
    date: "Sunday, August 24",
    feeling: "Good",
    energy: "High",
    focus: "Product work",
  },
  {
    date: "Saturday, August 23",
    feeling: "Okay",
    energy: "Medium",
    focus: "Learning",
  },
];

export default function CheckinsPage() {
  const [feeling, setFeeling] = useState("");
  const [energy, setEnergy] = useState("");
  const [focus, setFocus] = useState("");

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
              {[
                {
                  label: "Good",
                  description: "Feeling positive and steady.",
                },
                {
                  label: "Okay",
                  description: "Nothing major, just getting through it.",
                },
                {
                  label: "Low",
                  description: "Feeling a little off today.",
                },
              ].map((option) => (
                <CheckinOption
                  key={option.label}
                  {...option}
                  selected={feeling === option.label}
                  onClick={() => setFeeling(option.label)}
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
              {[
                {
                  label: "High",
                  description: "Ready to take on meaningful work.",
                },
                {
                  label: "Medium",
                  description: "Can focus, but need reasonable pacing.",
                },
                {
                  label: "Low",
                  description: "Better suited for lighter work.",
                },
              ].map((option) => (
                <CheckinOption
                  key={option.label}
                  {...option}
                  selected={energy === option.label}
                  onClick={() => setEnergy(option.label)}
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
              {["Product work", "Client work", "Learning"].map((option) => (
                <CheckinOption
                  key={option}
                  label={option}
                  selected={focus === option}
                  onClick={() => setFocus(option)}
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
              placeholder="Write a short note..."
              className="w-full resize-none rounded-xl border border-neutral-200 p-4 text-sm outline-none placeholder:text-neutral-400 focus:border-neutral-400"
            />
          </section>

          <div className="flex justify-end border-t border-neutral-100 pt-6">
            <Button>Complete check-in</Button>
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
          {recentCheckins.map((checkin) => (
            <CheckinSummary key={checkin.date} {...checkin} />
          ))}
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
