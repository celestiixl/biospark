"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTeacherAuth } from "@/lib/teacherAuth";

const IS_DEV_BYPASS = process.env.NEXT_PUBLIC_DEV_BYPASS === "true";

/**
 * Guards all /teacher/* routes.
 * Redirects to /teacher/login when no teacher session exists.
 * When NEXT_PUBLIC_DEV_BYPASS=true the guard is skipped so devBypass.ts
 * can seed the store without a redirect race.
 */
export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { teacher } = useTeacherAuth();
  const router = useRouter();

  useEffect(() => {
    if (!IS_DEV_BYPASS && !teacher) {
      router.replace("/teacher/login");
    }
  }, [teacher, router]);

  // Render nothing until the client store has hydrated to avoid authenticated-content flash.
  // Skip this gate entirely when the dev bypass is active.
  if (!IS_DEV_BYPASS && !teacher) return null;

  return <>{children}</>;
}
