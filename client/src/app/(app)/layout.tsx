import { Toaster } from "sonner";
import AppShell from "@/components/layout/AppShell";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell>
      {children}

      <Toaster position="bottom-right" richColors={false} />
    </AppShell>
  );
}
