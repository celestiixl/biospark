"use client";

import Leaderboard from "@/components/challenges/Leaderboard";
import { CHALLENGES } from "@/lib/challengeData";
import { QUEST_LEADER_ROWS } from "@/lib/questRankings";
import { BackLink } from "@/components/nav/BackLink";

const C = {
  ink:    "#0a1a14",
  muted:  "#8aada0",
  surface:"#ffffff",
  tealDeep:"#003d2e",
  border: "rgba(0,0,0,0.07)",
  pageBg: "#f0f4f2",
} as const;

export default function QuestRankingsPage() {
  const dayIndex = Math.floor(Date.now() / 86400000) % CHALLENGES.length;
  const weeklyChallenge = CHALLENGES.find((c) => c.difficulty === 3) ?? CHALLENGES[dayIndex];

  return (
    <div style={{ minHeight: "100vh", background: C.pageBg, fontFamily: "var(--font-dm-sans), sans-serif" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px 60px" }}>
        <BackLink href="/student/learn" label="Back to missions" />

        <div style={{ background: C.tealDeep, borderRadius: 16, padding: "28px 30px 24px", marginBottom: 24, marginTop: 12 }}>
          <h1 style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: 28, fontWeight: 800, fontStyle: "italic", color: "white", marginBottom: 4 }}>
            BioSpark Quest Rankings ✦
          </h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
            Full rankings view with Quest Leagues and Hall of Fame.
          </p>
        </div>

        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20 }}>
          <Leaderboard rows={QUEST_LEADER_ROWS} weeklyChallenge={weeklyChallenge} fitHeight />
        </div>
      </div>
    </div>
  );
}
