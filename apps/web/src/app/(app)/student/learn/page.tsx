"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { LEARNING_UNITS } from "@/lib/learningHubContent";
import {
  getMostRecentLessonId,
  loadLearningProgress,
  type LearningProgressMap,
} from "@/lib/learningProgress";
import { loadLearningSettings } from "@/lib/learningSettings";
import {
  buildInterventionQueue,
  buildTeksHeatmap,
  isLessonUnlocked,
} from "@/lib/learningInsights";
import { isPriorityTeks, MASTERY_THRESHOLD } from "@/lib/curriculumPolicy";
import TeksTag from "@/components/ui/TeksTag";

export default function StudentLearningHubPage() {  const [gradingPeriodFilter, setGradingPeriodFilter] = useState<
    0 | 1 | 2 | 3 | 4
  >(0);
  const [progress, setProgress] = useState<LearningProgressMap>({});
  const [visibleUnitIds, setVisibleUnitIds] = useState<string[]>(
    LEARNING_UNITS.map((u) => u.id),
  );

  useEffect(() => {
    setProgress(loadLearningProgress());
    setVisibleUnitIds(
      loadLearningSettings(LEARNING_UNITS.map((unit) => unit.id))
        .visibleUnitIds,
    );
  }, []);

  const allVisibleUnits = useMemo(
    () => LEARNING_UNITS.filter((unit) => visibleUnitIds.includes(unit.id)),
    [visibleUnitIds],
  );

  const filteredUnits = useMemo(
    () =>
      allVisibleUnits.filter((unit) =>
        gradingPeriodFilter === 0
          ? true
          : unit.gradingPeriod === gradingPeriodFilter,
      ),
    [allVisibleUnits, gradingPeriodFilter],
  );

  const totalLessons = useMemo(
    () => allVisibleUnits.reduce((acc, unit) => acc + unit.lessons.length, 0),
    [allVisibleUnits],
  );

  const completedLessons = useMemo(
    () =>
      allVisibleUnits.reduce(
        (acc, unit) =>
          acc +
          unit.lessons.filter((lesson) =>
            Boolean(progress[lesson.id]?.completed),
          ).length,
        0,
      ),
    [allVisibleUnits, progress],
  );

  const recentLessonId = useMemo(
    () => getMostRecentLessonId(progress),
    [progress],
  );

  const continueLesson = useMemo(() => {
    if (!recentLessonId) return null;
    for (const unit of allVisibleUnits) {
      const lesson = unit.lessons.find((entry) => entry.id === recentLessonId);
      if (lesson) {
        return {
          unit,
          lesson,
        };
      }
    }
    return null;
  }, [allVisibleUnits, recentLessonId]);

  const weakestTeks = useMemo(
    () =>
      buildTeksHeatmap(progress)
        .sort(
          (a, b) =>
            a.avgCheck - b.avgCheck || a.completionPct - b.completionPct,
        )
        .slice(0, 3),
    [progress],
  );

  const interventions = useMemo(
    () => buildInterventionQueue(progress),
    [progress],
  );

  const unitsByGP = useMemo(() => {
    const groups = new Map<number, typeof filteredUnits>();
    for (const unit of filteredUnits) {
      if (!groups.has(unit.gradingPeriod)) groups.set(unit.gradingPeriod, []);
      groups.get(unit.gradingPeriod)!.push(unit);
    }
    return Array.from(groups.entries()).sort((a, b) => a[0] - b[0]);
  }, [filteredUnits]);

  const inProgressUnitId = useMemo(
    () => continueLesson?.unit.id ?? null,
    [continueLesson],
  );

  return (
    <main
      style={{
        background: "#eef3ee",
        minHeight: "100dvh",
        padding: "12px 16px",
        color: "#1a2e22",
      }}
    >
      <div
        style={{
          maxWidth: 1152,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {/* ── Page header ── */}
        <section
          style={{
            background: "#ffffff",
            border: "1px solid rgba(10,60,30,0.10)",
            borderRadius: 12,
            padding: 20,
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 16,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "#1a7a4e",
                }}
              >
                Learning Hub
              </div>
              <h1
                style={{
                  marginTop: 4,
                  fontSize: 22,
                  fontWeight: 700,
                  fontStyle: "italic",
                  fontFamily: "Fraunces, Lora, Georgia, serif",
                  color: "#1a2e22",
                }}
              >
                Curriculum Roadmap
              </h1>
              <p style={{ marginTop: 6, fontSize: 13, color: "#5a7a66" }}>
                Readings, lectures, and notes with mastery pathing and
                assignment-linked pacing.
              </p>
              <div
                style={{
                  marginTop: 10,
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 6,
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#5a7a66",
                    background: "#ffffff",
                    border: "1px solid rgba(10,60,30,0.10)",
                    borderRadius: 999,
                    padding: "3px 10px",
                  }}
                >
                  {allVisibleUnits.length} Units
                </span>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#5a7a66",
                    background: "#ffffff",
                    border: "1px solid rgba(10,60,30,0.10)",
                    borderRadius: 999,
                    padding: "3px 10px",
                  }}
                >
                  {completedLessons}/{totalLessons} Lessons Complete
                </span>
                {interventions.length > 0 && (
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: "#c04a20",
                      background: "#fde8e0",
                      borderRadius: 999,
                      padding: "3px 10px",
                    }}
                  >
                    {interventions.length} Intervention
                    {interventions.length !== 1 ? "s" : ""}
                  </span>
                )}
              </div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {(
                [
                  {
                    href: "/student/learn/standards",
                    label: "Standards Heatmap",
                  },
                  {
                    href: "/student/learn/interventions",
                    label: "Interventions",
                  },
                  { href: "/student/guardian", label: "Guardian Snapshot" },
                ] as const
              ).map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#1a2e22",
                    background: "#ffffff",
                    border: "1px solid rgba(10,60,30,0.10)",
                    borderRadius: 8,
                    padding: "7px 14px",
                    textDecoration: "none",
                  }}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Continue banner ── */}
        {continueLesson ? (
          <section
            style={{
              background: "#d6ede6",
              border: "1px solid rgba(13,74,47,0.15)",
              borderRadius: 12,
              padding: 16,
            }}
          >
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: "#0d4a2f",
                  }}
                >
                  Continue where you left off
                </div>
                <div
                  style={{
                    marginTop: 4,
                    fontSize: 14,
                    fontWeight: 600,
                    fontStyle: "italic",
                    fontFamily: "Fraunces, Lora, Georgia, serif",
                    color: "#0d4a2f",
                  }}
                >
                  Unit {continueLesson.unit.unitNumber}:{" "}
                  {continueLesson.lesson.title}
                </div>
                <div
                  style={{ fontSize: 12, color: "#4a8a6e", marginTop: 2 }}
                >
                  {progress[continueLesson.lesson.id]?.percent ?? 0}% through
                  this lesson
                </div>
              </div>
              <Link
                href={`/student/learn/${continueLesson.unit.id}/${continueLesson.lesson.slug}`}
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#ffffff",
                  background: "#1a7a4e",
                  borderRadius: 8,
                  padding: "9px 18px",
                  textDecoration: "none",
                }}
              >
                Resume Lesson →
              </Link>
            </div>
          </section>
        ) : null}

        {/* ── Grading period filter ── */}
        <section
          style={{
            background: "#ffffff",
            border: "1px solid rgba(10,60,30,0.10)",
            borderRadius: 12,
            padding: "10px 16px",
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {([0, 1, 2, 3, 4] as const).map((gp) => (
              <button
                key={gp}
                type="button"
                onClick={() => setGradingPeriodFilter(gp)}
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  borderRadius: 999,
                  padding: "5px 14px",
                  border:
                    gradingPeriodFilter === gp
                      ? "none"
                      : "1px solid rgba(10,60,30,0.10)",
                  background:
                    gradingPeriodFilter === gp ? "#1a7a4e" : "#ffffff",
                  color: gradingPeriodFilter === gp ? "#ffffff" : "#5a7a66",
                  cursor: "pointer",
                }}
              >
                {gp === 0 ? "All Periods" : `Grading Period ${gp}`}
              </button>
            ))}
          </div>
        </section>

        {/* ── Main content grid ── */}
        <div className="grid gap-3 lg:grid-cols-[1.5fr_1fr]">
          {/* Unit Roadmap */}
          <section
            style={{
              background: "#ffffff",
              border: "1px solid rgba(10,60,30,0.10)",
              borderRadius: 12,
              padding: 20,
            }}
          >
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "#1a2e22",
                marginBottom: 16,
              }}
            >
              Unit Roadmap
            </div>

            {unitsByGP.map(([gp, units]) => (
              <div key={gp} style={{ marginBottom: 24 }}>
                {/* Grading period section header */}
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: "#1a7a4e",
                    borderBottom: "1px solid rgba(10,60,30,0.10)",
                    paddingBottom: 6,
                    marginBottom: 10,
                  }}
                >
                  Grading Period {gp}
                </div>

                <div
                  style={{ display: "flex", flexDirection: "column", gap: 10 }}
                >
                  {units.map((unit) => {
                    const unitCompleted = unit.lessons.filter(
                      (l) => progress[l.id]?.completed,
                    ).length;
                    const unitPct = Math.round(
                      (unitCompleted / unit.lessons.length) * 100,
                    );
                    const isActive = unit.id === inProgressUnitId;

                    return (
                      <article
                        key={unit.id}
                        style={{
                          background: isActive ? "#f4fbf7" : "#ffffff",
                          border: isActive
                            ? "2px solid #1a7a4e"
                            : "1px solid rgba(10,60,30,0.10)",
                          borderRadius: 12,
                          padding: 16,
                          position: "relative",
                        }}
                      >
                        {isActive && (
                          <span
                            style={{
                              position: "absolute",
                              top: 12,
                              right: 12,
                              fontSize: 10,
                              fontWeight: 700,
                              color: "#1a7a4e",
                              background: "#d6ede6",
                              borderRadius: 999,
                              padding: "2px 8px",
                              textTransform: "uppercase",
                              letterSpacing: "0.06em",
                            }}
                          >
                            You are here
                          </span>
                        )}

                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            alignItems: "flex-start",
                            justifyContent: "space-between",
                            gap: 10,
                            paddingRight: isActive ? 88 : 0,
                          }}
                        >
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div
                              style={{
                                fontSize: 11,
                                fontWeight: 600,
                                color: "#5a7a66",
                                textTransform: "uppercase",
                                letterSpacing: "0.06em",
                              }}
                            >
                              Unit {unit.unitNumber} ·{" "}
                              {unit.lessons.length} lessons
                            </div>
                            <h2
                              style={{
                                marginTop: 3,
                                fontSize: 15,
                                fontWeight: 700,
                                fontStyle: "italic",
                                fontFamily: "Fraunces, Lora, Georgia, serif",
                                color: "#1a2e22",
                              }}
                            >
                              {unit.title}
                            </h2>
                            <p
                              style={{
                                marginTop: 4,
                                fontSize: 12,
                                color: "#5a7a66",
                                lineHeight: 1.4,
                              }}
                            >
                              {unit.objective}
                            </p>
                            <div
                              style={{
                                marginTop: 8,
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 4,
                              }}
                            >
                              {unit.teks.map((teks) => (
                                <TeksTag
                                  key={teks}
                                  code={teks}
                                  priority={isPriorityTeks(teks)}
                                />
                              ))}
                            </div>
                          </div>

                          <div
                            style={{
                              display: "flex",
                              gap: 6,
                              flexShrink: 0,
                            }}
                          >
                            {isActive &&
                              continueLesson?.unit.id === unit.id && (
                                <Link
                                  href={`/student/learn/${unit.id}/${continueLesson.lesson.slug}`}
                                  style={{
                                    fontSize: 12,
                                    fontWeight: 700,
                                    color: "#ffffff",
                                    background: "#1a7a4e",
                                    borderRadius: 8,
                                    padding: "7px 12px",
                                    textDecoration: "none",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  Continue →
                                </Link>
                              )}
                            <Link
                              href={`/student/learn/${unit.id}`}
                              style={{
                                fontSize: 12,
                                fontWeight: 600,
                                color: "#5a7a66",
                                background: "#ffffff",
                                border: "1px solid rgba(10,60,30,0.10)",
                                borderRadius: 8,
                                padding: "7px 12px",
                                textDecoration: "none",
                              }}
                            >
                              Open Unit
                            </Link>
                          </div>
                        </div>

                        {/* Progress bar */}
                        <div
                          style={{
                            marginTop: 12,
                            height: 6,
                            background: "rgba(0,0,0,0.07)",
                            borderRadius: 999,
                          }}
                        >
                          <div
                            style={{
                              height: 6,
                              background: "#1a7a4e",
                              borderRadius: 999,
                              width: `${unitPct}%`,
                              transition: "width 0.3s",
                            }}
                          />
                        </div>
                        <div
                          style={{
                            marginTop: 4,
                            fontSize: 11,
                            color: "#5a7a66",
                          }}
                        >
                          {unitCompleted}/{unit.lessons.length} lessons
                          complete{unitPct === 100 ? " ✓" : ""}
                        </div>

                        {/* Lesson chips */}
                        <div
                          style={{
                            marginTop: 10,
                            display: "grid",
                            gridTemplateColumns:
                              "repeat(auto-fill, minmax(170px, 1fr))",
                            gap: 5,
                          }}
                        >
                          {unit.lessons.map((lesson, lessonIndex) => {
                            const unlocked = isLessonUnlocked(
                              unit,
                              lessonIndex,
                              progress,
                            );
                            const completed = Boolean(
                              progress[lesson.id]?.completed,
                            );
                            const inProgressLesson =
                              !completed &&
                              (progress[lesson.id]?.percent ?? 0) > 0;
                            const prevLesson = unit.lessons[lessonIndex - 1];

                            return (
                              <Link
                                key={lesson.id}
                                href={
                                  unlocked
                                    ? `/student/learn/${unit.id}/${lesson.slug}`
                                    : "#"
                                }
                                aria-disabled={!unlocked}
                                title={
                                  !unlocked && prevLesson
                                    ? `Complete "${prevLesson.title}" to unlock`
                                    : undefined
                                }
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 6,
                                  padding: "6px 10px",
                                  borderRadius: 8,
                                  border: completed
                                    ? "1px solid rgba(26,122,78,0.35)"
                                    : inProgressLesson
                                      ? "1px solid rgba(26,122,78,0.50)"
                                      : "1px solid rgba(10,60,30,0.10)",
                                  background: completed
                                    ? "#f0f8f4"
                                    : "#ffffff",
                                  opacity: unlocked ? 1 : 0.55,
                                  textDecoration: "none",
                                  cursor: unlocked ? "pointer" : "not-allowed",
                                  pointerEvents: unlocked ? "auto" : "none",
                                  fontSize: 11,
                                  fontWeight: 600,
                                  color: completed ? "#1a7a4e" : "#1a2e22",
                                }}
                              >
                                <span style={{ flexShrink: 0 }}>
                                  {!unlocked
                                    ? "🔒"
                                    : completed
                                      ? "✓"
                                      : inProgressLesson
                                        ? "▶"
                                        : "○"}
                                </span>
                                <span
                                  style={{
                                    flex: 1,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {lesson.title}
                                </span>
                              </Link>
                            );
                          })}
                        </div>

                        {unit.lessons.some(
                          (_, i) =>
                            !isLessonUnlocked(unit, i, progress) && i > 0,
                        ) && (
                          <div
                            style={{
                              marginTop: 8,
                              fontSize: 11,
                              color: "#6a9a82",
                              fontStyle: "italic",
                            }}
                          >
                            🔒 Locked lessons unlock when you complete the
                            previous lesson with a ≥{MASTERY_THRESHOLD}% check
                            score.
                          </div>
                        )}
                      </article>
                    );
                  })}
                </div>
              </div>
            ))}
          </section>

          {/* Sidebar */}
          <aside style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* Weakest Standards */}
            <section
              style={{
                background: "#ffffff",
                border: "1px solid rgba(10,60,30,0.10)",
                borderRadius: 12,
                padding: 16,
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#1a2e22",
                  marginBottom: 10,
                }}
              >
                Weakest Standards
              </div>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 8 }}
              >
                {weakestTeks.length === 0 ? (
                  <div style={{ fontSize: 12, color: "#5a7a66" }}>
                    No data yet — complete some lessons first.
                  </div>
                ) : (
                  weakestTeks.map((row) => (
                    <div
                      key={row.teks}
                      style={{
                        background: "#ffffff",
                        border: "1px solid rgba(10,60,30,0.10)",
                        borderRadius: 8,
                        padding: "8px 12px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          flexWrap: "wrap",
                        }}
                      >
                        <TeksTag
                          code={row.teks}
                          priority={isPriorityTeks(row.teks)}
                        />
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            borderRadius: 999,
                            padding: "2px 7px",
                            background:
                              row.proficiency === "needs-support"
                                ? "#fde8e0"
                                : row.proficiency === "developing"
                                  ? "#fef3d6"
                                  : "#d6ede6",
                            color:
                              row.proficiency === "needs-support"
                                ? "#c04a20"
                                : row.proficiency === "developing"
                                  ? "#b8860b"
                                  : "#1a7a4e",
                          }}
                        >
                          {row.proficiency === "needs-support"
                            ? "Needs Support"
                            : row.proficiency === "developing"
                              ? "Developing"
                              : "Mastered"}
                        </span>
                      </div>
                      <div
                        style={{
                          marginTop: 4,
                          fontSize: 11,
                          color: "#5a7a66",
                        }}
                      >
                        Avg check: {row.avgCheck}% · Completion:{" "}
                        {row.completionPct}%
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* Intervention Queue */}
            <section
              style={{
                background: "#ffffff",
                border: "1px solid rgba(10,60,30,0.10)",
                borderRadius: 12,
                padding: 16,
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#1a2e22",
                  marginBottom: 10,
                }}
              >
                Intervention Queue
              </div>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 8 }}
              >
                {interventions.length === 0 ? (
                  <div style={{ fontSize: 12, color: "#5a7a66" }}>
                    No interventions right now — great work! 🎉
                  </div>
                ) : (
                  interventions.slice(0, 3).map((item) => (
                    <Link
                      key={item.lessonId}
                      href={item.href}
                      style={{
                        display: "block",
                        background:
                          item.tier === 3 ? "#fde8e0" : "#fef3d6",
                        border: `1px solid ${item.tier === 3 ? "rgba(224,90,42,0.25)" : "rgba(184,134,11,0.25)"}`,
                        borderRadius: 8,
                        padding: "9px 12px",
                        textDecoration: "none",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 9,
                            fontWeight: 700,
                            letterSpacing: "0.04em",
                            borderRadius: 999,
                            padding: "2px 7px",
                            background:
                              item.tier === 3
                                ? "rgba(224,90,42,0.15)"
                                : "rgba(184,134,11,0.15)",
                            color:
                              item.tier === 3 ? "#c04a20" : "#b8860b",
                            border: `1px solid ${item.tier === 3 ? "#e05a2a" : "#b8860b"}`,
                          }}
                        >
                          TIER {item.tier}
                        </span>
                        <span
                          style={{
                            fontSize: 12,
                            fontWeight: 600,
                            color: item.tier === 3 ? "#c04a20" : "#b8860b",
                          }}
                        >
                          {item.lessonTitle}
                        </span>
                      </div>
                      <div
                        style={{
                          marginTop: 3,
                          fontSize: 11,
                          color: item.tier === 3 ? "#c04a20" : "#b8860b",
                        }}
                      >
                        {item.reason}
                      </div>
                    </Link>
                  ))
                )}
                {interventions.length > 3 && (
                  <Link
                    href="/student/learn/interventions"
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#1a7a4e",
                      textDecoration: "none",
                      textAlign: "center",
                      display: "block",
                      paddingTop: 4,
                    }}
                  >
                    View all {interventions.length} →
                  </Link>
                )}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
