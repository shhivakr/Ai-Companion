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
    <main className="min-h-screen bg-background px-5 py-8 text-foreground">
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
              <p className="text-[15px] font-semibold text-foreground">
                SIVRA
              </p>

              <p className="text-xs text-foreground-secondary">
                Your personal AI companion
              </p>
            </div>
          </div>
        </div>

        {/* Heading */}

        <div className="mb-6">
          <h1 className="text-[30px] font-semibold leading-tight tracking-[-0.025em] text-foreground">
            {title}
          </h1>

          <p className="mt-2 text-[14px] leading-6 text-foreground-secondary">
            {description}
          </p>
        </div>

        {/* Form */}

        <div className="rounded-2xl border border-border bg-surface p-6 text-foreground shadow-none sm:p-7">
          {children}
        </div>

        {/* Footer */}

        {footer && <div className="mt-6 text-center">{footer}</div>}

        <p className="mt-8 text-center text-[11px] text-foreground-muted">
          Designed and built by {" "}
          <a
            href="https://github.com/shhivakr"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-500"
          >
            Shiva Kumar
          </a>
        </p>
      </div>
    </main>
  );
}
