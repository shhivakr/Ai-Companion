// client/src/app/layout.tsx
import type { Metadata } from "next";
import { Toaster } from "sonner";

import AuthProvider from "@/providers/AuthProvider";
import QueryProvider from "@/providers/QueryProvider";

import "./globals.css";
import ThemeProvider from "@/providers/ThemeProvider";

export const metadata: Metadata = {
  title: "SIVRA",
  description: "Your personal AI companion",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <QueryProvider>
            <AuthProvider>
              {children}

              <Toaster position="bottom-right" richColors={false} />
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
