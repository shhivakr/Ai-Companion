import Link from "next/link";

import AuthShell from "@/components/auth/AuthShell";
import Button from "@/components/ui/Button";

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Reset your password"
      description="Enter your email and we'll send you a secure reset link."
      footer={
        <Link
          href="/login"
          className="text-sm font-medium text-foreground-secondary transition-colors hover:text-foreground"
        >
          Back to sign in
        </Link>
      }
    >
      <form className="space-y-5">
        <div>
          <label
            htmlFor="email"
            className="text-sm font-medium text-foreground"
          >
            Email address
          </label>

          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className="mt-2 h-11 w-full rounded-xl border border-border bg-surface-elevated px-3.5 text-sm text-foreground outline-none transition placeholder:text-foreground-muted hover:border-foreground-muted focus:border-foreground-muted focus:ring-1 focus:ring-foreground-muted"
          />
        </div>

        <Button type="submit" className="h-11 w-full rounded-xl">
          Send reset link
        </Button>
      </form>
    </AuthShell>
  );
}
