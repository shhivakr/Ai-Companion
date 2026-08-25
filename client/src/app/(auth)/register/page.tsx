import Link from "next/link";

import AuthShell from "@/components/auth/AuthShell";
import GoogleButton from "@/components/auth/GoogleButton";
import Button from "@/components/ui/Button";

export default function RegisterPage() {
  return (
    <AuthShell
      title="Create your account"
      description="Start building a better way to plan, reflect and move forward."
      footer={
        <p className="text-sm text-neutral-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-neutral-950 hover:underline"
          >
            Sign in
          </Link>
        </p>
      }
    >
      <div className="space-y-5">
        <GoogleButton />

        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-neutral-100" />

          <span className="text-xs text-neutral-400">
            or continue with email
          </span>

          <div className="h-px flex-1 bg-neutral-100" />
        </div>

        <form className="space-y-5">
          <div>
            <label
              htmlFor="name"
              className="text-sm font-medium text-neutral-900"
            >
              Name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Your name"
              className="mt-2 h-11 w-full rounded-xl border border-neutral-200 bg-white px-3.5 text-sm outline-none transition placeholder:text-neutral-400 hover:border-neutral-300 focus:border-neutral-400 focus:ring-4 focus:ring-neutral-100"
            />
          </div>

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
              className="mt-2 h-11 w-full rounded-xl border border-neutral-200 bg-white px-3.5 text-sm outline-none transition placeholder:text-neutral-400 hover:border-neutral-300 focus:border-neutral-400 focus:ring-4 focus:ring-neutral-100"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="text-sm font-medium text-neutral-900"
            >
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="At least 8 characters"
              className="mt-2 h-11 w-full rounded-xl border border-neutral-200 bg-white px-3.5 text-sm outline-none transition placeholder:text-neutral-400 hover:border-neutral-300 focus:border-neutral-400 focus:ring-4 focus:ring-neutral-100"
            />

            <p className="mt-2 text-xs text-neutral-400">
              Use at least 8 characters.
            </p>
          </div>

          <Button type="submit" className="h-11 w-full rounded-xl">
            Create account
          </Button>
        </form>
      </div>
    </AuthShell>
  );
}
