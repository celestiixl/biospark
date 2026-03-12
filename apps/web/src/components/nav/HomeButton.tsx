"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home } from "lucide-react";
import { useTeacherAuth } from "@/lib/teacherAuth";
import type { UserRole } from "@/types/navigation";

const DASHBOARD_PATHS = ["/student/dashboard", "/teacher/dashboard"];

export function HomeButton() {
  const pathname = usePathname();
  const { teacher } = useTeacherAuth();

  // Determine role: teacher if logged in, student otherwise
  const [role, setRole] = useState<UserRole | null>(null);

  useEffect(() => {
    setRole(teacher ? "teacher" : "student");
  }, [teacher]);

  // Do not render on dashboard pages
  if (DASHBOARD_PATHS.some((p) => pathname === p)) return null;

  const href =
    role === "teacher"
      ? "/teacher/dashboard"
      : role === "student"
        ? "/student/dashboard"
        : "/";

  return (
    <Link
      href={href}
      title="Home"
      aria-label="Home"
      className="fixed left-4 top-4 z-50 rounded-lg p-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00d4aa]"
      style={{
        background: "#132638",
        border: "1px solid rgba(0,212,170,0.2)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.background = "#1a3148";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.background = "#132638";
      }}
    >
      <Home size={18} color="#9abcb0" aria-hidden="true" />
    </Link>
  );
}
