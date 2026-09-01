"use client";

import { useState } from "react";

import Card from "@/components/ui/Card";
import TimelineItem from "@/components/timeline/TimelineItem";

import {
  type TimelineItem as TimelineEvent,
  type TimelineType,
} from "@/lib/api/timeline.api";

import { useTimeline } from "@/hooks/useTimeline";

const filters: {
  label: string;
  value: TimelineType;
}[] = [
  { label: "All", value: "all" },
  { label: "Tasks", value: "task" },
  { label: "Goals", value: "goal" },
  { label: "Check-ins", value: "checkin" },
];

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function formatTime(date: string) {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function isSameDay(date: string, target: Date) {
  const value = new Date(date);

  return (
    value.getFullYear() === target.getFullYear() &&
    value.getMonth() === target.getMonth() &&
    value.getDate() === target.getDate()
  );
}

function groupByDay(items: TimelineEvent[]) {
  const groups = new Map<string, TimelineEvent[]>();

  for (const item of items) {
    const key = new Date(item.createdAt).toDateString();

    const existing = groups.get(key);

    if (existing) {
      existing.push(item);
    } else {
      groups.set(key, [item]);
    }
  }

  return Array.from(groups.values()).map((items) => ({
    date: items[0].createdAt,
    items,
  }));
}

export default function TimelinePage() {
  const [activeFilter, setActiveFilter] = useState<TimelineType>("all");

  const { timeline, isLoading, isFetching, error } = useTimeline(activeFilter);

  const groupedTimeline = groupByDay(timeline);

  const today = new Date();

  return (
    <div className="space-y-8 py-6">
      {/* Header */}

      <section>
        <p className="text-sm text-foreground-secondary">Your journey</p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Timeline
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-foreground-secondary">
          A chronological view of the things you've done, noticed and moved
          forward.
        </p>
      </section>

      {/* Filters */}

      <div className="flex items-center gap-1 overflow-x-auto border-b border-border">
        {filters.map((filter) => {
          const isActive = activeFilter === filter.value;

          return (
            <button
              key={filter.value}
              type="button"
              onClick={() => setActiveFilter(filter.value)}
              className={[
                "shrink-0 px-3 py-3 text-sm transition-colors",
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

      {/* Loading */}

      {isLoading && (
        <Card className="p-6">
          <p className="text-sm text-foreground-secondary">Loading your timeline...</p>
        </Card>
      )}

      {/* Error */}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm text-red-600">
            {error instanceof Error
              ? error.message
              : "Unable to load timeline."}
          </p>
        </div>
      )}

      {/* Timeline */}

      {!isLoading && !error && groupedTimeline.length > 0 && (
        <div className="space-y-8">
          {groupedTimeline.map((group) => {
            const groupDate = new Date(group.date);
            const isToday = isSameDay(group.date, today);

            return (
              <section key={groupDate.toDateString()}>
                <div className="mb-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-foreground-secondary">
                    {formatDate(group.date)}
                  </p>

                  <h2 className="mt-1 text-xl font-semibold">
                    {isToday ? "Today" : "Activity"}
                  </h2>
                </div>

                <Card className="p-6">
                  {group.items.map((item) => (
                    <TimelineItem
                      key={item.id}
                      time={formatTime(item.createdAt)}
                      title={item.title}
                      description={item.description}
                       type={item.type === "companion" ? "task" : item.type}
                    />
                  ))}
                </Card>
              </section>
            );
          })}
        </div>
      )}

      {/* Empty */}

      {!isLoading && !error && groupedTimeline.length === 0 && (
        <Card className="p-8">
          <div className="max-w-md">
            <p className="text-sm font-medium">No activity yet</p>

            <p className="mt-2 text-sm leading-6 text-foreground-secondary">
              Your goals, tasks and check-ins will appear here as you use SIVRA.
            </p>
          </div>
        </Card>
      )}

      {/* Refresh indicator */}

      {!isLoading && isFetching && (
        <p className="text-xs text-foreground-muted">Updating timeline...</p>
      )}

      {/* Companion Insight */}

      <section className="rounded-2xl border border-border bg-surface-elevated p-6">
        <p className="text-xs font-medium uppercase tracking-wide text-foreground-secondary">
          Companion perspective
        </p>

        <h2 className="mt-3 text-lg font-semibold">
          Your activity tells a story.
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-foreground-secondary">
          Over time, your timeline can help reveal patterns in how you work,
          reflect and move toward your goals.
        </p>
      </section>
    </div>
  );
}
