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
        <GoogleButton onClick={handleGoogleRegister} />

        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-neutral-100" />

          <span className="text-xs text-neutral-400">
            or continue with email
          </span>

          <div className="h-px flex-1 bg-neutral-100" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
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
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your name"
              disabled={loading}
              className="mt-2 h-11 w-full rounded-xl border border-neutral-200 bg-white px-3.5 text-sm outline-none transition placeholder:text-neutral-400 hover:border-neutral-300 focus:border-neutral-400 focus:ring-4 focus:ring-neutral-100 disabled:cursor-not-allowed disabled:bg-neutral-50"
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
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              disabled={loading}
              className="mt-2 h-11 w-full rounded-xl border border-neutral-200 bg-white px-3.5 text-sm outline-none transition placeholder:text-neutral-400 hover:border-neutral-300 focus:border-neutral-400 focus:ring-4 focus:ring-neutral-100 disabled:cursor-not-allowed disabled:bg-neutral-50"
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
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="At least 8 characters"
              disabled={loading}
              className="mt-2 h-11 w-full rounded-xl border border-neutral-200 bg-white px-3.5 text-sm outline-none transition placeholder:text-neutral-400 hover:border-neutral-300 focus:border-neutral-400 focus:ring-4 focus:ring-neutral-100 disabled:cursor-not-allowed disabled:bg-neutral-50"
            />

            <p className="mt-2 text-xs text-neutral-400">
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
