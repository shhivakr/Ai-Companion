import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import NotificationItem from "@/components/notifications/NotificationItem";

const todayNotifications = [
  {
    title: "Your focus is waiting",
    description:
      "You planned to finish the onboarding UI today. Want to continue?",
    time: "10 min ago",
    type: "task" as const,
    unread: true,
  },
  {
    title: "A goal moved forward",
    description: "Your product goal is making steady progress this week.",
    time: "1 hr ago",
    type: "goal" as const,
    unread: true,
  },
  {
    title: "Companion noticed a pattern",
    description:
      "You tend to make more progress when you choose one clear priority.",
    time: "3 hrs ago",
    type: "companion" as const,
  },
];

const earlierNotifications = [
  {
    title: "Evening reflection",
    description: "Your evening check-in is scheduled for 9:30 PM.",
    time: "Yesterday",
    type: "reminder" as const,
  },
  {
    title: "Task completed",
    description: "You completed the project setup task.",
    time: "Yesterday",
    type: "task" as const,
  },
];

export default function NotificationsPage() {
  return (
    <div className="space-y-8 py-6">
      {/* Header */}

      <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm text-neutral-500">Updates</p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Notifications
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500">
            Useful reminders and updates from your Companion.
          </p>
        </div>

        <Button variant="secondary">Mark all as read</Button>
      </section>

      {/* Today */}

      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
              Today
            </p>

            <h2 className="mt-1 text-xl font-semibold">Recent updates</h2>
          </div>

          <span className="text-xs text-neutral-500">2 unread</span>
        </div>

        <Card className="overflow-hidden">
          {todayNotifications.map((notification) => (
            <NotificationItem
              key={`${notification.title}-${notification.time}`}
              {...notification}
            />
          ))}
        </Card>
      </section>

      {/* Earlier */}

      <section>
        <div className="mb-4">
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
            Earlier
          </p>

          <h2 className="mt-1 text-xl font-semibold">Previous updates</h2>
        </div>

        <Card className="overflow-hidden">
          {earlierNotifications.map((notification) => (
            <NotificationItem
              key={`${notification.title}-${notification.time}`}
              {...notification}
            />
          ))}
        </Card>
      </section>

      {/* Preferences */}

      <section className="rounded-2xl border border-neutral-200 bg-neutral-100 p-6">
        <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
          Preferences
        </p>

        <h2 className="mt-3 text-lg font-semibold">
          Control what reaches you.
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600">
          Choose which reminders, goal updates and Companion insights you want
          to receive.
        </p>

        <Button
          variant="ghost"
          className="mt-5 px-0 underline underline-offset-4"
        >
          Notification settings
        </Button>
      </section>
    </div>
  );
}
