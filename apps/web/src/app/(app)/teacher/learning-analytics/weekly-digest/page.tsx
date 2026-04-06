"use client";

import * as React from "react";
import { BackLink } from "@/components/nav/BackLink";
import { getMondayOf } from "@/lib/weeklyDigest";
import type { DigestEntry, WeeklyDigestResult } from "@/lib/weeklyDigest";

const C = {
  ink:    "#0a1a14",
  muted:  "#8aada0",
  surface:"#ffffff",
  tealDeep:"#003d2e",
  amberText:"#8a5e00",
  amberSoft:"#fff5d6",
  border: "rgba(0,0,0,0.07)",
  pageBg: "#f0f4f2",
} as const;

// ─── Period options (mock — replace with real period data when available) ──────
const PERIOD_OPTIONS = [
  { value: "", label: "All periods" },
  { value: "1", label: "Period 1" },
  { value: "2", label: "Period 2" },
  { value: "3", label: "Period 3" },
  { value: "4", label: "Period 4" },
  { value: "5", label: "Period 5" },
];

// ─── TEKS filter options ───────────────────────────────────────────────────────
const TEKS_OPTIONS = [
  { value: "", label: "All TEKS" },
  { value: "B.5A", label: "B.5A" },
  { value: "B.5B", label: "B.5B" },
  { value: "B.5C", label: "B.5C" },
  { value: "B.7A", label: "B.7A" },
  { value: "B.7B", label: "B.7B" },
  { value: "B.7C", label: "B.7C" },
  { value: "B.11A", label: "B.11A" },
  { value: "B.11B", label: "B.11B" },
];

