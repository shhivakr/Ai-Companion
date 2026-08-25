import { Toaster } from "sonner";

import AppShell from "@/components/layout/AppShell";
import AuthGuard from "@/components/auth/AuthGuard";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <AppShell>
        {children}

        <Toaster position="bottom-right" richColors={false} />
      </AppShell>
    </AuthGuard>
  );
}
