"use client";

import Link from "next/link";

interface MobileHeaderProps {
  onMenuClick: () => void;
}

export default function MobileHeader({ onMenuClick }: MobileHeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-surface px-4 text-foreground lg:hidden">
      <Link href="/" className="flex items-center gap-2.5">
        <img
          src="/brand/sivra.logo.png"
          alt="SIVRA"
          className="h-8 w-8 object-contain"
        />

        <span className="text-[15px] font-semibold tracking-tight">SIVRA</span>
      </Link>

      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Open navigation"
        className="flex h-9 w-9 items-center justify-center rounded-lg text-foreground-secondary hover:bg-surface-elevated hover:text-foreground"
      >
        <svg
          width="20"
          height="20"
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
    </header>
  );
}
