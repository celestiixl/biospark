"use client";

import { useEffect, useState } from "react";
import { LEARNING_UNITS } from "@/lib/learningHubContent";
import { BackLink } from "@/components/nav/BackLink";
import {
  defaultLearningSettings,
  loadLearningSettings,
  saveLearningSettings,
  type LearningHubSettings,
  type PacingMode,
} from "@/lib/learningSettings";
import { useTutorPermissions } from "@/hooks/useTutorPermissions";

export default function TeacherLearningControlsPage() {
  const [settings, setSettings] = useState<LearningHubSettings>(() =>
    defaultLearningSettings(LEARNING_UNITS.map((unit) => unit.id)),
  );
  const { permissions, setTeacherEnabled } = useTutorPermissions();

  useEffect(() => {
    setSettings(loadLearningSettings(LEARNING_UNITS.map((unit) => unit.id)));
  }, []);

  function toggleUnit(unitId: string) {
    const visibleUnitIds = settings.visibleUnitIds.includes(unitId)
      ? settings.visibleUnitIds.filter((id) => id !== unitId)
      : [...settings.visibleUnitIds, unitId];

    const next = { ...settings, visibleUnitIds };
    setSettings(next);
    saveLearningSettings(next);
  }

  function setPacing(gradingPeriod: 1 | 2 | 3 | 4, pacing: PacingMode) {
    const next = {
      ...settings,
      pacingByGradingPeriod: {
        ...settings.pacingByGradingPeriod,
        [gradingPeriod]: pacing,
      },
    };
    setSettings(next);
    saveLearningSettings(next);
  }

  function addLessonToPeriod(
    period: "P1" | "P2" | "P3" | "P4",
    lessonId: string,
  ) {
    if (!lessonId) return;
    const current = settings.playlistsByPeriod[period];
    if (current.lessonIds.includes(lessonId)) return;
    const next = {
      ...settings,
      playlistsByPeriod: {
        ...settings.playlistsByPeriod,
        [period]: {
          ...current,
          lessonIds: [...current.lessonIds, lessonId],
        },
      },
    };
    setSettings(next);
    saveLearningSettings(next);
  }

  function removeLessonFromPeriod(
    period: "P1" | "P2" | "P3" | "P4",
    lessonId: string,
  ) {
    const current = settings.playlistsByPeriod[period];
    const next = {
      ...settings,
      playlistsByPeriod: {
        ...settings.playlistsByPeriod,
        [period]: {
          ...current,
          lessonIds: current.lessonIds.filter((id) => id !== lessonId),
        },
      },
    };
    setSettings(next);
    saveLearningSettings(next);
  }

  function setPeriodDueDate(
    period: "P1" | "P2" | "P3" | "P4",
    dueDate: string,
  ) {
    const current = settings.playlistsByPeriod[period];
    const next = {
      ...settings,
      playlistsByPeriod: {
        ...settings.playlistsByPeriod,
        [period]: {
          ...current,
          dueDate: dueDate || null,
        },
      },
    };
    setSettings(next);
    saveLearningSettings(next);
  }

  const lessonOptions = LEARNING_UNITS.flatMap((unit) =>
    unit.lessons.map((lesson) => ({
      id: lesson.id,
      label: `U${unit.unitNumber} • ${lesson.title}`,
    })),
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f0f4f2", fontFamily: "var(--font-dm-sans), sans-serif" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px 60px" }}>
        <BackLink href="/teacher/dashboard" label="Back to dashboard" />

        <div style={{ background: "#003d2e", borderRadius: 16, padding: "28px 30px 24px", marginBottom: 24, marginTop: 12 }}>
          <h1 style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: 28, fontWeight: 800, fontStyle: "italic", color: "white", marginBottom: 4 }}>
            Learning Hub Controls ✦
          </h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
            Choose which units students can see and set pacing by grading period.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: "white", border: "1px solid rgba(0,0,0,0.07)", borderRadius: 16, padding: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#0a1a14" }}>
              Pacing by Grading Period
            </div>
            <div style={{ marginTop: 12, display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}>
              {[1, 2, 3, 4].map((gradingPeriod) => (
                <div
                  key={gradingPeriod}
                  style={{ background: "white", border: "1px solid rgba(0,0,0,0.07)", borderRadius: 12, padding: 12 }}
                >
                  <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "#8aada0" }}>
                    Grading Period {gradingPeriod}
                  </div>
                  <select
                    value={
                      settings.pacingByGradingPeriod[gradingPeriod as 1 | 2 | 3 | 4]
                    }
                    onChange={(event) =>
                      setPacing(
                        gradingPeriod as 1 | 2 | 3 | 4,
                        event.target.value as PacingMode,
                      )
                    }
                    style={{ marginTop: 8, width: "100%", border: "1px solid rgba(0,0,0,0.07)", borderRadius: 8, padding: "8px 12px", fontSize: 13, background: "white", color: "#0a1a14" }}
                  >
                    <option value="on_track">On Track</option>
                    <option value="review">Review Focus</option>
                    <option value="accelerated">Accelerated</option>
                  </select>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: "white", border: "1px solid rgba(0,0,0,0.07)", borderRadius: 16, padding: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#0a1a14" }}>
              Visible Units
            </div>
            <div style={{ marginTop: 12, display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
              {LEARNING_UNITS.map((unit) => {
                const checked = settings.visibleUnitIds.includes(unit.id);
                return (
                  <label
                    key={unit.id}
                    style={{ display: "flex", alignItems: "flex-start", gap: 12, background: "white", border: "1px solid rgba(0,0,0,0.07)", borderRadius: 12, padding: 12, cursor: "pointer" }}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleUnit(unit.id)}
                      style={{ marginTop: 2 }}
                    />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#0a1a14" }}>
                        GP {unit.gradingPeriod} • Unit {unit.unitNumber}:{" "}
                        {unit.title}
                      </div>
                      <div style={{ marginTop: 4, fontSize: 11, color: "#8aada0" }}>
                        {unit.teks.join(" • ")}
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          <div style={{ background: "white", border: "1px solid rgba(0,0,0,0.07)", borderRadius: 16, padding: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#0a1a14" }}>
              Class Period Playlists
            </div>
            <p style={{ marginTop: 4, fontSize: 12, color: "#8aada0" }}>
              Build lesson playlists per class period and set a due window.
            </p>

            <div style={{ marginTop: 12, display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
              {(["P1", "P2", "P3", "P4"] as const).map((period) => {
                const config = settings.playlistsByPeriod[period];
                return (
                  <div
                    key={period}
                    style={{ background: "white", border: "1px solid rgba(0,0,0,0.07)", borderRadius: 12, padding: 12 }}
                  >
                    <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "#8aada0" }}>
                      {period} Playlist
                    </div>

                    <label style={{ display: "block", marginTop: 8, fontSize: 11, fontWeight: 600, color: "#8aada0" }}>
                      Due Date
                      <input
                        type="date"
                        value={config.dueDate ?? ""}
                        onChange={(event) =>
                          setPeriodDueDate(period, event.target.value)
                        }
                        style={{ marginTop: 4, width: "100%", border: "1px solid rgba(0,0,0,0.07)", borderRadius: 8, padding: "8px 12px", fontSize: 13, background: "white", color: "#0a1a14" }}
                      />
                    </label>

                    <label style={{ display: "block", marginTop: 8, fontSize: 11, fontWeight: 600, color: "#8aada0" }}>
                      Add Lesson
                      <select
                        onChange={(event) => {
                          addLessonToPeriod(period, event.target.value);
                          event.target.value = "";
                        }}
                        defaultValue=""
                        style={{ marginTop: 4, width: "100%", border: "1px solid rgba(0,0,0,0.07)", borderRadius: 8, padding: "8px 12px", fontSize: 13, background: "white", color: "#0a1a14" }}
                      >
                        <option value="" disabled>
                          Select lesson
                        </option>
                        {lessonOptions.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </label>

                    <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
                      {config.lessonIds.length === 0 ? (
                        <div style={{ fontSize: 12, color: "#8aada0" }}>
                          No lessons added yet.
                        </div>
                      ) : (
                        config.lessonIds.map((lessonId) => {
                          const label =
                            lessonOptions.find((option) => option.id === lessonId)
                              ?.label ?? lessonId;
                          return (
                            <div
                              key={lessonId}
                              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, background: "#f0f4f2", border: "1px solid rgba(0,0,0,0.07)", borderRadius: 8, padding: "6px 8px", fontSize: 12 }}
                            >
                              <span style={{ color: "#8aada0" }}>{label}</span>
                              <button
                                type="button"
                                onClick={() =>
                                  removeLessonFromPeriod(period, lessonId)
                                }
                                style={{ background: "white", border: "1px solid rgba(0,0,0,0.07)", borderRadius: 6, padding: "4px 8px", fontSize: 11, fontWeight: 600, color: "#8aada0", cursor: "pointer" }}
                              >
                                Remove
                              </button>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ background: "white", border: "1px solid rgba(0,0,0,0.07)", borderRadius: 16, padding: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#0a1a14" }}>AI Tutor Access</div>
            <p style={{ marginTop: 4, fontSize: 12, color: "#8aada0" }}>
              Students can hide the tutor themselves if enabled globally.
            </p>
            <label style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 12 }}>
              <input
                type="checkbox"
                checked={permissions.enabledByTeacher}
                onChange={(e) => setTeacherEnabled(e.target.checked)}
                style={{ width: 16, height: 16 }}
              />
              <span style={{ fontSize: 13, color: "#0a1a14" }}>Enable AI Tutor for all students</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
