"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import SettingsSection from "@/components/settings/SettingsSection";
import SettingsRow from "@/components/settings/SettingsRow";
import { useAuth } from "@/providers/AuthProvider";

export default function SettingsPage() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const [companionInsights, setCompanionInsights] = useState(true);
  const [memoryEnabled, setMemoryEnabled] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    try {
      setLoggingOut(true);

      await logout();

      toast.success("You have been signed out.");

      router.replace("/login");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to sign out.";

      toast.error(message);
    } finally {
      setLoggingOut(false);
    }
  }

  const userName = user?.name || "User";
  const userEmail = user?.email || "";

  return (
    <div className="space-y-8 py-6">
      {/* Header */}

      <section>
        <p className="text-sm text-neutral-500">Preferences</p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Settings
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500">
          Manage your account and how SIVRA works for you.
        </p>
      </section>

      {/* Profile */}

      <SettingsSection
        title="Profile"
        description="Basic information about your account."
      >
        <SettingsRow
          title="Profile"
          description="Your name and profile information."
        >
          <div className="flex items-center gap-3">
            <Avatar name={userName} size="md" />

            <div>
              <p className="text-sm font-medium">{userName}</p>

              <p className="text-xs text-neutral-500">{userEmail}</p>
            </div>
          </div>
        </SettingsRow>

        <SettingsRow
          title="Edit profile"
          description="Update your name and profile information."
        >
          <Button variant="secondary">Edit</Button>
        </SettingsRow>
      </SettingsSection>

      {/* Companion */}

      <SettingsSection
        title="Companion"
        description="Control how SIVRA interacts with you."
      >
        <SettingsRow
          title="Companion insights"
          description="Allow SIVRA to surface patterns and useful observations."
        >
          <button
            type="button"
            onClick={() => setCompanionInsights((value) => !value)}
            className={[
              "relative h-6 w-11 rounded-full transition-colors",
              companionInsights ? "bg-neutral-950" : "bg-neutral-200",
            ].join(" ")}
            aria-label="Toggle Companion insights"
          >
            <span
              className={[
                "absolute top-1 h-4 w-4 rounded-full bg-white transition-transform",
                companionInsights ? "left-6" : "left-1",
              ].join(" ")}
            />
          </button>
        </SettingsRow>

        <SettingsRow
          title="Default interaction style"
          description="Choose how SIVRA should generally respond."
        >
          <select
            defaultValue="balanced"
            className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none"
          >
            <option value="balanced">Balanced</option>
            <option value="concise">Concise</option>
            <option value="detailed">Detailed</option>
          </select>
        </SettingsRow>
      </SettingsSection>

      {/* Memory */}

      <SettingsSection
        title="Memory"
        description="Control what SIVRA can remember."
      >
        <SettingsRow
          title="Memory"
          description="Allow SIVRA to retain useful context across conversations."
        >
          <button
            type="button"
            onClick={() => setMemoryEnabled((value) => !value)}
            className={[
              "relative h-6 w-11 rounded-full transition-colors",
              memoryEnabled ? "bg-neutral-950" : "bg-neutral-200",
            ].join(" ")}
            aria-label="Toggle memory"
          >
            <span
              className={[
                "absolute top-1 h-4 w-4 rounded-full bg-white transition-transform",
                memoryEnabled ? "left-6" : "left-1",
              ].join(" ")}
            />
          </button>
        </SettingsRow>

        <SettingsRow
          title="Manage memories"
          description="Review, edit or remove saved memories."
        >
          <Button variant="secondary">Manage</Button>
        </SettingsRow>
      </SettingsSection>

      {/* Notifications */}

      <SettingsSection
        title="Notifications"
        description="Choose which updates you want to receive."
      >
        <SettingsRow
          title="Notifications"
          description="Receive reminders and useful SIVRA updates."
        >
          <button
            type="button"
            onClick={() => setNotifications((value) => !value)}
            className={[
              "relative h-6 w-11 rounded-full transition-colors",
              notifications ? "bg-neutral-950" : "bg-neutral-200",
            ].join(" ")}
            aria-label="Toggle notifications"
          >
            <span
              className={[
                "absolute top-1 h-4 w-4 rounded-full bg-white transition-transform",
                notifications ? "left-6" : "left-1",
              ].join(" ")}
            />
          </button>
        </SettingsRow>

        <SettingsRow
          title="Notification preferences"
          description="Choose the types of notifications you receive."
        >
          <Button variant="secondary">Manage</Button>
        </SettingsRow>
      </SettingsSection>

      {/* Appearance */}

      <SettingsSection
        title="Appearance"
        description="Customize how the application looks."
      >
        <SettingsRow
          title="Theme"
          description="Choose how the application should appear."
        >
          <select
            defaultValue="system"
            className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none"
          >
            <option value="system">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </SettingsRow>
      </SettingsSection>

      {/* Account */}

      <SettingsSection title="Account" description="Manage your account.">
        <SettingsRow title="Sign out" description="Sign out from this device.">
          <Button
            variant="secondary"
            onClick={handleLogout}
            disabled={loggingOut}
          >
            {loggingOut ? "Signing out..." : "Sign out"}
          </Button>
        </SettingsRow>

        <SettingsRow
          title="Delete account"
          description="Permanently remove your account and associated data."
        >
          <Button variant="ghost" className="text-red-600 hover:bg-red-50">
            Delete account
          </Button>
        </SettingsRow>
      </SettingsSection>

      {/* Save */}

      <Card className="flex flex-col justify-between gap-4 bg-neutral-100 p-5 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium">Settings are currently local</p>

          <p className="mt-1 text-xs text-neutral-500">
            These controls will be connected to your account after the UI
            implementation is complete.
          </p>
        </div>

        <Button>Save changes</Button>
      </Card>
    </div>
  );
}
