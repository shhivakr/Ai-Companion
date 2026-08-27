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

      <aside className="relative h-full w-72 border-r border-neutral-200 bg-white text-neutral-950 shadow-xl dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100">
        <div className="flex h-16 items-center justify-between border-b border-neutral-200 px-5 dark:border-neutral-800">
          <Link href="/" onClick={onClose} className="flex items-center gap-3">
            <img
              src="/brand/sivra.logo.png"
              alt="SIVRA"
              className="h-9 w-9 object-contain"
            />

            <div>
              <p className="text-sm font-semibold">SIVRA</p>

              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                Your personal AI companion
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-900"
          >
            ×
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
                      ? "bg-neutral-100 font-medium text-neutral-950 dark:bg-neutral-800 dark:text-white"
                      : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-950 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-white",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="mt-6 border-t border-neutral-200 pt-3 dark:border-neutral-800">
            <Link
              href="/settings"
              onClick={onClose}
              className={[
                "flex h-10 items-center rounded-lg px-3 text-sm transition-colors",
                pathname === "/settings"
                  ? "bg-neutral-100 font-medium text-neutral-950 dark:bg-neutral-800 dark:text-white"
                  : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-950 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-white",
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
