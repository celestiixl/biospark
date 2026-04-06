"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import PageShell from "@/components/ui/PageShell";
import BsCard from "@/components/ui/BsCard";
import BsCardTitle from "@/components/ui/BsCardTitle";
import BsTag from "@/components/ui/BsTag";
import BsBtn from "@/components/ui/BsBtn";
import WeeklyDigestCard from "@/components/teacher/WeeklyDigestCard";
import PeriodMasterySection from "@/components/teacher/PeriodMasterySection";
import { useTeacherAuth } from "@/lib/teacherAuth";

// Design token constants kept in sync with globals.css :root v4 block.
// Tailwind v4 requires static values; CSS var refs are not resolvable at build time.
const C = {
  tealDeep: "#003d2e",
  teal:     "#00c49a",
} as const;

const heroGhostBtn: React.CSSProperties = {
  background: "rgba(255,255,255,0.1)",
  border: "1px solid rgba(255,255,255,0.18)",
  color: "rgba(255,255,255,0.85)",
  borderRadius: 10,
  padding: "8px 18px",
  fontSize: 13,
  fontWeight: 600,
  cursor: "pointer",
};

const heroTealBtn: React.CSSProperties = {
  background: C.teal,
  border: "none",
  color: C.tealDeep,
  borderRadius: 10,
  padding: "8px 18px",
  fontSize: 13,
  fontWeight: 700,
  cursor: "pointer",
};

export default function TeacherDashboardPage() {
  const router = useRouter();
  const teacher = useTeacherAuth((s) => s.teacher);
  const todayLabel = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  return (
    <PageShell>

      {/* ── HERO BANNER ── */}
      <div style={{
        background: C.tealDeep,
        borderRadius: 16,
        padding: "28px 30px 24px",
        marginBottom: 16,
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Decorative glow orb */}
        <div style={{
          position: "absolute", top: -80, right: -60,
          width: 260, height: 260, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,196,154,0.22) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginBottom: 4 }}>
            Welcome back
          </p>
          <h1 style={{
            fontFamily: "var(--font-fraunces), Georgia, serif",
            fontSize: 36, fontWeight: 800, fontStyle: "italic",
            color: "white", lineHeight: 1.1, marginBottom: 4,
          }}>
            Teacher Dashboard ✦
          </h1>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginBottom: 20 }}>
            {teacher?.name ?? "Teacher"} · {todayLabel}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            <button type="button" style={heroGhostBtn} onClick={() => router.push("/teacher/item-bank")}>
              Item Bank
            </button>
            <button type="button" style={heroTealBtn} onClick={() => router.push("/teacher/builder")}>
              Builder
            </button>
            <button type="button" style={heroGhostBtn} onClick={() => router.push("/simulations")} aria-label="Open simulations">
              Simulations
            </button>
            <button type="button" style={heroGhostBtn} onClick={() => router.push("/phenomena-studio")} aria-label="Open SparkScope">
              SparkScope
            </button>
          </div>
        </div>
      </div>

      {/* ── TWO-COLUMN LAYOUT ── */}
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>

        {/* LEFT: 60% — weekly digest + recent assessments */}
        <div style={{ flex: "0 0 60%", minWidth: 0, display: "flex", flexDirection: "column", gap: 12 }}>
          <WeeklyDigestCard take={3} showFooter />

          <BsCard>
            <div className="flex items-start justify-between gap-4">
              <div>
                <BsCardTitle>Recent Assessments</BsCardTitle>
                <p className="mt-1 text-[13px] text-bs-muted">
                  Your latest drafts and published assessments.
                </p>
              </div>
              <BsBtn variant="ghost" onClick={() => router.push("/teacher/assessments")}>
                View All
              </BsBtn>
            </div>
            <div className="mt-4 rounded-bs-sm border border-[rgba(0,0,0,0.06)] p-4">
              <div className="text-[13px] text-bs-muted">No assessments yet.</div>
              <div className="mt-5 flex justify-end gap-3">
                <BsBtn variant="ghost" onClick={() => router.push("/teacher/builder")}>
                  Open
                </BsBtn>
                <BsBtn variant="ghost" onClick={() => router.push("/teacher/learning-analytics")}>
                  Analytics
                </BsBtn>
              </div>
            </div>
          </BsCard>
        </div>

        {/* RIGHT: 38% — sticky sidebar */}
        <div style={{ flex: "0 0 38%", minWidth: 0, display: "flex", flexDirection: "column", gap: 12, position: "sticky", top: 24 }}>

          {/* My Classes — TEAL */}
          <BsCard variant="teal">
            <BsCardTitle>My Classes</BsCardTitle>
            <div className="mt-3 rounded-bs-sm border border-[rgba(0,196,154,0.15)] bg-white/50 p-4">
              <div className="text-[15px] font-semibold text-bs-ink">Biology Period —</div>
              <div className="text-[13px] text-bs-muted">Code: BIO-—</div>
            </div>
          </BsCard>

          {/* AI Grading Assistant — CORAL */}
          <BsCard variant="coral">
            <div className="flex items-start justify-between gap-2">
              <div>
                <BsCardTitle>AI Grading Assistant</BsCardTitle>
                <p className="mt-2 text-[13px] text-bs-muted">
                  You have <span className="font-semibold">—</span> constructed
                  responses waiting for review.
                </p>
              </div>
              <BsTag variant="coral">Ready</BsTag>
            </div>
            <div className="mt-4">
              <BsBtn variant="ghost" disabled>
                Open Queue
              </BsBtn>
            </div>
          </BsCard>

          {/* Learning Hub Admin — PURPLE */}
          <BsCard variant="purple">
            <BsCardTitle>Learning Hub Admin</BsCardTitle>
            <p className="mt-2 text-[13px] text-bs-muted">
              Manage visibility, playlists, curriculum quality, and imports.
            </p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <Link
                href="/teacher/learning-controls"
                className="rounded-bs-sm border border-[rgba(124,92,252,0.15)] bg-white/50 px-3 py-2 text-[13px] font-semibold text-[#4a2fc0] hover:bg-white/80"
              >
                Learning Controls
              </Link>
              <Link
                href="/teacher/content-quality"
                className="rounded-bs-sm border border-[rgba(124,92,252,0.15)] bg-white/50 px-3 py-2 text-[13px] font-semibold text-[#4a2fc0] hover:bg-white/80"
              >
                Content Quality
              </Link>
              <Link
                href="/teacher/import-curriculum"
                className="rounded-bs-sm border border-[rgba(124,92,252,0.15)] bg-white/50 px-3 py-2 text-[13px] font-semibold text-[#4a2fc0] hover:bg-white/80"
              >
                Import Validator
              </Link>
              <Link
                href="/teacher/learning-analytics"
                className="rounded-bs-sm border border-[rgba(124,92,252,0.15)] bg-white/50 px-3 py-2 text-[13px] font-semibold text-[#4a2fc0] hover:bg-white/80"
              >
                Learning Analytics
              </Link>
              <Link
                href="/student/learn/simulations/population-genetics"
                className="rounded-bs-sm border border-[rgba(124,92,252,0.2)] bg-bs-purple-soft px-3 py-2 text-[13px] font-semibold text-[#4a2fc0] hover:opacity-90 sm:col-span-2"
              >
                🧬 Population Genetics Simulator
              </Link>
            </div>
          </BsCard>

        </div>
      </div>

      {/* ── Period Mastery Snapshot ── */}
      <div className="mt-3">
        <PeriodMasterySection />
      </div>

    </PageShell>
  );
}
