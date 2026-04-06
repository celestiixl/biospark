"use client";

import Link from "next/link";
import LearningHub from "@/components/student/LearningHub";
import { BackLink } from "@/components/nav/BackLink";

const C = {
  ink:    "#0a1a14",
  muted:  "#8aada0",
  surface:"#ffffff",
  tealDeep:"#003d2e",
  border: "rgba(0,0,0,0.07)",
  pageBg: "#f0f4f2",
} as const;

export default function StudentLearningHubStandalonePage() {
  return (
    <div style={{ minHeight: "100vh", background: C.pageBg, fontFamily: "var(--font-dm-sans), sans-serif" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px 60px" }}>
        <BackLink href="/student/dashboard" label="Back to dashboard" />

        <div style={{ background: C.tealDeep, borderRadius: 16, padding: "28px 30px 24px", marginBottom: 24, marginTop: 12 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div>
              <h1 style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: 28, fontWeight: 800, fontStyle: "italic", color: "white", marginBottom: 4 }}>
                Learning Hub ✦
              </h1>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
                Structured readings, lectures, and notes for active FBISD Units 1-2.
              </p>
            </div>
            <Link
              href="/student/learn"
              style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 10, padding: "8px 20px", fontSize: 13, fontWeight: 600, color: "white", textDecoration: "none" }}
            >
              Open BioSpark Quest
            </Link>
          </div>
        </div>

        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20 }}>
          <LearningHub streak={3} accuracy={74} />
        </div>
      </div>
    </div>
  );
}
