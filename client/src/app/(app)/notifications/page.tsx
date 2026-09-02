"use client";

import { useMemo } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import NotificationItem from "@/components/notifications/NotificationItem";
import {
  useNotifications,
  useMarkAllNotificationsAsRead,
  useMarkNotificationAsRead,
} from "@/hooks/useNotifications";
import type { Notification } from "@/lib/api/notifications.api";
import EmptyState from "@/components/ui/EmptyState";

function isToday(dateString: string) {
  const date = new Date(dateString);
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

function NotificationSkeleton() {
  return (
    <div className="flex gap-4 border-b border-border px-5 py-5 last:border-b-0 animate-pulse bg-surface">
      <div className="h-9 w-9 shrink-0 rounded-full bg-border" />
      <div className="min-w-0 flex-1 space-y-3 py-1">
        <div className="flex items-center justify-between gap-4">
          <div className="h-4 w-32 rounded bg-border" />
          <div className="h-3 w-16 rounded bg-border" />
        </div>
        <div className="h-3 w-3/4 rounded bg-border" />
      </div>
    </div>
  );
}

export default function NotificationsPage() {
  const { data: notifications, isLoading, isError } = useNotifications();
  const { mutate: markAllAsRead, isPending: markingAll } = useMarkAllNotificationsAsRead();
  const { mutate: markAsRead } = useMarkNotificationAsRead();

  const { today, earlier, unreadCount } = useMemo(() => {
    if (!notifications) return { today: [], earlier: [], unreadCount: 0 };
    
    const todayList: Notification[] = [];
    const earlierList: Notification[] = [];
    let count = 0;

    notifications.forEach((n) => {
      if (!n.read) count++;
      if (isToday(n.createdAt)) {
        todayList.push(n);
      } else {
        earlierList.push(n);
      }
    });

    return { today: todayList, earlier: earlierList, unreadCount: count };
  }, [notifications]);

  return (
    <div className="space-y-8 py-6">
      {/* Header */}
      <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm text-foreground-muted">Updates</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Notifications
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-foreground-muted">
            Useful reminders and updates from your Companion.
          </p>
        </div>

        <Button 
          variant="secondary" 
          onClick={() => markAllAsRead()}
          disabled={unreadCount === 0 || markingAll || isLoading}
        >
          {markingAll ? "Marking..." : "Mark all as read"}
        </Button>
      </section>

      {isLoading ? (
        <Card className="overflow-hidden">
          <NotificationSkeleton />
          <NotificationSkeleton />
          <NotificationSkeleton />
        </Card>
      ) : isError ? (
        <div className="py-12 text-center text-sm text-foreground-secondary">
          Failed to load notifications. Please try again later.
        </div>
      ) : notifications?.length === 0 ? (
        <EmptyState
          title="No notifications yet"
          description="You're all caught up. New updates will appear here."
        />
      ) : (
        <>
          {/* Today */}
          {today.length > 0 && (
            <section>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-foreground-muted">
                    Today
                  </p>
                  <h2 className="mt-1 text-xl font-semibold">Recent updates</h2>
                </div>

                {unreadCount > 0 && (
                  <span className="text-xs text-foreground-muted">{unreadCount} unread</span>
                )}
              </div>

              <Card className="overflow-hidden">
                {today.map((notification) => (
                  <NotificationItem
                    key={notification._id}
                    id={notification._id}
                    title={notification.title}
                    description={notification.description}
                    createdAt={notification.createdAt}
                    type={notification.type}
                    read={notification.read}
                    onMarkAsRead={markAsRead}
                  />
                ))}
              </Card>
            </section>
          )}

          {/* Earlier */}
          {earlier.length > 0 && (
            <section>
              <div className="mb-4">
                <p className="text-xs font-medium uppercase tracking-wide text-foreground-muted">
                  Earlier
                </p>
                <h2 className="mt-1 text-xl font-semibold">Previous updates</h2>
              </div>

              <Card className="overflow-hidden">
                {earlier.map((notification) => (
                  <NotificationItem
                    key={notification._id}
                    id={notification._id}
                    title={notification.title}
                    description={notification.description}
                    createdAt={notification.createdAt}
                    type={notification.type}
                    read={notification.read}
                    onMarkAsRead={markAsRead}
                  />
                ))}
              </Card>
            </section>
          )}
        </>
      )}

      {/* Preferences */}
      <section className="rounded-2xl border border-border bg-surface p-6">
        <p className="text-xs font-medium uppercase tracking-wide text-foreground-muted">
          Preferences
        </p>

        <h2 className="mt-3 text-lg font-semibold text-foreground">
          Control what reaches you.
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-foreground-secondary">
          Choose which reminders, goal updates and Companion insights you want
          to receive.
        </p>

        <Button
          variant="ghost"
          className="mt-5 px-0 underline underline-offset-4 text-foreground hover:text-foreground-secondary"
        >
          Notification settings
        </Button>
      </section>
    </div>
  );
}
