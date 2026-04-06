"use client";

import * as React from "react";
import Link from "next/link";
import { BackLink } from "@/components/nav/BackLink";
import { TabGroup } from "@/components/ui";
import StatCard from "@/components/ui/StatCard";
import { LEARNING_UNITS } from "@/lib/learningHubContent";
import { buildAnalyticsSummary } from "@/lib/analyticsData";
import type { AnalyticsSummary } from "@/lib/analyticsData";
import { LessonFunnelTab } from "@/components/teacher/LessonFunnelTab";
import { StuckPointsTab } from "@/components/teacher/StuckPointsTab";
import { TeksBreakdownTab } from "@/components/teacher/TeksBreakdownTab";

// ── Design tokens (match teacher dashboard v4 light theme) ───────────────────
const C = {
  ink:      "#0a1a14",
  muted:    "#8aada0",
  surface:  "#ffffff",
  tealDeep: "#003d2e",
  tealDark: "#006e55",
  tealSoft: "#d6f5ed",
  amberText:"#8a5e00",
  border:   "rgba(0,0,0,0.07)",
  pageBg:   "#f0f4f2",
} as const;

// ── Types ─────────────────────────────────────────────────────────────────────

type TabId = "funnel" | "stuck" | "teks";

const TABS: Array<{ value: TabId; label: string; description: string }> = [
  { value: "funnel", label: "Lesson Funnel",   description: "Completion by lesson" },
  { value: "stuck",  label: "Stuck Points",    description: "Below mastery threshold" },
  { value: "teks",   label: "TEKS Breakdown",  description: "Per-standard class avg" },
];

const PERIOD_OPTIONS = [
  { value: "all",      label: "All Periods" },
  { value: "period-1", label: "Period 1" },
  { value: "period-2", label: "Period 2" },
  { value: "period-3", label: "Period 3" },
  { value: "period-4", label: "Period 4" },
  { value: "period-5", label: "Period 5" },
];

// ── Shared select styling (light) ────────────────────────────────────────────
const selectClass =
  "rounded-lg border border-[rgba(0,0,0,0.12)] bg-white px-3 py-1.5 text-sm " +
  "text-[#0a1a14] focus:outline-none focus:ring-2 focus:ring-[#006e55]/40 " +
  "cursor-pointer";

// ── Page ─────────────────────────────────────────────────────────────────────

