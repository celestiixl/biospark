"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { BackLink } from "@/components/nav/BackLink";
import TeksTag from "@/components/ui/TeksTag";
import type { LearningUnit } from "@/lib/learningHubContent";
import {
  loadLearningProgress,
  type LearningProgressMap,
} from "@/lib/learningProgress";
import { isLessonUnlocked } from "@/lib/learningInsights";
import {
  interventionTierFromCheck,
  isPriorityTeks,
  MASTERY_THRESHOLD,
} from "@/lib/curriculumPolicy";

interface Props {
  unit: LearningUnit;
}

export default function UnitPageClient({ unit }: Props) {
  const [progress, setProgress] = useState<LearningProgressMap>({});

  useEffect(() => {
    setProgress(loadLearningProgress());
  }, []);

  const unitCompleted = useMemo(
    () => unit.lessons.filter((l) => progress[l.id]?.completed).length,
    [unit.lessons, progress],
  );

  const unitPct = Math.round((unitCompleted / unit.lessons.length) * 100);

  const avgMastery = useMemo(() => {
    const scores = unit.lessons
      .map((l) => progress[l.id]?.checkScore)
      .filter((s): s is number => typeof s === "number");
    return scores.length
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : null;
  }, [unit.lessons, progress]);

  const nextLesson = useMemo(() => {
    for (let i = 0; i < unit.lessons.length; i++) {
      const lesson = unit.lessons[i];
      const unlocked = isLessonUnlocked(unit, i, progress);
      if (unlocked && !progress[lesson.id]?.completed) {
        return { lesson, index: i };
      }
    }
    return null;
  }, [unit, progress]);

  return (
    <main
      style={{
        background: "#eef3ee",
        minHeight: "100dvh",
        padding: "12px 16px",
        color: "#1a2e22",
      }}
    >
      <BackLink href="/student/learn" label="Back to hub" />
      <div
        style={{
          maxWidth: 896,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {/* ── Unit header: dark green card ── */}
        <section
          style={{
            background: "#0d4a2f",
            borderRadius: 12,
            padding: 24,
            color: "#d6f0e4",
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "rgba(214,240,228,0.65)",
              marginBottom: 4,
            }}
          >
            Grading Period {unit.gradingPeriod}
          </div>
          <h1
            style={{
              fontSize: 24,
              fontWeight: 700,
              fontStyle: "italic",
              fontFamily: "Fraunces, Lora, Georgia, serif",
              color: "#d6f0e4",
              margin: 0,
            }}
          >
            Unit {unit.unitNumber}: {unit.title}
          </h1>
          <p
            style={{
              marginTop: 8,
              fontSize: 13,
              color: "rgba(214,240,228,0.80)",
              lineHeight: 1.55,
            }}
          >
            {unit.objective}
          </p>

          {/* Meta chips */}
          <div
            style={{
              marginTop: 12,
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            {unit.instructionalDays ? (
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#d6f0e4",
                  background: "rgba(214,240,228,0.12)",
                  border: "1px solid rgba(214,240,228,0.22)",
                  borderRadius: 999,
                  padding: "3px 10px",
                }}
              >
                {unit.instructionalDays} instructional days
              </span>
            ) : null}
            {unit.dateRange ? (
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#d6f0e4",
                  background: "rgba(214,240,228,0.12)",
                  border: "1px solid rgba(214,240,228,0.22)",
                  borderRadius: 999,
                  padding: "3px 10px",
                }}
              >
                {unit.dateRange}
              </span>
            ) : null}
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                borderRadius: 999,
                padding: "3px 10px",
                background:
                  unit.approvalStatus === "approved"
                    ? "rgba(26,122,78,0.35)"
                    : "rgba(184,134,11,0.25)",
                color:
                  unit.approvalStatus === "approved" ? "#a8e6c8" : "#fef3d6",
                border: "1px solid rgba(214,240,228,0.15)",
              }}
            >
              {unit.approvalStatus}
            </span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "rgba(214,240,228,0.65)",
                background: "rgba(214,240,228,0.08)",
                border: "1px solid rgba(214,240,228,0.15)",
                borderRadius: 999,
                padding: "3px 10px",
              }}
            >
              {unit.contentVersion}
            </span>
          </div>

          {/* TEKS tags */}
          <div
            style={{
              marginTop: 12,
              display: "flex",
              flexWrap: "wrap",
              gap: 6,
            }}
          >
            {unit.teks.map((teks) => (
              <TeksTag key={teks} code={teks} priority={isPriorityTeks(teks)} />
            ))}
          </div>

          {/* Progress + mastery */}
          <div
            style={{
              marginTop: 16,
              display: "flex",
              flexWrap: "wrap",
              gap: 20,
              alignItems: "flex-end",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "rgba(214,240,228,0.60)",
                  marginBottom: 5,
                }}
              >
                Unit Progress
              </div>
              <div
                style={{
                  width: 160,
                  height: 6,
                  background: "rgba(214,240,228,0.20)",
                  borderRadius: 999,
                }}
              >
                <div
                  style={{
                    height: 6,
                    background: "#d6f0e4",
                    borderRadius: 999,
                    width: `${unitPct}%`,
                    transition: "width 0.3s",
                  }}
                />
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "rgba(214,240,228,0.70)",
                  marginTop: 3,
                }}
              >
                {unitCompleted}/{unit.lessons.length} lessons complete
              </div>
            </div>
            {avgMastery !== null && (
              <div>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: "rgba(214,240,228,0.60)",
                    marginBottom: 4,
                  }}
                >
                  Mastery Score
                </div>
                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 700,
                    color:
                      avgMastery >= 80
                        ? "#a8e6c8"
                        : avgMastery >= 60
                          ? "#fef3d6"
                          : "#fde8e0",
                    lineHeight: 1,
                  }}
                >
                  {avgMastery}%
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ── Next lesson CTA ── */}
        {nextLesson && (
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
                  {(progress[nextLesson.lesson.id]?.percent ?? 0) > 0
                    ? "Resume"
                    : "Start"}{" "}
                  next lesson
                </div>
                <div
                  style={{
                    marginTop: 3,
                    fontSize: 14,
                    fontWeight: 600,
                    fontStyle: "italic",
                    fontFamily: "Fraunces, Lora, Georgia, serif",
                    color: "#0d4a2f",
                  }}
                >
                  {nextLesson.lesson.title}
                </div>
                <div
                  style={{ fontSize: 12, color: "#4a8a6e", marginTop: 2 }}
                >
                  Lesson {nextLesson.index + 1} · {nextLesson.lesson.minutes}{" "}
                  min · {nextLesson.lesson.type}
                </div>
              </div>
              <Link
                href={`/student/learn/${unit.id}/${nextLesson.lesson.slug}`}
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
                {(progress[nextLesson.lesson.id]?.percent ?? 0) > 0
                  ? "Resume →"
                  : "Start →"}
              </Link>
            </div>
          </section>
        )}

        {/* ── Learning intentions ── */}
        {unit.successCriteria.length > 0 && (
          <section
            style={{
              background: "#ffffff",
              border: "1px solid rgba(10,60,30,0.10)",
              borderRadius: 12,
              padding: 20,
            }}
          >
            <h2
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "#1a2e22",
                margin: "0 0 12px",
              }}
            >
              Learning Intentions
            </h2>
            <ul
              style={{
                margin: 0,
                padding: 0,
                listStyle: "none",
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              {unit.successCriteria.map((criterion, i) => (
                <li
                  key={i}
                  style={{
                    display: "flex",
                    gap: 10,
                    fontSize: 13,
                    color: "#1a2e22",
                    lineHeight: 1.5,
                  }}
                >
                  <span
                    style={{
                      color: "#1a7a4e",
                      fontWeight: 700,
                      flexShrink: 0,
                      marginTop: 1,
                    }}
                  >
                    ✓
                  </span>
                  <span>{criterion}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ── Vocabulary ── */}
        {unit.lessons.some((lesson) => lesson.vocabularyTiers) ? (
          <section
            style={{
              background: "#ffffff",
              border: "1px solid rgba(10,60,30,0.10)",
              borderRadius: 12,
              padding: 20,
            }}
          >
            <h2
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "#1a2e22",
                margin: "0 0 4px",
              }}
            >
              Vocabulary
            </h2>
            <p
              style={{ margin: "0 0 12px", fontSize: 12, color: "#5a7a66" }}
            >
              Everyday → Academic → Content Specific
            </p>
            <div
              style={{ display: "flex", flexDirection: "column", gap: 12 }}
            >
              {unit.lessons
                .filter((lesson) => lesson.vocabularyTiers)
                .map((lesson) => (
                  <article
                    key={`${lesson.id}-vocab`}
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
                        fontWeight: 600,
                        color: "#1a2e22",
                        marginBottom: 10,
                      }}
                    >
                      {lesson.title}
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gap: 12,
                        gridTemplateColumns:
                          "repeat(auto-fill, minmax(160px, 1fr))",
                      }}
                    >
                      {(
                        [
                          "everyday",
                          "academic",
                          "contentSpecific",
                        ] as const
                      ).map((tier) => (
                        <div key={tier}>
                          <div
                            style={{
                              fontSize: 10,
                              fontWeight: 700,
                              textTransform: "uppercase",
                              letterSpacing: "0.07em",
                              color: "#5a7a66",
                              marginBottom: 6,
                            }}
                          >
                            {tier === "everyday"
                              ? "Everyday"
                              : tier === "academic"
                                ? "Academic"
                                : "Content Specific"}
                          </div>
                          <div
                            style={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: 4,
                            }}
                          >
                            {lesson.vocabularyTiers?.[tier].map((word) => (
                              <span
                                key={`${lesson.id}-${tier}-${word}`}
                                style={{
                                  fontSize: 11,
                                  fontWeight:
                                    tier === "contentSpecific" ? 700 : 500,
                                  background:
                                    tier === "contentSpecific"
                                      ? "#d6ede6"
                                      : "#ffffff",
                                  color:
                                    tier === "contentSpecific"
                                      ? "#0d4a2f"
                                      : "#5a7a66",
                                  border: "1px solid rgba(10,60,30,0.10)",
                                  borderRadius: 999,
                                  padding: "2px 8px",
                                }}
                              >
                                {word}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </article>
                ))}
            </div>
          </section>
        ) : null}

        {/* ── Lesson list ── */}
        <section
          style={{
            background: "#ffffff",
            border: "1px solid rgba(10,60,30,0.10)",
            borderRadius: 12,
            padding: 20,
          }}
        >
          <h2
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "#1a2e22",
              margin: "0 0 16px",
            }}
          >
            Lessons in this Unit
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {unit.lessons.map((lesson, index) => {
              const unlocked = isLessonUnlocked(unit, index, progress);
              const completed = Boolean(progress[lesson.id]?.completed);
              const inProgressLesson =
                !completed && (progress[lesson.id]?.percent ?? 0) > 0;
              const lessonProgress = progress[lesson.id];
              const interventionTier = interventionTierFromCheck(
                lessonProgress?.checkScore,
                lessonProgress?.failedCheckAttempts ??
                  lessonProgress?.checkAttempts,
              );
              const prevLesson = unit.lessons[index - 1];

              let bgColor = "#ffffff";
              let borderColor = "rgba(10,60,30,0.10)";
              let stateLabel = "";
              let stateLabelColor = "";
              let stateLabelBg = "";

              if (completed) {
                bgColor = "#f4fbf7";
                borderColor = "rgba(26,122,78,0.30)";
                stateLabel = "Completed";
                stateLabelColor = "#1a7a4e";
                stateLabelBg = "#d6ede6";
              } else if (inProgressLesson) {
                bgColor = "#fafffe";
                borderColor = "rgba(26,122,78,0.50)";
                stateLabel = `${progress[lesson.id]?.percent ?? 0}% started`;
                stateLabelColor = "#1a7a4e";
                stateLabelBg = "#d6ede6";
              } else if (!unlocked) {
                stateLabel = "Locked";
                stateLabelColor = "#6a9a82";
                stateLabelBg = "rgba(10,60,30,0.06)";
              }

              return (
                <article
                  key={lesson.id}
                  style={{
                    background: bgColor,
                    border: `1px solid ${borderColor}`,
                    borderRadius: 12,
                    padding: 16,
                    opacity: unlocked ? 1 : 0.55,
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      gap: 10,
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      {/* Lesson meta row */}
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          alignItems: "center",
                          gap: 6,
                          marginBottom: 4,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            color: "#5a7a66",
                            textTransform: "uppercase",
                            letterSpacing: "0.06em",
                          }}
                        >
                          Lesson {index + 1}
                        </span>
                        <span style={{ fontSize: 11, color: "#6a9a82" }}>
                          ·
                        </span>
                        <span style={{ fontSize: 11, color: "#5a7a66" }}>
                          {lesson.type}
                        </span>
                        <span style={{ fontSize: 11, color: "#6a9a82" }}>
                          ·
                        </span>
                        <span style={{ fontSize: 11, color: "#5a7a66" }}>
                          {lesson.minutes} min
                        </span>
                        {stateLabel && (
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 700,
                              color: stateLabelColor,
                              background: stateLabelBg,
                              borderRadius: 999,
                              padding: "2px 7px",
                            }}
                          >
                            {!unlocked && "🔒 "}
                            {stateLabel}
                          </span>
                        )}
                        {interventionTier && (
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 700,
                              color:
                                interventionTier === 3 ? "#c04a20" : "#b8860b",
                              background:
                                interventionTier === 3
                                  ? "#fde8e0"
                                  : "#fef3d6",
                              border: `1px solid ${interventionTier === 3 ? "rgba(224,90,42,0.30)" : "rgba(184,134,11,0.30)"}`,
                              borderRadius: 999,
                              padding: "2px 7px",
                            }}
                          >
                            Tier {interventionTier} Intervention
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h3
                        style={{
                          fontSize: 15,
                          fontWeight: 700,
                          fontStyle: "italic",
                          fontFamily: "Fraunces, Lora, Georgia, serif",
                          color: "#1a2e22",
                          margin: "0 0 4px",
                        }}
                      >
                        {lesson.title}
                      </h3>

                      {/* Summary */}
                      <p
                        style={{
                          fontSize: 12,
                          color: "#5a7a66",
                          margin: "0 0 8px",
                          lineHeight: 1.5,
                        }}
                      >
                        {lesson.summary}
                      </p>

                      {/* TEKS tags */}
                      {lesson.teks && lesson.teks.length > 0 && (
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 4,
                          }}
                        >
                          {lesson.teks.map((teks) => (
                            <TeksTag
                              key={teks}
                              code={teks}
                              priority={isPriorityTeks(teks)}
                            />
                          ))}
                        </div>
                      )}

                      {/* Locked hint */}
                      {!unlocked && prevLesson && (
                        <div
                          style={{
                            marginTop: 6,
                            fontSize: 11,
                            color: "#6a9a82",
                            fontStyle: "italic",
                          }}
                        >
                          Complete &ldquo;{prevLesson.title}&rdquo; with ≥{MASTERY_THRESHOLD}%
                          to unlock.
                        </div>
                      )}

                      {/* Check score summary */}
                      {completed &&
                        lessonProgress?.checkScore !== undefined && (
                          <div
                            style={{
                              marginTop: 8,
                              fontSize: 11,
                              color: "#4a8a6e",
                              display: "flex",
                              gap: 12,
                            }}
                          >
                            <span>
                              Quick-check:{" "}
                              <strong>{lessonProgress.checkScore}%</strong>
                            </span>
                            {lessonProgress.checkAttempts !== undefined && (
                              <span>
                                Attempts: {lessonProgress.checkAttempts}
                              </span>
                            )}
                          </div>
                        )}
                    </div>

                    {/* CTA button */}
                    {unlocked && (
                      <Link
                        href={`/student/learn/${unit.id}/${lesson.slug}`}
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          textDecoration: "none",
                          whiteSpace: "nowrap",
                          borderRadius: 8,
                          padding: "7px 14px",
                          background: completed ? "#f0f8f4" : "#1a7a4e",
                          color: completed ? "#1a7a4e" : "#ffffff",
                          border: completed
                            ? "1px solid rgba(26,122,78,0.35)"
                            : "none",
                          flexShrink: 0,
                        }}
                      >
                        {completed
                          ? "Review →"
                          : inProgressLesson
                            ? "Resume →"
                            : "Start →"}
                      </Link>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
