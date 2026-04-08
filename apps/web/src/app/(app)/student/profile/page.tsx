"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { StudentProfile } from "@/types/challenge";
import { BADGE_MILESTONES, levelTitle } from "@/lib/challengeData";
import {
  DEFAULT_PROFILE,
  loadStudentProfile,
  saveStudentProfile,
  setStudentNameOnceWithServer,
} from "@/lib/studentProfile";
import { useTutorPermissions } from "@/hooks/useTutorPermissions";

function masteryPercent(correct: number, total: number): number {
  if (!total) return 0;
  return Math.round((correct / total) * 100);
}

export default function StudentProfilePage() {
  const [profile, setProfile] = useState<StudentProfile>(DEFAULT_PROFILE);
  const [ready, setReady] = useState(false);
  const [candidateName, setCandidateName] = useState("");
  const [nameError, setNameError] = useState<string | null>(null);
  const [nameSaved, setNameSaved] = useState(false);
  const [isSavingName, setIsSavingName] = useState(false);
  const { permissions, showForStudent } = useTutorPermissions();

  useEffect(() => {
    try {
      const parsed = loadStudentProfile();
      setProfile(parsed);
      setCandidateName(parsed.name);
      saveStudentProfile(parsed);
    } catch {
      setProfile(DEFAULT_PROFILE);
    }
    setReady(true);
  }, []);

  async function handleSetNameOnce() {
    if (isSavingName) return;

    setIsSavingName(true);
    setNameSaved(false);
    setNameError(null);

    try {
      const result = await setStudentNameOnceWithServer(profile, candidateName);
      if (!result.ok) {
        setNameError(result.reason);
        return;
      }

      setProfile(result.profile);
      saveStudentProfile(result.profile);
      setNameSaved(true);
    } catch {
      setNameError("Could not validate name right now. Please try again.");
    } finally {
      setIsSavingName(false);
    }
  }

  const topicRows = useMemo(() => {
    return Object.entries(profile.topicAccuracy)
      .map(([topic, value]) => ({
        topic,
        percent: masteryPercent(value.correct, value.total),
        correct: value.correct,
        total: value.total,
      }))
      .sort((a, b) => b.percent - a.percent);
  }, [profile.topicAccuracy]);

  const xpInLevel = profile.xp % 100;

  const xpToNextLevel = 100 - (profile.xp % 100);
  const xpInLevelDisplay = profile.xp % 100;

  function masteryColor(pct: number): string {
    if (pct >= 75) return "#0d4a2f";
    if (pct >= 40) return "#1a7a4e";
    return "#e05a2a";
  }

  function masteryLabel(pct: number): string {
    if (pct >= 75) return "Your strongest area ✓";
    if (pct >= 40) return "Keep growing here 📈";
    return "Needs more practice";
  }

  if (!ready) {
    return (
      <main style={{ minHeight: "100vh", background: "#eef3ee", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ color: "#5a7a66", fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)" }}>Loading profile...</span>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", background: "#eef3ee", padding: "24px 20px 60px", fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", flexDirection: "column", gap: 16 }}>
        <section style={{ background: "#ffffff", border: "1px solid rgba(10,60,30,0.10)", borderRadius: 12, padding: 20 }}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 style={{ fontFamily: "var(--font-lora, 'Lora', Georgia, serif)", fontStyle: "italic", fontWeight: 700, fontSize: "1.75rem", color: "#0d4a2f", margin: 0 }}>My Profile</h1>
              <p style={{ marginTop: 4, fontSize: "0.875rem", color: "#5a7a66" }}>Track your BioSpark progress, mastery, and achievements.</p>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              <Link href="/student/learn" style={{ borderRadius: 20, border: "1px solid rgba(10,60,30,0.10)", padding: "6px 16px", fontSize: "0.875rem", fontWeight: 500, color: "#0d4a2f", textDecoration: "none", background: "#d6ede6" }}>
                Curriculum
              </Link>
              <Link href="/student/dashboard" style={{ borderRadius: 20, border: "1px solid rgba(10,60,30,0.10)", padding: "6px 16px", fontSize: "0.875rem", fontWeight: 500, color: "#5a7a66", textDecoration: "none", background: "#ffffff" }}>
                Dashboard
              </Link>
            </div>
          </div>
        </section>

        <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
          {/* Student info + XP */}
          <section style={{ background: "#ffffff", border: "1px solid rgba(10,60,30,0.10)", borderRadius: 12, padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <div style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6a9a82" }}>Student</div>
              <div style={{ marginTop: 6, fontSize: "1.25rem", fontWeight: 700, color: "#1a2e22" }}>{profile.name || "New Explorer"}</div>
              <div style={{ marginTop: 2, fontSize: "0.8rem", color: "#5a7a66" }}>Class Code: {profile.classCode}</div>
            </div>

            {/* XP Progress */}
            <div style={{ background: "#fef3d6", borderRadius: 10, padding: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "#b8860b" }}>
                  {profile.xp} XP — {xpToNextLevel} away from next level
                </span>
                <span style={{ fontSize: "0.75rem", color: "#b8860b" }}>{xpInLevelDisplay}/100</span>
              </div>
              <div style={{ height: 8, background: "rgba(184,134,11,0.2)", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${xpInLevelDisplay}%`, background: "#b8860b", borderRadius: 4, transition: "width 0.5s ease" }} />
              </div>
              <div style={{ marginTop: 6, fontSize: "0.75rem", color: "#b8860b" }}>
                Level {profile.level} · {levelTitle(profile.level)}
              </div>
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              <div style={{ background: "#fef3d6", borderRadius: 10, padding: "10px 8px", textAlign: "center" }}>
                <div style={{ fontSize: "0.7rem", color: "#b8860b" }}>Streak</div>
                <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "#b8860b" }}>🔥 {profile.streak}</div>
              </div>
              <div style={{ background: "#d6ede6", borderRadius: 10, padding: "10px 8px", textAlign: "center" }}>
                <div style={{ fontSize: "0.7rem", color: "#4a8a6e" }}>Badges</div>
                <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0d4a2f" }}>{profile.badges.length}</div>
              </div>
              <div style={{ background: "#ece8f8", borderRadius: 10, padding: "10px 8px", textAlign: "center" }}>
                <div style={{ fontSize: "0.7rem", color: "#5a3d9a" }}>Mode</div>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#5a3d9a", textTransform: "capitalize" }}>{profile.preferredMode}</div>
              </div>
            </div>

            {/* Name settings */}
            <div style={{ background: "#ffffff", border: "1px solid rgba(10,60,30,0.10)", borderRadius: 10, padding: 12 }}>
              <div style={{ fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "#6a9a82", marginBottom: 6 }}>Display Name</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                <input
                  type="text"
                  value={candidateName}
                  onChange={(e) => { setCandidateName(e.target.value); setNameError(null); setNameSaved(false); }}
                  disabled={profile.nameLocked}
                  placeholder="Enter your display name"
                  style={{ flex: 1, minWidth: 140, borderRadius: 8, border: "1px solid rgba(10,60,30,0.10)", padding: "6px 10px", fontSize: "0.875rem", color: "#1a2e22", background: profile.nameLocked ? "rgba(0,0,0,0.04)" : "#ffffff" }}
                  maxLength={24}
                />
                <button
                  type="button"
                  onClick={handleSetNameOnce}
                  disabled={profile.nameLocked || isSavingName}
                  style={{ borderRadius: 20, background: "#0d4a2f", color: "#d6f0e4", border: "none", padding: "6px 16px", fontSize: "0.875rem", fontWeight: 500, cursor: profile.nameLocked ? "not-allowed" : "pointer", opacity: profile.nameLocked ? 0.6 : 1 }}
                >
                  {isSavingName ? "Checking..." : "Save"}
                </button>
              </div>
              {profile.nameLocked && <p style={{ marginTop: 6, fontSize: "0.75rem", color: "#1a7a4e" }}>Name is locked for this account.</p>}
              {nameError && <p style={{ marginTop: 6, fontSize: "0.75rem", color: "#c04a20" }}>{nameError}</p>}
              {nameSaved && !nameError && <p style={{ marginTop: 6, fontSize: "0.75rem", color: "#1a7a4e" }}>Name saved and locked.</p>}
            </div>

            {permissions.hiddenByStudent && (
              <div style={{ background: "#ffffff", border: "1px solid rgba(10,60,30,0.10)", borderRadius: 10, padding: 12 }}>
                <div style={{ fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "#6a9a82", marginBottom: 6 }}>AI Tutor</div>
                <p style={{ fontSize: "0.75rem", color: "#5a7a66", marginBottom: 8 }}>You have hidden the AI Tutor widget. You can restore it here.</p>
                <button type="button" onClick={showForStudent} style={{ borderRadius: 20, border: "1px solid rgba(10,60,30,0.10)", background: "#ffffff", color: "#1a2e22", padding: "6px 16px", fontSize: "0.875rem", fontWeight: 500, cursor: "pointer" }}>
                  Show AI Tutor
                </button>
              </div>
            )}
          </section>

          {/* Trophy Vault */}
          <section style={{ background: "#ffffff", border: "1px solid rgba(10,60,30,0.10)", borderRadius: 12, padding: 20 }}>
            <h2 style={{ fontFamily: "var(--font-lora, 'Lora', Georgia, serif)", fontStyle: "italic", fontWeight: 700, fontSize: "1rem", color: "#0d4a2f", marginBottom: 12 }}>Trophy Vault</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {BADGE_MILESTONES.map((badge) => {
                const unlocked = profile.badges.includes(badge.key);
                return (
                  <div key={badge.key} style={{ borderRadius: 8, border: `1px solid ${unlocked ? "rgba(26,122,78,0.25)" : "rgba(10,60,30,0.10)"}`, background: unlocked ? "#d6ede6" : "#ffffff", padding: "10px 12px", fontSize: "0.8rem" }}>
                    <div style={{ fontWeight: 600, color: unlocked ? "#0d4a2f" : "#5a7a66" }}>{unlocked ? "🏅" : "🔒"} {badge.label}</div>
                    <div style={{ marginTop: 2, color: unlocked ? "#4a8a6e" : "#6a9a82" }}>{badge.description}</div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Topic Mastery */}
        <section style={{ background: "#ffffff", border: "1px solid rgba(10,60,30,0.10)", borderRadius: 12, padding: 20 }}>
          <h2 style={{ fontFamily: "var(--font-lora, 'Lora', Georgia, serif)", fontStyle: "italic", fontWeight: 700, fontSize: "1rem", color: "#0d4a2f", marginBottom: 4 }}>Topic Mastery</h2>
          <p style={{ fontSize: "0.8rem", color: "#5a7a66", marginBottom: 16 }}>Your strongest areas are at the top. Keep building on what you know!</p>
          {topicRows.length === 0 ? (
            <p style={{ fontSize: "0.875rem", color: "#5a7a66", fontStyle: "italic" }}>No mastery data yet. Complete a lesson to populate this section.</p>
          ) : (
            <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}>
              {topicRows.map((row, idx) => (
                <div key={row.topic} style={{ borderRadius: 10, border: "1px solid rgba(10,60,30,0.10)", padding: 12, background: "#ffffff" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
                    <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#1a2e22" }}>{row.topic}</span>
                    <span style={{ fontSize: "0.8rem", fontWeight: 700, color: masteryColor(row.percent) }}>{row.percent}%</span>
                  </div>
                  <div style={{ height: 6, background: "rgba(0,0,0,0.07)", borderRadius: 3, overflow: "hidden", marginBottom: 6 }}>
                    <div style={{ height: "100%", width: `${row.percent}%`, background: masteryColor(row.percent), borderRadius: 3, transition: "width 0.5s ease" }} />
                  </div>
                  <div style={{ fontSize: "0.7rem", color: masteryColor(row.percent), fontWeight: 500, marginBottom: 6 }}>
                    {idx === 0 ? "⭐ " : ""}{masteryLabel(row.percent)}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "0.7rem", color: "#6a9a82" }}>{row.correct}/{row.total} correct</span>
                    <Link href="/student/learn" style={{ fontSize: "0.7rem", fontWeight: 600, color: "#1a7a4e", textDecoration: "none" }}>Practice →</Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
