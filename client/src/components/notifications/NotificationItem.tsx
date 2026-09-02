import type { ReactNode } from "react";
import type { NotificationType } from "@/lib/api/notifications.api";

interface NotificationItemProps {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  type: NotificationType;
  read: boolean;
  icon?: ReactNode;
  onMarkAsRead?: (id: string) => void;
}

function formatRelativeTime(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} min ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hr ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays < 7) return `${diffInDays} days ago`;

  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(date);
}

function NotificationIcon({ type }: { type: NotificationType }) {
  const props = {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (type) {
    case "task":
      return (
        <svg {...props}>
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      );
    case "goal":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" />
        </svg>
      );
    case "check_in":
      return (
        <svg {...props}>
          <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z" />
        </svg>
      );
    case "companion":
      return (
        <svg {...props}>
          <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
        </svg>
      );
    case "reminder":
      return (
        <svg {...props}>
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      );
    case "system":
    default:
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4" />
          <path d="M12 8h.01" />
        </svg>
      );
  }
}

export default function NotificationItem({
  id,
  title,
  description,
  createdAt,
  type,
  read,
  icon,
  onMarkAsRead,
}: NotificationItemProps) {
  const time = formatRelativeTime(createdAt);
  
  return (
    <div
      onClick={() => {
        if (!read && onMarkAsRead) {
          onMarkAsRead(id);
        }
      }}
      className={[
        "flex gap-4 border-b border-border px-5 py-5 last:border-b-0",
        !read ? "bg-surface-elevated cursor-pointer transition hover:opacity-90" : "bg-surface",
      ].join(" ")}
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-surface text-foreground-secondary">
        {icon ?? <NotificationIcon type={type} />}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className={["text-sm", !read ? "font-semibold text-foreground" : "font-medium text-foreground-secondary"].join(" ")}>
                {title}
              </h3>

              {!read && (
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-foreground" />
              )}
            </div>

            {description && (
              <p className="mt-1 text-sm leading-6 text-foreground-secondary">
                {description}
              </p>
            )}
          </div>

          <span className="shrink-0 text-xs text-foreground-muted sm:mt-1">{time}</span>
        </div>
      </div>
    </div>
  );
}
