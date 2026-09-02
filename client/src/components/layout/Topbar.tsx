"use client";

import Link from "next/link";
import { useState } from "react";

import MobileNav from "./MobileNav";
import ThemeToggle from "../ui/ThemeToggle";
import { useUnreadNotificationCount } from "@/hooks/useNotifications";

export default function Topbar() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { data: unreadCount = 0 } = useUnreadNotificationCount();

  return (
    <>
      <header className="flex h-16 items-center justify-between border-b border-border bg-surface px-4 text-foreground sm:px-6">
        {/* Left */}
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileNavOpen(true)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border text-foreground-secondary transition hover:bg-surface-elevated hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground-muted focus-visible:ring-offset-2 focus-visible:ring-offset-background lg:hidden"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            >
              <path d="M4 6h16" />
              <path d="M4 12h16" />
              <path d="M4 18h16" />
            </svg>
          </button>

          {/* Search */}
          <button
            type="button"
            className="hidden h-9 w-full max-w-md items-center justify-between rounded-lg border border-border bg-surface-elevated px-3 text-sm text-foreground-secondary transition hover:border-foreground-muted sm:flex"
          >
            <span className="flex items-center gap-2">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              >
                <circle cx="11" cy="11" r="6.5" />
                <path d="m16 16 4 4" />
              </svg>
              <span>Search or ask SIVRA...</span>
            </span>
            <span className="rounded border border-border px-1.5 py-0.5 text-[10px] text-foreground-muted">
              Ctrl K
            </span>
          </button>
        </div>

        {/* Right */}
        <div className="flex items-center gap-1.5">
          <ThemeToggle />

          {/* Notifications */}
          <Link
            href="/notifications"
            className="relative flex h-9 w-9 items-center justify-center rounded-lg text-foreground-secondary transition hover:bg-surface-elevated hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground-muted focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            aria-label="Notifications"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
              <path d="M10 21h4" />
            </svg>
            {/* Unread indicator */}
            {unreadCount > 0 && (
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-foreground" />
            )}
          </Link>

          {/* Profile */}
          <Link
            href="/settings"
            className="ml-1 flex h-9 w-9 items-center justify-center rounded-full bg-foreground text-xs font-medium text-background transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground-muted focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            S
          </Link>
        </div>
      </header>

      <MobileNav open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
    </>
  );
}
