"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { label: "Home", href: "/" },
  { label: "Companion", href: "/companion" },
  { label: "Goals", href: "/goals" },
  { label: "Tasks", href: "/tasks" },
  { label: "Check-ins", href: "/check-ins" },
  { label: "Timeline", href: "/timeline" },
  { label: "Memory", href: "/memory" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-border bg-surface text-foreground lg:flex lg:flex-col">
      {/* Brand */}
      <div className="flex h-20 items-center px-5">
        <Link href="/" className="flex items-center gap-3">
          <img
            src="/brand/sivra.logo.png"
            alt="SIVRA"
            className="h-10 w-10 object-contain"
          />

          <div>
            <p className="text-[15px] font-semibold tracking-tight text-foreground">
              SIVRA
            </p>

            <p className="text-[11px] text-foreground-secondary">
              Your personal AI companion
            </p>
          </div>
        </Link>
      </div>
      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        <div className="space-y-1">
          {navigation.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(`${item.href}/`));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "flex h-10 items-center rounded-lg px-3 text-sm transition-colors",
                  active
                    ? "bg-surface-elevated font-medium text-foreground"
                    : "text-foreground-secondary hover:bg-surface-elevated hover:text-foreground",
                ].join(" ")}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
      {/* Settings */}
      <div className="border-t border-border p-3">
        <Link
          href="/settings"
          className={[
            "flex h-10 items-center rounded-lg px-3 text-sm transition-colors",
            pathname === "/settings"
              ? "bg-surface-elevated font-medium text-foreground"
              : "text-foreground-secondary hover:bg-surface-elevated hover:text-foreground",
          ].join(" ")}
        >
          Settings
        </Link>
      </div>
    </aside>
  );
}
