"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import PageShell from "@/components/ui/PageShell";
import WeeklyDigestCard from "@/components/teacher/WeeklyDigestCard";
import PeriodMasterySection from "@/components/teacher/PeriodMasterySection";
import { useTeacherAuth } from "@/lib/teacherAuth";

// ── Design tokens (hex, not CSS-var — guaranteed to render in Tailwind v4) ───
const C = {
  ink:        "#0a1a14",
  inkAlt:     "#2d4d3f",
  muted:      "#8aada0",
  surface:    "#ffffff",
  tealDeep:   "#003d2e",
  teal:       "#00c49a",
  tealDark:   "#006e55",
  tealSoft:   "#d6f5ed",
  coralSoft:  "#ffe8e3",
  coral:      "#ff4f2b",
  coralDark:  "#8a1a05",
  amberSoft:  "#fff5d6",
  amberText:  "#8a5e00",
  purpleSoft: "#eeebff",
  purple:     "#7c5cfc",
  purpleText: "#4a2fc0",
  purpleDark: "#1a0060",
  border:     "rgba(0,0,0,0.07)",
} as const;

// ── Reusable inline card style factory ───────────────────────────────────────
function card(bg: string, borderColor: string = C.border): React.CSSProperties {
  return {
    background: bg,
    border: `1px solid ${borderColor}`,
    borderRadius: 16,
    padding: 20,
  };
}

// ── Hero quick-action buttons ─────────────────────────────────────────────────
const heroGhost: React.CSSProperties = {
  background: "rgba(255,255,255,0.1)",
  border: "1px solid rgba(255,255,255,0.18)",
  color: "rgba(255,255,255,0.85)",
  borderRadius: 10, padding: "8px 18px",
  fontSize: 13, fontWeight: 600, cursor: "pointer",
};
const heroTeal: React.CSSProperties = {
  background: C.teal, border: "none", color: C.tealDeep,
  borderRadius: 10, padding: "8px 18px",
  fontSize: 13, fontWeight: 700, cursor: "pointer",
};

// ── Small link pill inside a card ────────────────────────────────────────────
function HubLink({ href, children, wide }: { href: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <Link
      href={href}
      style={{
        background: "rgba(124,92,252,0.08)",
        border: "1px solid rgba(124,92,252,0.18)",
        borderRadius: 10,
        padding: "8px 12px",
        fontSize: 12,
        fontWeight: 600,
        color: C.purpleText,
        textDecoration: "none",
        display: "block",
        gridColumn: wide ? "1 / -1" : undefined,
      }}
    >
      {children}
    </Link>
  );
}

// ── Label / title helpers ─────────────────────────────────────────────────────
function Label({ children, color = C.muted }: { children: React.ReactNode; color?: string }) {
  return (
    <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color, marginBottom: 8 }}>
      {children}
    </p>
  );
}
function Title({ children, color = C.ink }: { children: React.ReactNode; color?: string }) {
  return (
    <h3 style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: 17, fontWeight: 700, color, lineHeight: 1.2, margin: "0 0 4px" }}>
      {children}
    </h3>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

