interface TimelineItemProps {
  time: string;
  title: string;
  description: string;
  type: "task" | "checkin" | "goal" | "companion";
}

const typeLabels = {
  task: "Task",
  checkin: "Check-in",
  goal: "Goal",
  companion: "Companion",
};

export default function TimelineItem({
  time,
  title,
  description,
  type,
}: TimelineItemProps) {
  return (
    <div className="relative flex gap-4">
      <div className="flex flex-col items-center">
        <div className="mt-1 h-2.5 w-2.5 rounded-full bg-neutral-900" />
        <div className="mt-2 w-px flex-1 bg-neutral-200" />
      </div>

      <div className="min-w-0 flex-1 pb-7">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-xs text-neutral-500">{time}</p>

          <span className="text-neutral-300">·</span>

          <p className="text-xs font-medium text-neutral-500">
            {typeLabels[type]}
          </p>
        </div>

        <h3 className="mt-1 text-sm font-medium">{title}</h3>

        <p className="mt-1 text-sm leading-6 text-neutral-600">{description}</p>
      </div>
    </div>
  );
}
