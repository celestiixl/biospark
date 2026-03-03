import "./globals.css";
import type { ReactNode } from "react";
import PageShell from "@/components/ui/PageShell";
import ThemeRegistry from "@/lib/ThemeRegistry";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-dvh text-slate-900 antialiased">
        <ThemeRegistry>
          <PageShell>{children}</PageShell>
        </ThemeRegistry>
      </body>
    </html>
  );
}
