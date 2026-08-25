import type { ReactNode } from "react";

interface NotificationItemProps {
  title: string;
  description: string;
  time: string;
  type: "reminder" | "goal" | "companion" | "task";
  unread?: boolean;
  icon?: ReactNode;
}

export default function NotificationItem({
  title,
  description,
  time,
  type,
  unread = false,
  icon,
}: NotificationItemProps) {
  return (
    <div
      className={[
        "flex gap-4 border-b border-neutral-100 px-5 py-5 last:border-b-0",
        unread ? "bg-neutral-50/70" : "bg-white",
      ].join(" ")}
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-xs">
        {icon ?? type.charAt(0).toUpperCase()}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium">{title}</h3>

              {unread && (
                <span className="h-1.5 w-1.5 rounded-full bg-neutral-950" />
              )}
            </div>

            <p className="mt-1 text-sm leading-6 text-neutral-600">
              {description}
            </p>
          </div>

          <span className="shrink-0 text-xs text-neutral-400">{time}</span>
        </div>
      </div>
    </div>
  );
}