// ─── Single entry row ──────────────────────────────────────────────────────────
function EntryRow({ entry }: { entry: DigestEntry }) {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <div style={{ background: "white", border: "1px solid rgba(0,0,0,0.07)", borderRadius: 14, padding: 16 }}>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{ display: "flex", height: 28, width: 28, flexShrink: 0, alignItems: "center", justifyContent: "center", borderRadius: "50%", background: "#fff5d6", fontSize: 13, fontWeight: 700, color: "#8a5e00" }}
            aria-label={`Rank ${entry.rank}`}
          >
            {entry.rank}
          </span>
          <span
            style={{ background: "#003d2e", color: "white", borderRadius: 999, padding: "2px 8px", fontSize: 11, fontWeight: 600 }}
            aria-label={`TEKS ${entry.teks}`}
          >
            {entry.teks}
          </span>
          <span style={{ fontSize: 12, color: "#8aada0" }}>{entry.unitTitle}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 12, color: "#8aada0" }}>
            {entry.selectionCount} selections
          </span>
          <span
            style={{ borderRadius: 999, background: "#fef2f2", padding: "2px 8px", fontSize: 11, fontWeight: 600, color: "#b91c1c" }}
            aria-label={`${entry.selectionPct}% of wrong attempts chose this answer`}
          >
            {entry.selectionPct}% chose it
          </span>
        </div>
      </div>

      <p style={{ marginTop: 12, fontSize: 14, fontWeight: 500, color: "#0a1a14" }}>{entry.questionText}</p>
      <p style={{ marginTop: 4, fontSize: 14, color: "#dc2626" }}>
        <span style={{ fontWeight: 600 }}>Wrong answer: </span>
        {entry.wrongAnswer}
      </p>

      <p style={{ marginTop: 8, fontSize: 14, color: "#8aada0" }}>
        {entry.misconceptionDescription}
      </p>

      <button
        type="button"
        style={{ marginTop: 8, fontSize: 12, fontWeight: 600, color: "#7c5cfc", background: "none", border: "none", padding: 0, cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 2 }}
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
      >
        {expanded ? "Hide talking point ↑" : "Show talking point ↓"}
      </button>

      {expanded && (
        <div
          style={{ marginTop: 8, border: "1px solid #fde68a", background: "#fffbeb", borderRadius: 8, padding: 12, fontSize: 14, color: "#92400e" }}
          role="note"
          aria-label="Suggested talking point"
        >
          {entry.talkingPoint}
        </div>
      )}
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function WeeklyDigestPage() {
  const [periodId, setPeriodId] = React.useState("");
  const [teksFilter, setTeksFilter] = React.useState("");
  const [weekOf, setWeekOf] = React.useState(() => getMondayOf(new Date()));

  const [digest, setDigest] = React.useState<WeeklyDigestResult | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [fetchError, setFetchError] = React.useState<string | null>(null);

  // Fetch whenever filters change
  React.useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setFetchError(null);

    const params = new URLSearchParams({ weekOf, take: "10" });
    if (periodId) params.set("periodId", periodId);

    fetch(`/api/teacher/weekly-digest?${params.toString()}`)
      .then((r) => r.json())
      .then((data: WeeklyDigestResult & { error?: string }) => {
        if (cancelled) return;
        if (data.ok) {
          setDigest(data);
        } else {
          setFetchError(data.error ?? "Failed to load digest");
        }
      })
      .catch(() => {
        if (!cancelled) setFetchError("Failed to load digest");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [weekOf, periodId]);

  // Apply TEKS filter client-side (no extra round-trip needed)
  const filteredEntries: DigestEntry[] = React.useMemo(() => {
    const entries = digest?.entries ?? [];
    if (!teksFilter) return entries;
    return entries.filter((e) => e.teks === teksFilter);
  }, [digest, teksFilter]);

  const formattedLastUpdated = digest?.lastUpdated
    ? new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }).format(new Date(digest.lastUpdated))
    : null;

  return (
    <div style={{ minHeight: "100vh", background: C.pageBg, fontFamily: "var(--font-dm-sans), sans-serif" }}>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "32px 20px 60px" }}>
        <BackLink href="/teacher/learning-analytics" label="Back to analytics" />

        <div style={{ background: C.tealDeep, borderRadius: 16, padding: "28px 30px 24px", marginBottom: 24, marginTop: 12 }}>
          <h1 style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: 28, fontWeight: 800, fontStyle: "italic", color: "white", marginBottom: 4 }}>
            Weekly Teaching Moments ✦
          </h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
            The misconceptions most worth addressing this week — top 10, filterable by period and TEKS.
          </p>
        </div>

        {/* Filters */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: 16, marginBottom: 16, display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: 16 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <label htmlFor="weekOf" style={{ fontSize: 11, fontWeight: 700, color: C.muted }}>
              Week of (Monday)
            </label>
            <input
              id="weekOf"
              type="date"
              value={weekOf}
              onChange={(e) => setWeekOf(e.target.value)}
              style={{ border: `1px solid ${C.border}`, background: C.surface, borderRadius: 8, padding: "6px 12px", fontSize: 13, color: C.ink }}
              aria-label="Select week starting date"
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <label htmlFor="periodId" style={{ fontSize: 11, fontWeight: 700, color: C.muted }}>
              Class period
            </label>
            <select
              id="periodId"
              value={periodId}
              onChange={(e) => setPeriodId(e.target.value)}
              style={{ border: `1px solid ${C.border}`, background: C.surface, borderRadius: 8, padding: "6px 12px", fontSize: 13, color: C.ink }}
              aria-label="Filter by class period"
            >
              {PERIOD_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <label htmlFor="teksFilter" style={{ fontSize: 11, fontWeight: 700, color: C.muted }}>
              TEKS
            </label>
            <select
              id="teksFilter"
              value={teksFilter}
              onChange={(e) => setTeksFilter(e.target.value)}
              style={{ border: `1px solid ${C.border}`, background: C.surface, borderRadius: 8, padding: "6px 12px", fontSize: 13, color: C.ink }}
              aria-label="Filter by TEKS standard"
            >
              {TEKS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          {formattedLastUpdated && (
            <p style={{ marginLeft: "auto", fontSize: 11, color: C.muted, alignSelf: "flex-end" }}>
              Last updated {formattedLastUpdated}
            </p>
          )}
        </div>

        {/* Summary stats */}
        {digest && !loading && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
            <div style={{ flex: 1, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: 16 }}>
              <div style={{ fontSize: 12, color: C.muted }}>Total wrong attempts</div>
              <div style={{ marginTop: 4, fontSize: 28, fontWeight: 700, color: C.ink }}>
                {digest.totalWrongAttempts}
              </div>
            </div>
            <div style={{ flex: 1, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: 16 }}>
              <div style={{ fontSize: 12, color: C.muted }}>
                Misconceptions surfaced
              </div>
              <div style={{ marginTop: 4, fontSize: 28, fontWeight: 700, color: C.ink }}>
                {filteredEntries.length}
              </div>
            </div>
          </div>
        )}

        {/* Entry list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {loading && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20, fontSize: 14, color: C.muted }}>
              <span style={{ width: 16, height: 16, borderRadius: "50%", border: "2px solid #7c5cfc", borderTopColor: "transparent", animation: "spin 0.8s linear infinite", display: "inline-block" }} />
              Loading digest…
            </div>
          )}

          {!loading && fetchError && (
            <div style={{ background: "#fef2f2", borderRadius: 14, padding: 16, fontSize: 14, color: "#b91c1c" }}>
              {fetchError}
            </div>
          )}

          {!loading && !fetchError && filteredEntries.length === 0 && (
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20, fontSize: 14, color: C.muted }}>
              No misconceptions found for the selected filters.
            </div>
          )}

          {!loading &&
            !fetchError &&
            filteredEntries.map((entry) => (
              <EntryRow key={entry.questionId} entry={entry} />
            ))}
        </div>
      </div>
    </div>
  );
}
