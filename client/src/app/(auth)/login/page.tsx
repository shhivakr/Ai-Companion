import Link from "next/link";

import AuthShell from "@/components/auth/AuthShell";
import GoogleButton from "@/components/auth/GoogleButton";
import Button from "@/components/ui/Button";

export default function LoginPage() {
  return (
    <AuthShell
      title="Welcome back"
      description="Sign in to continue with your Companion."
      footer={
        <p className="text-sm text-neutral-500">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-neutral-950 hover:underline"
          >
            Create one
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

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="text-sm font-medium text-neutral-900"
              >
                Password
              </label>

              <Link
                href="/forgot-password"
                className="text-xs font-medium text-neutral-500 hover:text-neutral-950"
              >
                Forgot password?
              </Link>
            </div>

            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              className="mt-2 h-11 w-full rounded-xl border border-neutral-200 bg-white px-3.5 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 hover:border-neutral-300 focus:border-neutral-400 focus:ring-4 focus:ring-neutral-100"
            />
          </div>

          <Button type="submit" className="h-11 w-full rounded-xl">
            Sign in
          </Button>
        </form>
      </div>
    </AuthShell>
  );
}
