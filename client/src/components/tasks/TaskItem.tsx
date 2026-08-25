import Badge from "@/components/ui/Badge";

interface TaskItemProps {
  title: string;
  goal: string;
  priority: "High" | "Medium" | "Low";
  due?: string;
  completed?: boolean;
}

export default function TaskItem({
  title,
  goal,
  priority,
  due,
  completed = false,
}: TaskItemProps) {
  return (
    <div className="flex items-start gap-4 py-4">
      <button
        type="button"
        aria-label={`Complete ${title}`}
        className={[
          "mt-0.5 h-5 w-5 shrink-0 rounded-full border transition-colors",
          completed
            ? "border-neutral-950 bg-neutral-950"
            : "border-neutral-300 hover:border-neutral-900",
        ].join(" ")}
      />

      <div className="min-w-0 flex-1">
        <p
          className={[
            "text-sm font-medium",
            completed ? "text-neutral-400 line-through" : "text-neutral-950",
          ].join(" ")}
        >
          {title}
        </p>

        <div className="mt-1 flex flex-wrap items-center gap-2">
          <span className="text-xs text-neutral-500">{goal}</span>

          {due && (
            <>
              <span className="text-neutral-300">·</span>

              <span className="text-xs text-neutral-500">{due}</span>
            </>
          )}
        </div>
      </div>

      <Badge variant={priority === "High" ? "default" : "muted"}>
        {priority}
      </Badge>
    </div>
  );
}