export default function TeacherLearningAnalyticsPage() {
  const [unit, setUnit]     = React.useState<string>("all");
  const [period, setPeriod] = React.useState<string>("all");
  const [tab, setTab]       = React.useState<TabId>("funnel");
  const [data, setData]     = React.useState<AnalyticsSummary | null>(null);

  // Fetch from /api/teacher/analytics when period is selected, falling back
  // to the local mock builder (buildAnalyticsSummary) when the API is
  // unavailable or no teacher token is configured.
  React.useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    const periodNum = period === "all" ? null : period.replace("period-", "");
    const url = periodNum
      ? `/api/teacher/analytics?period=${periodNum}`
      : `/api/teacher/analytics`;
    fetch(url, {
      signal: controller.signal,
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then(
        (apiData: {
          period: number | null;
          funnel: { totalStudents: number; started: number; completed: number };
          stuckPoints: Array<{
            teks: string;
            averageScore: number;
            studentsBelow70: number;
            studentsBelow50: number;
            totalStudents: number;
          }>;
          interventionQueue: { tier2: number; tier3: number };
        }) => {
          if (cancelled) return;
          // Map API response fields to the existing AnalyticsSummary props.
          // Fields not returned by the API (lessons, students, teksMap) fall
          // back to the local mock so existing tab components stay functional.
          const localFallback = buildAnalyticsSummary(unit, period);
          const mapped: AnalyticsSummary = {
            ...localFallback,
            tier2Count: apiData.interventionQueue.tier2,
            tier3Count: apiData.interventionQueue.tier3,
          };
          setData(mapped);
        },
      )
      .catch(() => {
        if (cancelled) return;
        // API unavailable or auth failed — use local mock as fallback
        setData(buildAnalyticsSummary(unit, period));
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [unit, period]);

  const loading = data === null;

  return (
    <div style={{ minHeight: "100vh", background: C.pageBg, fontFamily: "var(--font-dm-sans), sans-serif" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 20px 60px" }}>

        {/* ── Back link ──────────────────────────────────────────────────────── */}
        <div style={{ marginBottom: 16 }}>
          <BackLink href="/teacher/dashboard" label="Back to dashboard" />
        </div>

        {/* ── Page header ────────────────────────────────────────────────────── */}
        <div style={{ background: C.tealDeep, borderRadius: 16, padding: "28px 30px 24px", marginBottom: 16, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -80, right: -60, width: 260, height: 260, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,196,154,0.22) 0%, transparent 70%)", pointerEvents: "none" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginBottom: 4 }}>Teacher Tools</p>
            <h1 style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: 36, fontWeight: 800, fontStyle: "italic", color: "white", lineHeight: 1.1, marginBottom: 4 }}>
              Learning Analytics ✦
            </h1>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", marginBottom: 20 }}>
              Lesson funnel, stuck-point analysis, and TEKS mastery breakdown.
            </p>
            <Link
              href="/teacher/learning-analytics/weekly-digest"
              style={{ background: "rgba(245,168,0,0.18)", border: "1px solid rgba(245,168,0,0.35)", borderRadius: 10, padding: "7px 16px", fontSize: 13, fontWeight: 600, color: "#f5d060", textDecoration: "none", display: "inline-block" }}
            >
              Weekly Digest →
            </Link>
          </div>
        </div>

        {/* ── Filters row ──────────────────────────────────────────────────────── */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: "16px 20px", marginBottom: 16, display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: C.muted, margin: 0 }}>Filters</p>
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: C.ink }}>
            <span style={{ fontWeight: 600 }}>Unit</span>
            <select
              aria-label="Filter by unit"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className={selectClass}
            >
              <option value="all">All Units</option>
              {LEARNING_UNITS.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.title}
                </option>
              ))}
            </select>
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: C.ink }}>
            <span style={{ fontWeight: 600 }}>Period</span>
            <select
              aria-label="Filter by period"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className={selectClass}
            >
              {PERIOD_OPTIONS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* ── Metric cards ───────────────────────────────────────────────────── */}
        <section
          className="grid gap-3 sm:grid-cols-2 md:grid-cols-4"
          aria-label="Summary metrics"
          style={{ marginBottom: 16 }}
        >
          <StatCard
            label="Avg Mastery"
            value={loading ? "—" : `${data.avgMastery}%`}
          />
          <StatCard
            label="Lessons on Track"
            value={
              loading
                ? "—"
                : `${data.lessonsComplete} / ${data.lessons.length}`
            }
          />
          <StatCard
            label="Tier 2 Students"
            value={loading ? "—" : data.tier2Count}
          />
          <StatCard
            label="Tier 3 Students"
            value={loading ? "—" : data.tier3Count}
          />
        </section>

        {/* ── Tab bar ────────────────────────────────────────────────────────── */}
        <div style={{ marginBottom: 12 }}>
          <TabGroup<TabId>
            value={tab}
            onValueChange={setTab}
            items={TABS}
            className="md:grid-cols-3"
          />
        </div>

        {/* ── Tab content panel ──────────────────────────────────────────────── */}
        <div
          style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20 }}
          aria-busy={loading}
          aria-live="polite"
        >
          {tab === "funnel" && (
            <LessonFunnelTab
              lessons={data?.lessons ?? []}
              loading={loading}
            />
          )}
          {tab === "stuck" && (
            <StuckPointsTab
              students={data?.students ?? []}
              loading={loading}
            />
          )}
          {tab === "teks" && (
            <TeksBreakdownTab
              teksMap={data?.teksMap ?? []}
              loading={loading}
            />
          )}
        </div>

      </div>
    </div>
  );
}

