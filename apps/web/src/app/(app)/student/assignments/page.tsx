"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { BackLink } from "@/components/nav/BackLink";
import { PageContent, PageBanner, Card, Badge } from "@/components/ui";
import TeksTag from "@/components/ui/TeksTag";
import EmptyState from "@/components/ui/EmptyState";
import { isPriorityTeks } from "@/lib/curriculumPolicy";
import {
  type AssignmentKind,
  type AssignmentStatus,
  type StudentAssignment,
  MOCK_STUDENT_ASSIGNMENTS,
} from "@/lib/studentAssignments";

// ─── Types ────────────────────────────────────────────────────────────────────

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  AssignmentStatus,
  { label: string; bg: string; text: string; dotColor: string }
> = {
  not_started: { label: "Not Started", bg: "#fef3d6", text: "#b8860b",  dotColor: "#b8860b" },
  in_progress:  { label: "In Progress",  bg: "#fef3d6", text: "#b8860b",  dotColor: "#e05a2a" },
  submitted:    { label: "Submitted",    bg: "#d6ede6", text: "#0d4a2f",  dotColor: "#4a8a6e" },
  graded:       { label: "Graded",       bg: "#ece8f8", text: "#5a3d9a",  dotColor: "#5a3d9a" },
};

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  const now = new Date();
  const diffDays = Math.round(
    (d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
  );
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays === -1) return "Yesterday";
  if (diffDays < 0) return `${Math.abs(diffDays)}d ago`;
  return `In ${diffDays}d`;
}

function progressPercent(a: StudentAssignment): number {
  if (a.totalItems === 0) return 0;
  return Math.round((a.completedItems / a.totalItems) * 100);
}

function scoreColor(score: number): string {
  if (score >= 80) return "#1a7a4e";
  if (score >= 60) return "#b8860b";
  return "#c04a20";
}

function practiceHref(a: StudentAssignment): string {
  const focus = a.teks[0] ?? "";
  return `/practice?focus=${encodeURIComponent(focus)}`;
}

// ─── AssignmentCard component ─────────────────────────────────────────────────

