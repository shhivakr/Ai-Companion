"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import AuthShell from "@/components/auth/AuthShell";
import GoogleButton from "@/components/auth/GoogleButton";
import Button from "@/components/ui/Button";
import { useAuth } from "@/providers/AuthProvider";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim() || !email.trim() || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    try {
      setLoading(true);

      await register(name.trim(), email.trim(), password);

      toast.success("Account created successfully. Please sign in.");

      router.replace("/login");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to create your account.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  function handleGoogleRegister() {
    toast.info("Google sign-up will be available soon.");
  }

  return (
    <AuthShell
      title="Create your account"
      description="Start building a better way to plan, reflect and move forward."
      footer={
        <p className="text-sm text-foreground-secondary">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-foreground hover:underline"
          >
            Sign in
          </Link>
        </p>
      }
    >
      <div className="space-y-5">
        <GoogleButton onClick={handleGoogleRegister} />

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
              htmlFor="name"
              className="text-sm font-medium text-foreground"
            >
              Name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your name"
              disabled={loading}
              className="mt-2 h-11 w-full rounded-xl border border-border bg-surface-elevated px-3.5 text-sm text-foreground outline-none transition placeholder:text-foreground-muted hover:border-foreground-muted focus:border-foreground-muted focus:ring-1 focus:ring-foreground-muted disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

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
            <label
              htmlFor="password"
              className="text-sm font-medium text-foreground"
            >
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="At least 8 characters"
              disabled={loading}
              className="mt-2 h-11 w-full rounded-xl border border-border bg-surface-elevated px-3.5 text-sm text-foreground outline-none transition placeholder:text-foreground-muted hover:border-foreground-muted focus:border-foreground-muted focus:ring-1 focus:ring-foreground-muted disabled:cursor-not-allowed disabled:opacity-60"
            />

            <p className="mt-2 text-xs text-foreground-muted">
              Use at least 8 characters.
            </p>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="h-11 w-full rounded-xl"
          >
            {loading ? "Creating account..." : "Create account"}
          </Button>
        </form>
      </div>
    </AuthShell>
  );
}
