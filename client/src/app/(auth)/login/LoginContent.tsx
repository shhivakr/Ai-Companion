"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import AuthShell from "@/components/auth/AuthShell";
import GoogleButton from "@/components/auth/GoogleButton";
import Button from "@/components/ui/Button";
import { useAuth } from "@/providers/AuthProvider";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const redirectTo = searchParams.get("redirect") || "/";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim() || !password) {
      toast.error("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      await login(email.trim(), password);

      toast.success("Welcome back.");

      router.replace(redirectTo);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to sign in.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  function handleGoogleLogin() {
    toast.info("Google sign-in will be available soon.");
  }

  return (
    <AuthShell
      title="Welcome back"
      description="Sign in to continue with your SIVRA."
      footer={
        <p className="text-sm text-foreground-secondary">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-foreground hover:underline"
          >
            Create one
          </Link>
        </p>
      }
    >
      <div className="space-y-5">
        <GoogleButton onClick={handleGoogleLogin} />

        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />

          <span className="text-xs text-foreground-muted">
            or continue with email
          </span>

          <div className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
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
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              disabled={loading}
              className="mt-2 h-11 w-full rounded-xl border border-border bg-surface-elevated px-3.5 text-sm text-foreground outline-none transition placeholder:text-foreground-muted hover:border-foreground-muted focus:border-foreground-muted focus:ring-1 focus:ring-foreground-muted disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="text-sm font-medium text-foreground"
              >
                Password
              </label>

              <Link
                href="/forgot-password"
                className="text-xs font-medium text-foreground-secondary hover:text-foreground"
              >
                Forgot password?
              </Link>
            </div>

            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              disabled={loading}
              className="mt-2 h-11 w-full rounded-xl border border-border bg-surface-elevated px-3.5 text-sm text-foreground outline-none transition placeholder:text-foreground-muted hover:border-foreground-muted focus:border-foreground-muted focus:ring-1 focus:ring-foreground-muted disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="h-11 w-full rounded-xl"
          >
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </div>
    </AuthShell>
  );
}
