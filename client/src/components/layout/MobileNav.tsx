"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

const navigation = [
  { label: "Home", href: "/" },
  { label: "Companion", href: "/companion" },
  { label: "Goals", href: "/goals" },
  { label: "Tasks", href: "/tasks" },
  { label: "Check-ins", href: "/check-ins" },
  { label: "Timeline", href: "/timeline" },
  { label: "Memory", href: "/memory" },
];

export default function MobileNav({ open, onClose }: MobileNavProps) {
  const pathname = usePathname();

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button
        type="button"
        aria-label="Close navigation"
        onClick={onClose}
        className="absolute inset-0 bg-black/20"
      />

      <aside className="relative h-full w-72 border-r border-border bg-surface text-foreground shadow-xl">
        <div className="flex h-16 items-center justify-between border-b border-border px-5">
          <Link href="/" onClick={onClose} className="flex items-center gap-3">
            <img
              src="/brand/sivra.logo.png"
              alt="SIVRA"
              className="h-9 w-9 object-contain"
            />

            <div>
              <p className="text-sm font-semibold">SIVRA</p>

              <p className="text-[11px] text-foreground-secondary">
                Your personal AI companion
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-foreground-secondary hover:bg-surface-elevated hover:text-foreground"
          >
            x
          </button>
        </div>

        <nav className="px-3 py-4">
          <div className="space-y-1">
            {navigation.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(`${item.href}/`));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
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

          <div className="mt-6 border-t border-border pt-3">
            <Link
              href="/settings"
              onClick={onClose}
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
        </nav>
      </aside>
    </div>
  );
}
