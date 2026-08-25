"use client";

import Link from "next/link";
import { useState } from "react";

import MobileNav from "./MobileNav";

export default function Topbar() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <>
      <header className="flex h-16 items-center justify-between border-b border-neutral-200 bg-white px-4 sm:px-6">
        {/* Left */}

        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileNavOpen(true)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-neutral-200 text-neutral-600 transition hover:bg-neutral-50 lg:hidden"
            aria-label="Open navigation"
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
            className="hidden h-9 w-full max-w-md items-center justify-between rounded-lg border border-neutral-200 px-3 text-sm text-neutral-500 transition hover:border-neutral-300 hover:bg-neutral-50 sm:flex"
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

            <span className="rounded border border-neutral-200 px-1.5 py-0.5 text-[10px] text-neutral-400">
              Ctrl K
            </span>
          </button>
        </div>

        {/* Right */}

        <div className="flex items-center gap-1.5">
          {/* Notifications */}

          <Link
            href="/notifications"
            className="relative flex h-9 w-9 items-center justify-center rounded-lg text-neutral-600 transition hover:bg-neutral-100"
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

            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-neutral-950" />
          </Link>

          {/* Profile */}

          <Link
            href="/settings"
            className="ml-1 flex h-9 w-9 items-center justify-center rounded-full bg-neutral-950 text-xs font-medium text-white transition hover:bg-neutral-800"
            aria-label="Profile settings"
          >
            S
          </Link>
        </div>
      </header>

      <MobileNav
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      />
    </>
  );
}