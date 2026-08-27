import type { ReactNode } from "react";

interface AuthShellProps {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
}

export default function AuthShell({
  title,
  description,
  children,
  footer,
}: AuthShellProps) {
  return (
    <main className="min-h-screen bg-neutral-50 px-5 py-8 text-neutral-950 dark:bg-neutral-950 dark:text-neutral-100">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-[420px] flex-col justify-center">
        {/* Brand */}

        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center">
              <img
                src="/brand/sivra.logo.png"
                alt="SIVRA"
                className="h-10 w-10 object-contain"
              />
            </div>

            <div>
              <p className="text-[15px] font-semibold text-neutral-950 dark:text-neutral-50">
                SIVRA
              </p>

              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Your personal AI companion
              </p>
            </div>
          </div>
        </div>

        {/* Heading */}

        <div className="mb-6">
          <h1 className="text-[30px] font-semibold leading-tight tracking-[-0.025em] text-neutral-950 dark:text-neutral-50">
            {title}
          </h1>

          <p className="mt-2 text-[14px] leading-6 text-neutral-500 dark:text-neutral-400">
            {description}
          </p>
        </div>

        {/* Form */}

        <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-neutral-950 shadow-none dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 sm:p-7">
          {children}
        </div>

        {/* Footer */}

        {footer && <div className="mt-6 text-center">{footer}</div>}

        <p className="mt-8 text-center text-[11px] text-neutral-400 dark:text-neutral-500">
          Private by design. Built around your context.
        </p>
      </div>
    </main>
  );
}
