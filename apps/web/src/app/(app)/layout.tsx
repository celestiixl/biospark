import type { ReactNode } from "react";
import { ActiveShell } from "@/components/ia/ActiveShell";
import { HomeButton } from "@/components/nav/HomeButton";

export default function AppGroupLayout({ children }: { children: ReactNode }) {
  return (
    <ActiveShell>
      <HomeButton />
      {children}
    </ActiveShell>
  );
}