function AssignmentCard({ a }: { a: StudentAssignment }) {
  const cfg = STATUS_CONFIG[a.status];
  const pct = progressPercent(a);
  const nowMs = Date.now();
  const dueMs = a.dueDate ? new Date(a.dueDate).getTime() - nowMs : null;
  const isPastDue =
    dueMs !== null &&
    dueMs < 0 &&
    a.status !== "submitted" &&
    a.status !== "graded";
  const isDueToday =
    dueMs !== null &&
    dueMs >= 0 &&
    dueMs < 24 * 60 * 60 * 1000 &&
    a.status !== "submitted" &&
    a.status !== "graded";

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid rgba(10,60,30,0.10)",
        borderRadius: "12px",
        padding: "16px",
        boxShadow: "0 1px 4px rgba(10,60,30,0.06)",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          {/* Badge row */}
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "6px" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                backgroundColor: a.kind === "assessment" ? "#ece8f8" : "#d6ede6",
                color: a.kind === "assessment" ? "#5a3d9a" : "#0d4a2f",
                fontSize: "10px",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                borderRadius: "20px",
                padding: "3px 8px",
              }}
            >
              {a.kind === "assessment" ? "Assessment" : "Assignment"}
            </span>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                backgroundColor: cfg.bg,
                color: cfg.text,
                fontSize: "10px",
                fontWeight: 600,
                borderRadius: "20px",
                padding: "3px 8px",
              }}
            >
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  backgroundColor: cfg.dotColor,
                  display: "inline-block",
                  flexShrink: 0,
                }}
              />
              {cfg.label}
            </span>
            {isDueToday && (
              <span
                style={{
                  backgroundColor: "#fef3d6",
                  color: "#b8860b",
                  fontSize: "10px",
                  fontWeight: 700,
                  borderRadius: "20px",
                  padding: "3px 8px",
                }}
              >
                ⏰ Due Today
              </span>
            )}
            {isPastDue && (
              <span
                style={{
                  backgroundColor: "#fde8e0",
                  color: "#c04a20",
                  fontSize: "10px",
                  fontWeight: 700,
                  borderRadius: "20px",
                  padding: "3px 8px",
                  border: "1px solid #e05a2a",
                }}
              >
                ⚠ Overdue
              </span>
            )}
          </div>
          {/* Title */}
          <div
            style={{
              marginTop: "8px",
              fontSize: "14px",
              fontWeight: 600,
              color: "#1a2e22",
              lineHeight: 1.4,
            }}
          >
            {a.title}
          </div>
          {/* Subject + points */}
          <div style={{ marginTop: "3px", display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "12px", color: "#5a7a66" }}>{a.subject}</span>
            <span
              style={{
                fontSize: "11px",
                color: "#4a8a6e",
                fontWeight: 600,
                backgroundColor: "#d6ede6",
                borderRadius: "20px",
                padding: "1px 7px",
              }}
            >
              {a.totalItems} pts
            </span>
          </div>
        </div>

        {/* Score */}
        {a.score !== null && (
          <div style={{ flexShrink: 0, textAlign: "right" }}>
            <div
              style={{
                fontSize: "24px",
                fontWeight: 700,
                fontVariantNumeric: "tabular-nums",
                color: scoreColor(a.score),
              }}
            >
              {a.score}%
            </div>
            <div style={{ fontSize: "11px", color: "#5a7a66" }}>Score</div>
          </div>
        )}
      </div>

      {/* TEKS tags */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
        {a.teks.map((t) => (
          <TeksTag key={t} code={t} priority={isPriorityTeks(t)} />
        ))}
      </div>

      {/* Progress bar */}
      {(a.status === "in_progress" || a.status === "submitted") && (
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "10px",
              color: "#5a7a66",
              marginBottom: "4px",
            }}
          >
            <span>{a.completedItems}/{a.totalItems} items</span>
            <span>{pct}%</span>
          </div>
          <div
            style={{
              height: "6px",
              width: "100%",
              borderRadius: "999px",
              backgroundColor: "rgba(10,60,30,0.08)",
            }}
          >
            <div
              style={{
                height: "6px",
                borderRadius: "999px",
                backgroundColor: "#1a7a4e",
                width: `${pct}%`,
                transition: "width 0.3s",
              }}
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", marginTop: "2px" }}>
        <div style={{ fontSize: "12px", color: "#5a7a66" }}>
          {a.status === "graded" || a.status === "submitted"
            ? `Submitted ${formatDate(a.submittedAt)}`
            : a.dueDate
              ? `Due ${formatDate(a.dueDate)}`
              : "No due date"}
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          {(a.status === "graded" || a.status === "submitted") && (
            <Link
              href={practiceHref(a)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                border: "1px solid rgba(10,60,30,0.10)",
                backgroundColor: "#ffffff",
                color: "#5a7a66",
                fontSize: "12px",
                fontWeight: 600,
                borderRadius: "8px",
                padding: "6px 12px",
                textDecoration: "none",
              }}
            >
              Review topics
            </Link>
          )}
          {a.status === "in_progress" && (
            <Link
              href={`/practice?focus=${encodeURIComponent(a.teks[0] ?? "")}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                backgroundColor: "#b8860b",
                color: "#ffffff",
                fontSize: "12px",
                fontWeight: 600,
                borderRadius: "8px",
                padding: "6px 16px",
                textDecoration: "none",
              }}
            >
              Continue →
            </Link>
          )}
          {a.status === "not_started" && (
            <Link
              href={`/practice?focus=${encodeURIComponent(a.teks[0] ?? "")}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                backgroundColor: "#0d4a2f",
                color: "#d6f0e4",
                fontSize: "12px",
                fontWeight: 600,
                borderRadius: "8px",
                padding: "6px 16px",
                textDecoration: "none",
              }}
            >
              Start →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

function StudentAssignmentsPageContent() {
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<"active" | "completed">("active");
  const [dueFilter, setDueFilter] = useState<
    "all" | "due" | "past_due" | "coming_up"
  >("all");
  const kindParam = searchParams.get("kind");
  const kindFilter: "all" | "assignment" | "assessment" =
    kindParam === "assignment" || kindParam === "assessment"
      ? kindParam
      : "all";

  const isActiveStatus = (a: StudentAssignment) =>
    a.status === "not_started" || a.status === "in_progress";
  const dueMs = (a: StudentAssignment) =>
    a.dueDate ? new Date(a.dueDate).getTime() - Date.now() : null;
  const isDueToday = (a: StudentAssignment) => {
    const ms = dueMs(a);
    return (
      isActiveStatus(a) && ms !== null && ms >= 0 && ms < 24 * 60 * 60 * 1000
    );
  };
  const isPastDue = (a: StudentAssignment) => {
    const ms = dueMs(a);
    return isActiveStatus(a) && ms !== null && ms < 0;
  };
  const isComingUp = (a: StudentAssignment) => {
    const ms = dueMs(a);
    return isActiveStatus(a) && ms !== null && ms >= 24 * 60 * 60 * 1000;
  };

  const active = MOCK_STUDENT_ASSIGNMENTS.filter(
    (a) => a.status === "not_started" || a.status === "in_progress",
  );
  const completed = MOCK_STUDENT_ASSIGNMENTS.filter(
    (a) => a.status === "submitted" || a.status === "graded",
  );

  const baseDisplayed = tab === "active" ? active : completed;
  const kindFiltered =
    kindFilter === "all"
      ? baseDisplayed
      : baseDisplayed.filter((a) => a.kind === kindFilter);
  const displayed =
    tab !== "active" || dueFilter === "all"
      ? kindFiltered
      : kindFiltered.filter((a) => {
          if (dueFilter === "due") return isDueToday(a);
          if (dueFilter === "past_due") return isPastDue(a);
          if (dueFilter === "coming_up") return isComingUp(a);
          return true;
        });

  // Counts
  const dueToday = active.filter(isDueToday).length;

  const pastDue = active.filter(isPastDue).length;

  const comingUp = active.filter(isComingUp).length;

  const inProgress = active.filter((a) => a.status === "in_progress").length;
  const avgScore =
    completed.filter((a) => a.score !== null).length > 0
      ? Math.round(
          completed
            .filter((a) => a.score !== null)
            .reduce((s, a) => s + (a.score ?? 0), 0) /
            completed.filter((a) => a.score !== null).length,
        )
      : null;

  const sortedDisplayed = [...displayed].sort((a, b) => {
    const aPast = isPastDue(a) ? -1 : 0;
    const bPast = isPastDue(b) ? -1 : 0;
    return aPast - bPast;
  });

  return (
    <main className="ia-vh-page flex h-dvh flex-col overflow-hidden text-bs-ink" style={{ backgroundColor: "#eef3ee" }}>
      <BackLink href="/student/dashboard" label="Back to dashboard" />
      <PageBanner
        title="My Assignments"
        subtitle="Track your work, due dates, and scores."
      >
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/student/learn"
            style={{ backgroundColor: "#0d4a2f", color: "#d6f0e4", borderRadius: "16px", padding: "12px 20px", fontSize: "14px", fontWeight: 600, textDecoration: "none", boxShadow: "0 1px 3px rgba(0,0,0,0.12)" }}
          >
            Learning Hub
          </Link>
          <Link
            href="/student/profile"
            style={{ backgroundColor: "#0d4a2f", color: "#d6f0e4", borderRadius: "16px", padding: "12px 20px", fontSize: "14px", fontWeight: 600, textDecoration: "none", boxShadow: "0 1px 3px rgba(0,0,0,0.12)" }}
          >
            My Profile
          </Link>
        </div>
      </PageBanner>

      <PageContent className="flex-1 min-h-0 py-3">
        <div className="ia-vh-scroll h-full min-h-0 overflow-y-auto pr-1">
          {/* Stat row */}
          <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Active",     value: active.length, color: "#1a2e22" },
              { label: "Due Today",  value: dueToday,      color: dueToday > 0 ? "#b8860b" : "#1a2e22" },
              { label: "Past Due",   value: pastDue,       color: pastDue > 0  ? "#c04a20" : "#1a2e22" },
              { label: "Coming Up",  value: comingUp,      color: "#1a7a4e" },
            ].map((s) => (
              <div
                key={s.label}
                style={{ backgroundColor: "#ffffff", border: "1px solid rgba(10,60,30,0.10)", borderRadius: "12px", padding: "16px", textAlign: "center", boxShadow: "0 1px 3px rgba(10,60,30,0.06)" }}
              >
                <div style={{ fontSize: "24px", fontWeight: 700, fontVariantNumeric: "tabular-nums", color: s.color }}>{s.value}</div>
                <div style={{ marginTop: "4px", fontSize: "12px", color: "#5a7a66" }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="mb-4 flex items-center gap-2">
            {(["active", "completed"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                style={{
                  borderRadius: "999px",
                  border: "1px solid rgba(10,60,30,0.10)",
                  padding: "8px 16px",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "background 0.15s",
                  backgroundColor: tab === t ? "#0d4a2f" : "#ffffff",
                  color: tab === t ? "#d6f0e4" : "#5a7a66",
                }}
              >
                {t === "active"
                  ? `Active (${active.length})`
                  : `Completed (${completed.length})`}
              </button>
            ))}
          </div>

          <div className="mb-4 flex flex-wrap items-center gap-2">
            {(["all", "assignment", "assessment"] as const).map((k) => {
              const label = k === "all" ? "All types" : k === "assignment" ? "Assignments" : "Quizzes";
              const href = k === "all" ? "/student/assignments" : `/student/assignments?kind=${k}`;
              const isActive = kindFilter === k;
              return (
                <Link
                  key={k}
                  href={href}
                  style={{
                    borderRadius: "999px",
                    border: "1px solid rgba(10,60,30,0.10)",
                    padding: "6px 12px",
                    fontSize: "12px",
                    fontWeight: 600,
                    textDecoration: "none",
                    transition: "background 0.15s",
                    backgroundColor: isActive ? "#0d4a2f" : "#ffffff",
                    color: isActive ? "#d6f0e4" : "#5a7a66",
                  }}
                >
                  {label}
                </Link>
              );
            })}
          </div>

          {tab === "active" ? (
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {([
                { key: "all",      label: "All active" },
                { key: "due",      label: `Due today (${dueToday})` },
                { key: "past_due", label: `Past due (${pastDue})` },
                { key: "coming_up",label: `Coming up (${comingUp})` },
              ] as const).map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setDueFilter(key as typeof dueFilter)}
                  style={{
                    borderRadius: "999px",
                    border: "1px solid rgba(10,60,30,0.10)",
                    padding: "6px 12px",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "background 0.15s",
                    backgroundColor: dueFilter === key ? "#0d4a2f" : "#ffffff",
                    color: dueFilter === key ? "#d6f0e4" : "#5a7a66",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          ) : null}

          {/* Assignment list */}
          {sortedDisplayed.length === 0 ? (
            <EmptyState
              icon="📚"
              title="No assignments yet"
              subtitle="Your teacher hasn't assigned anything yet. Check back soon!"
            />
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {sortedDisplayed.map((a) => (
                <AssignmentCard key={a.id} a={a} />
              ))}
            </div>
          )}

          {/* Quick practice CTA */}
          <div style={{ marginTop: "20px", backgroundColor: "#d6ede6", border: "1px solid rgba(10,60,30,0.10)", borderRadius: "12px", padding: "16px" }}>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div style={{ fontSize: "14px", fontWeight: 600, color: "#0d4a2f" }}>
                  Need to review? Jump into the Learning Hub
                </div>
                <div style={{ marginTop: "4px", fontSize: "12px", color: "#4a8a6e" }}>
                  Personalized spaced-repetition review sessions based on your proficiency level.
                </div>
              </div>
              <Link
                href="/student/learn"
                style={{ backgroundColor: "#0d4a2f", color: "#d6f0e4", borderRadius: "12px", padding: "10px 20px", fontSize: "14px", fontWeight: 600, textDecoration: "none" }}
              >
                Open Learning Hub →
              </Link>
            </div>
          </div>
        </div>
      </PageContent>
    </main>
  );
}

export default function StudentAssignmentsPage() {
  return (
    <Suspense
      fallback={
        <main className="p-6 text-bs-ink">Loading assignments...</main>
      }
    >
      <StudentAssignmentsPageContent />
    </Suspense>
  );
}
