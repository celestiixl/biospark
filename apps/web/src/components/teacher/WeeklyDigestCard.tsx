"use client";

import * as React from "react";
import Link from "next/link";
import type { DigestEntry } from "@/lib/weeklyDigest";

// ── Design tokens (inline hex to guarantee rendering in Tailwind v4) ─────────
const D = {
  ink:        "#0a1a14",
  muted:      "#8aada0",
  surface:    "#ffffff",
  amberSoft:  "#fff5d6",
  amberText:  "#8a5e00",
  amber:      "#f5a800",
  coral:      "#c02a10",
  coralSoft:  "rgba(255,79,43,0.08)",
  purple:     "#4a2fc0",
  tealDark:   "#006e55",
  border:     "rgba(0,0,0,0.07)",
} as const;

// ─── Types ────────────────────────────────────────────────────────────────────

type DigestCardProps = {
  /** Limit entries shown; defaults to 3 for the dashboard card */
  take?: number;
  /** When true, shows the "View full digest" footer link */
  showFooter?: boolean;
};

// ─── Single misconception row ─────────────────────────────────────────────────

function EntryRow({ entry }: { entry: DigestEntry }) {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <div style={{
      background: D.surface,
      border: `1px solid ${D.border}`,
      borderRadius: 12,
      padding: 16,
    }}>
      {/* Header row */}
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              width: 24, height: 24, borderRadius: "50%", flexShrink: 0,
              background: D.amberSoft, border: `1px solid rgba(245,168,0,0.25)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, fontWeight: 700, color: D.amberText,
            }}
            aria-label={`Rank ${entry.rank}`}
          >
            {entry.rank}
          </span>
          <span style={{ background: "rgba(0,110,85,0.12)", color: D.tealDark, fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 20 }} aria-label={`TEKS ${entry.teks}`}>
            {entry.teks}
          </span>
          <span style={{ fontSize: 11, color: D.muted }}>{entry.unitTitle}</span>
        </div>
        <span
          style={{ background: "rgba(192,42,16,0.1)", color: D.coral, fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 20 }}
          aria-label={`${entry.selectionPct}% of wrong attempts chose this answer`}
        >
          {entry.selectionPct}% chose it
        </span>
      </div>

      {/* Question + wrong answer */}
      <p style={{ fontSize: 13, fontWeight: 500, color: D.ink, marginTop: 10, marginBottom: 4 }}>{entry.questionText}</p>
      <p style={{ fontSize: 13, color: D.coral, marginBottom: 6 }}>
        <span style={{ fontWeight: 700 }}>Wrong answer: </span>
        {entry.wrongAnswer}
      </p>

      {/* Misconception description */}
      <p style={{ fontSize: 12, color: D.muted, marginBottom: 6 }}>
        {entry.misconceptionDescription}
      </p>

      {/* Talking point — toggleable */}
      <button
        type="button"
        style={{ background: "none", border: "none", padding: 0, fontSize: 11, fontWeight: 700, color: D.purple, cursor: "pointer", textDecoration: "underline", textDecorationStyle: "dotted" }}
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
      >
        {expanded ? "Hide talking point ↑" : "Show talking point ↓"}
      </button>

      {expanded && (
        <div
          style={{ marginTop: 8, borderRadius: 10, border: "1px solid rgba(245,168,0,0.25)", background: "rgba(245,168,0,0.06)", padding: 12, fontSize: 12, color: D.amberText }}
          role="note"
          aria-label="Suggested talking point"
        >
          {entry.talkingPoint}
        </div>
      )}
    </div>
  );
}

// ─── Weekly Digest Card ───────────────────────────────────────────────────────

export default function WeeklyDigestCard({
  take = 3,
  showFooter = true,
}: DigestCardProps) {
  const [entries, setEntries] = React.useState<DigestEntry[]>([]);
  const [weekOf, setWeekOf] = React.useState<string>("");
  const [lastUpdated, setLastUpdated] = React.useState<string>("");
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    setLoading(true);

    fetch(`/api/teacher/weekly-digest?take=${take}`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (data.ok) {
          setEntries(data.entries ?? []);
          setWeekOf(data.weekOf ?? "");
          setLastUpdated(data.lastUpdated ?? "");
        } else {
          setError(data.error ?? "Failed to load digest");
        }
      })
      .catch(() => {
        if (!cancelled) setError("Failed to load digest");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [take]);

  const formattedDate = lastUpdated
    ? new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }).format(new Date(lastUpdated))
    : null;

  return (
    <div style={{ background: D.amberSoft, border: "1px solid rgba(245,168,0,0.2)", borderRadius: 16, padding: 20 }}>
      {/* Card header */}
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 16 }}>
        <div>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: D.amberText, marginBottom: 4 }}>
            Weekly Digest
          </p>
          <h2 style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: 18, fontWeight: 700, color: D.amberText, margin: "0 0 2px" }}>
            Worth five minutes this week
          </h2>
          <p style={{ fontSize: 12, color: D.amberText, opacity: 0.75, margin: 0 }}>
            Top misconceptions to address before next class
          </p>
        </div>
        {weekOf && (
          <span style={{ background: "rgba(138,94,0,0.1)", border: "1px solid rgba(138,94,0,0.15)", borderRadius: 20, padding: "4px 12px", fontSize: 11, color: D.amberText }}>
            Week of {weekOf}
          </span>
        )}
      </div>

      {/* Body */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {loading && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: D.muted }}>
            <span style={{ width: 14, height: 14, borderRadius: "50%", border: `2px solid ${D.amber}`, borderTopColor: "transparent", animation: "spin 0.7s linear infinite", display: "inline-block" }} />
            Loading digest…
          </div>
        )}

        {!loading && error && (
          <div style={{ background: "#fff1f0", borderRadius: 10, padding: 12, fontSize: 13, color: D.coral }}>
            {error}
          </div>
        )}

        {!loading && !error && entries.length === 0 && (
          <div style={{ fontSize: 13, color: D.muted }}>No wrong-answer data yet this week.</div>
        )}

        {!loading && !error && entries.map((entry) => <EntryRow key={entry.questionId} entry={entry} />)}
      </div>

      {/* Footer */}
      {showFooter && !loading && !error && entries.length > 0 && (
        <div style={{ marginTop: 14, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {formattedDate && (
            <span style={{ fontSize: 11, color: D.amberText, opacity: 0.7 }}>Last updated {formattedDate}</span>
          )}
          <Link
            href="/teacher/learning-analytics/weekly-digest"
            style={{ background: D.amberText, color: "white", borderRadius: 10, padding: "7px 14px", fontSize: 12, fontWeight: 600, textDecoration: "none" }}
          >
            Full digest →
          </Link>
        </div>
      )}
    </div>
  );
}
