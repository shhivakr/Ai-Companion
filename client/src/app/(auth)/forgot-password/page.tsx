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
          className="text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-950"
        >
          Back to sign in
        </Link>
      }
    >
      <form className="space-y-5">
        <div>
          <label
            htmlFor="email"
            className="text-sm font-medium text-neutral-900"
          >
            Email address
          </label>

          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className="mt-2 h-11 w-full rounded-xl border border-neutral-200 bg-white px-3.5 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 hover:border-neutral-300 focus:border-neutral-400 focus:ring-4 focus:ring-neutral-100"
          />
        </div>

        <Button type="submit" className="h-11 w-full rounded-xl">
          Send reset link
        </Button>
      </form>
    </AuthShell>
  );
}