export default function TeacherDashboardPage() {
  const router = useRouter();
  const teacher = useTeacherAuth((s) => s.teacher);
  const todayLabel = new Date().toLocaleDateString("en-US", {
    weekday: "long", month: "short", day: "numeric",
  });

  return (
    <div style={{ minHeight: "100vh", background: "#f0f4f2", fontFamily: "var(--font-dm-sans), sans-serif" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 20px 60px" }}>

        {/* ── HERO BANNER ── */}
        <div style={{ background: C.tealDeep, borderRadius: 16, padding: "28px 30px 24px", marginBottom: 16, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -80, right: -60, width: 260, height: 260, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,196,154,0.22) 0%, transparent 70%)", pointerEvents: "none" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginBottom: 4 }}>Welcome back</p>
            <h1 style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: 36, fontWeight: 800, fontStyle: "italic", color: "white", lineHeight: 1.1, marginBottom: 4 }}>
              Teacher Dashboard ✦
            </h1>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginBottom: 20 }}>
              {teacher?.name ?? "Teacher"} · {todayLabel}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              <button type="button" style={heroGhost} onClick={() => router.push("/teacher/item-bank")}>Item Bank</button>
              <button type="button" style={heroTeal}  onClick={() => router.push("/teacher/builder")}>Builder</button>
              <button type="button" style={heroGhost} onClick={() => router.push("/simulations")} aria-label="Open simulations">Simulations</button>
              <button type="button" style={heroGhost} onClick={() => router.push("/phenomena-studio")} aria-label="Open SparkScope">SparkScope</button>
            </div>
          </div>
        </div>

        {/* ── ROW A: 3-column quick cards ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>

          {/* My Classes — TEAL */}
          <div style={card(C.tealSoft, "rgba(0,196,154,0.15)")}>
            <Label color={C.tealDark}>My Classes</Label>
            <div style={{ background: "rgba(255,255,255,0.6)", borderRadius: 12, border: "1px solid rgba(0,196,154,0.15)", padding: "12px 14px", marginTop: 4 }}>
              <p style={{ fontSize: 15, fontWeight: 700, color: C.ink, margin: "0 0 2px" }}>Biology Period —</p>
              <p style={{ fontSize: 12, color: C.tealDark, margin: 0 }}>Code: BIO-—</p>
            </div>
            <button
              type="button"
              onClick={() => router.push("/teacher/classes")}
              style={{ marginTop: 12, background: C.tealDark, color: "white", border: "none", borderRadius: 10, padding: "7px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
            >
              Manage →
            </button>
          </div>

          {/* AI Grading Assistant — CORAL */}
          <div style={card(C.coralSoft, "rgba(255,79,43,0.15)")}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <Label color={C.coralDark}>AI Grading</Label>
              <span style={{ background: "rgba(255,79,43,0.15)", color: C.coralDark, fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 20 }}>Ready</span>
            </div>
            <Title color={C.coralDark}>Grading Assistant</Title>
            <p style={{ fontSize: 12, color: C.coralDark, marginBottom: 14, opacity: 0.8 }}>
              <span style={{ fontWeight: 700 }}>—</span> constructed responses waiting for review.
            </p>
            <button
              type="button"
              disabled
              style={{ background: "rgba(255,79,43,0.12)", color: C.coralDark, border: "1px solid rgba(255,79,43,0.2)", borderRadius: 10, padding: "7px 14px", fontSize: 12, fontWeight: 600, cursor: "not-allowed", opacity: 0.7 }}
            >
              Open Queue
            </button>
          </div>

          {/* Recent Assessments — AMBER */}
          <div style={card(C.amberSoft, "rgba(245,168,0,0.18)")}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <Label color={C.amberText}>Assessments</Label>
              <button
                type="button"
                onClick={() => router.push("/teacher/assessments")}
                style={{ background: "transparent", border: "none", color: C.amberText, fontSize: 11, fontWeight: 600, cursor: "pointer", padding: 0 }}
              >
                View All →
              </button>
            </div>
            <Title color={C.amberText}>Recent Assessments</Title>
            <p style={{ fontSize: 12, color: C.amberText, marginBottom: 14, opacity: 0.8 }}>No assessments yet.</p>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                type="button"
                onClick={() => router.push("/teacher/builder")}
                style={{ background: C.amberText, color: "white", border: "none", borderRadius: 10, padding: "7px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
              >
                New →
              </button>
              <button
                type="button"
                onClick={() => router.push("/teacher/learning-analytics")}
                style={{ background: "rgba(138,94,0,0.1)", color: C.amberText, border: "1px solid rgba(138,94,0,0.15)", borderRadius: 10, padding: "7px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
              >
                Analytics
              </button>
            </div>
          </div>
        </div>

        {/* ── ROW B: 2-column — weekly digest + learning hub ── */}
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 12 }}>

          {/* Weekly Digest — left 60% */}
          <div style={{ flex: "0 0 60%", minWidth: 0 }}>
            <WeeklyDigestCard take={2} showFooter />
          </div>

          {/* Learning Hub Admin — right 38%, PURPLE */}
          <div style={{ flex: "0 0 38%", minWidth: 0, ...card(C.purpleSoft, "rgba(124,92,252,0.15)") }}>
            <Label color={C.purpleText}>Learning Hub</Label>
            <Title color={C.purpleDark}>Hub Admin</Title>
            <p style={{ fontSize: 12, color: C.purpleText, opacity: 0.75, marginBottom: 16, marginTop: 4 }}>
              Manage visibility, playlists, curriculum quality, and imports.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <HubLink href="/teacher/learning-controls">Learning Controls</HubLink>
              <HubLink href="/teacher/content-quality">Content Quality</HubLink>
              <HubLink href="/teacher/import-curriculum">Import Validator</HubLink>
              <HubLink href="/teacher/learning-analytics">Learning Analytics</HubLink>
              <HubLink href="/student/learn/simulations/population-genetics" wide>🧬 Population Genetics Simulator</HubLink>
            </div>
          </div>
        </div>

        {/* ── Period Mastery Snapshot ── */}
        <PeriodMasterySection />

      </div>
    </div>
  );
}
