"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BackLink } from "@/components/nav/BackLink";
import {
  defaultAssignmentPublishMeta,
  loadAssignmentPublishingState,
  saveAssignmentPublishingState,
  type AssignmentPublishMeta,
  type ClassPeriod,
} from "@/lib/assignmentPublishing";

const C = {
  ink:    "#0a1a14",
  muted:  "#8aada0",
  surface:"#ffffff",
  tealDeep:"#003d2e",
  border: "rgba(0,0,0,0.07)",
  pageBg: "#f0f4f2",
} as const;

type Assignment = {
  id: string;
  title?: string;
  createdAt?: string;
  updatedAt?: string;
};

const CLASS_PERIODS: ClassPeriod[] = ["P1", "P2", "P3", "P4"];

export default function TeacherAssessmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [publishState, setPublishState] = useState<
    Record<string, AssignmentPublishMeta>
  >({});
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    setPublishState(loadAssignmentPublishingState());
  }, []);

  function getMeta(assignment: Assignment): AssignmentPublishMeta {
    return (
      publishState[assignment.id] ?? defaultAssignmentPublishMeta(assignment.id)
    );
  }

  function updateMeta(
    assignment: Assignment,
    patch: Partial<AssignmentPublishMeta>,
  ) {
    setPublishState((prev) => {
      const current =
        prev[assignment.id] ?? defaultAssignmentPublishMeta(assignment.id);
      const next = {
        ...prev,
        [assignment.id]: {
          ...current,
          ...patch,
          assignmentId: assignment.id,
        },
      };
      saveAssignmentPublishingState(next);
      return next;
    });
  }

  function togglePeriod(assignment: Assignment, period: ClassPeriod) {
    const meta = getMeta(assignment);
    const has = meta.classPeriods.includes(period);
    const classPeriods = has
      ? meta.classPeriods.filter((value) => value !== period)
      : [...meta.classPeriods, period];

    updateMeta(assignment, { classPeriods });
  }

  function togglePublish(assignment: Assignment) {
    const meta = getMeta(assignment);
    if (meta.published) {
      updateMeta(assignment, { published: false, publishedAt: null });
      return;
    }

    if (!meta.dueDate || meta.classPeriods.length === 0) {
      setExpandedId(assignment.id);
      return;
    }

    updateMeta(assignment, {
      published: true,
      publishedAt: new Date().toISOString(),
    });
  }

  useEffect(() => {
    setLoading(true);
    fetch(`/api/assignments`)
      .then((r) => r.json())
      .then((d) => {
        // Expecting an array or { items: [] }
        if (Array.isArray(d)) setAssignments(d);
        else if (d?.items) setAssignments(d.items);
        else setAssignments([]);
      })
      .catch((e) => {
        console.error(e);
        setAssignments([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: C.pageBg, fontFamily: "var(--font-dm-sans), sans-serif" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px 60px" }}>
        <BackLink href="/teacher/dashboard" label="Back to dashboard" />

        <div style={{ background: C.tealDeep, borderRadius: 16, padding: "28px 30px 24px", marginBottom: 24, marginTop: 12 }}>
          <h1 style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: 28, fontWeight: 800, fontStyle: "italic", color: "white", marginBottom: 4 }}>
            Assessments ✦
          </h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
            A list of your assignments will appear here.
          </p>
        </div>

        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20 }}>
          {loading ? (
            <div style={{ color: C.muted, fontSize: 14 }}>Loading…</div>
          ) : assignments && assignments.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {assignments.map((a) => (
                <div key={a.id} style={{ border: `1px solid ${C.border}`, borderRadius: 12, padding: 12 }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                    <div>
                      <div style={{ fontWeight: 500, color: C.ink, fontSize: 14 }}>{a.title || a.id}</div>
                      <div style={{ marginTop: 4, display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, fontSize: 11 }}>
                        <span style={{ color: C.muted }}>
                          {a.updatedAt
                            ? new Date(a.updatedAt).toLocaleString()
                            : a.createdAt
                              ? new Date(a.createdAt).toLocaleDateString()
                              : ""}
                        </span>
                        {getMeta(a).published ? (
                          <span style={{ borderRadius: 999, border: "1px solid #bbf7d0", background: "#f0fdf4", padding: "2px 8px", fontWeight: 600, color: "#166534" }}>
                            Published
                          </span>
                        ) : (
                          <span style={{ borderRadius: 999, border: "1px solid #fde68a", background: "#fffbeb", padding: "2px 8px", fontWeight: 600, color: "#92400e" }}>
                            Draft
                          </span>
                        )}
                        {getMeta(a).dueDate ? (
                          <span style={{ borderRadius: 999, border: `1px solid ${C.border}`, background: C.pageBg, padding: "2px 8px", fontWeight: 600, color: C.muted }}>
                            Due{" "}
                            {new Date(
                              getMeta(a).dueDate as string,
                            ).toLocaleDateString()}
                          </span>
                        ) : null}
                        {getMeta(a).classPeriods.length ? (
                          <span style={{ borderRadius: 999, border: "1px solid #bfdbfe", background: "#eff6ff", padding: "2px 8px", fontWeight: 600, color: "#1e40af" }}>
                            {getMeta(a).classPeriods.join(", ")}
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "flex-end", gap: 8 }}>
                      <button
                        type="button"
                        onClick={() => togglePublish(a)}
                        style={{
                          borderRadius: 8, padding: "6px 12px", fontSize: 11, fontWeight: 600, cursor: "pointer",
                          ...(getMeta(a).published
                            ? { border: "1px solid #fecaca", background: "#fef2f2", color: "#b91c1c" }
                            : { border: "1px solid #bbf7d0", background: "#f0fdf4", color: "#166534" })
                        }}
                      >
                        {getMeta(a).published ? "Unpublish" : "Publish"}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setExpandedId((prev) => (prev === a.id ? null : a.id))
                        }
                        style={{ border: `1px solid ${C.border}`, background: C.surface, borderRadius: 8, padding: "6px 12px", fontSize: 11, fontWeight: 600, color: C.muted, cursor: "pointer" }}
                      >
                        Publishing Settings
                      </button>

                      <Link
                        href={`/teacher/assignments/${encodeURIComponent(a.id)}/summary`}
                        style={{ border: `1px solid ${C.border}`, background: C.surface, borderRadius: 8, padding: "6px 12px", fontSize: 11, fontWeight: 600, color: C.ink, textDecoration: "none" }}
                      >
                        Summary
                      </Link>
                    </div>
                  </div>

                  {expandedId === a.id ? (
                    <div style={{ marginTop: 12, border: `1px solid ${C.border}`, background: C.pageBg, borderRadius: 10, padding: 12 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: C.muted }}>
                        Publish Assignment
                      </div>

                      <label style={{ display: "block", marginTop: 8, fontSize: 11, fontWeight: 600, color: C.muted }}>
                        Due Date
                        <input
                          type="date"
                          value={getMeta(a).dueDate ?? ""}
                          onChange={(event) =>
                            updateMeta(a, {
                              dueDate: event.target.value || null,
                            })
                          }
                          style={{ display: "block", marginTop: 4, width: "100%", border: `1px solid ${C.border}`, background: C.surface, borderRadius: 8, padding: "8px 12px", fontSize: 13 }}
                        />
                      </label>

                      <div style={{ marginTop: 12 }}>
                        <div style={{ fontSize: 11, fontWeight: 600, color: C.muted }}>
                          Class Filters
                        </div>
                        <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 8 }}>
                          {CLASS_PERIODS.map((period) => {
                            const selected =
                              getMeta(a).classPeriods.includes(period);
                            return (
                              <button
                                key={`${a.id}-${period}`}
                                type="button"
                                onClick={() => togglePeriod(a, period)}
                                style={{
                                  borderRadius: 999, fontSize: 11, fontWeight: 600, padding: "4px 12px", cursor: "pointer",
                                  ...(selected
                                    ? { border: "1px solid #93c5fd", background: "#dbeafe", color: "#1e40af" }
                                    : { border: `1px solid ${C.border}`, background: C.surface, color: C.muted })
                                }}
                              >
                                {period}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {!getMeta(a).dueDate ||
                      getMeta(a).classPeriods.length === 0 ? (
                        <div style={{ marginTop: 12, border: "1px solid #fde68a", background: "#fffbeb", borderRadius: 8, padding: "8px 12px", fontSize: 11, color: "#92400e" }}>
                          Set a due date and select at least one class period
                          before publishing.
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          ) : (
            <div>
              <div style={{ color: C.muted, fontSize: 14 }}>No assessments found.</div>
              <div style={{ marginTop: 16 }}>
                <Link
                  href="/teacher/builder"
                  style={{ background: "#006e55", color: "white", borderRadius: 10, padding: "10px 18px", fontSize: 13, fontWeight: 600, textDecoration: "none" }}
                >
                  Create an assessment
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
