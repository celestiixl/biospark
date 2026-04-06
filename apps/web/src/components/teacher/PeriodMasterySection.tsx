"use client";

import * as React from "react";
import { usePeriodMastery } from "@/hooks/usePeriodMastery";
import { PeriodMasteryHeatmap } from "@/components/teacher/PeriodMasteryHeatmap";
import type { PeriodMasterySnapshot } from "@/types/period-mastery";

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function HeatmapSkeleton() {
  return (
    <div
      className="rounded-2xl border border-[rgba(0,0,0,0.06)] bg-white p-4"
      aria-busy="true"
      aria-label="Loading mastery data…"
    >
      {/* Fake header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="h-4 w-36 animate-pulse rounded-md bg-[rgba(0,0,0,0.07)]" />
        <div className="h-4 w-20 animate-pulse rounded-full bg-[rgba(0,0,0,0.07)]" />
      </div>
      {/* 3 fake rows */}
      {[0, 1, 2].map((i) => (
        <div key={i} className="mt-2 h-8 animate-pulse rounded-lg bg-[rgba(0,0,0,0.05)]" />
      ))}
    </div>
  );
}

// ─── Period selector pill ─────────────────────────────────────────────────────

function PeriodPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border px-3 py-1 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006e55]"
      style={{
        backgroundColor: active ? "#006e55" : "white",
        borderColor: active ? "#006e55" : "rgba(0,0,0,0.1)",
        color: active ? "white" : "#8aada0",
      }}
      aria-pressed={active}
    >
      {label}
    </button>
  );
}

// ─── PeriodMasterySection ────────────────────────────────────────────────────

/**
 * Standalone "use client" section that renders the Period Mastery Snapshot
 * panel on the teacher dashboard.
 *
 * - Fetches all periods once on mount via usePeriodMastery()
 * - Provides an "All Periods" selector + one pill per period
 * - Client-side filters the visible heatmaps based on the active selection
 * - Shows a loading skeleton (3 animated rows) while fetching
 * - Shows an inline error message on failure — never crashes the page
 */
export default function PeriodMasterySection() {
  // Always fetch all periods; we filter locally so we avoid extra network trips
  // when switching between period pills.
  const { snapshots, loading, error } = usePeriodMastery();

  // "all" means every period is shown; anything else is a specific periodId.
  const [selectedPeriodId, setSelectedPeriodId] = React.useState<string>("all");

  // Derive the visible subset.  If all periods have loaded and the user has
  // previously selected a period that no longer exists, fall back to "all".
  const visibleSnapshots = React.useMemo((): PeriodMasterySnapshot[] => {
    if (selectedPeriodId === "all") return snapshots;
    const match = snapshots.find((s) => s.periodId === selectedPeriodId);
    if (!match) return snapshots; // graceful fallback
    return [match];
  }, [snapshots, selectedPeriodId]);

  return (
    <section aria-labelledby="period-mastery-heading" className="mt-0">
      {/* ── Section heading ──────────────────────────────────────────────── */}
      <div className="mb-4">
        <h2
          id="period-mastery-heading"
          className="font-sans text-lg font-bold text-bs-ink"
        >
          Period Mastery Snapshot
        </h2>
        <p className="mt-0.5 text-sm text-bs-muted">
          Average TEKS mastery by class period
        </p>
      </div>

      {/* ── Period selector pills ─────────────────────────────────────────── */}
      {!loading && !error && snapshots.length > 0 && (
        <div
          className="mb-4 flex flex-wrap gap-2"
          role="group"
          aria-label="Filter by class period"
        >
          <PeriodPill
            label="All Periods"
            active={selectedPeriodId === "all"}
            onClick={() => setSelectedPeriodId("all")}
          />
          {snapshots.map((s) => (
            <PeriodPill
              key={s.periodId}
              label={s.periodLabel}
              active={selectedPeriodId === s.periodId}
              onClick={() => setSelectedPeriodId(s.periodId)}
            />
          ))}
        </div>
      )}

      {/* ── Loading state ─────────────────────────────────────────────────── */}
      {loading && (
        <div className="flex flex-col gap-4">
          <HeatmapSkeleton />
        </div>
      )}

      {/* ── Error state ───────────────────────────────────────────────────── */}
      {!loading && error && (
        <div
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          <span className="font-semibold">Could not load mastery data.</span>{" "}
          {error}
        </div>
      )}

      {/* ── Heatmaps ──────────────────────────────────────────────────────── */}
      {!loading && !error && (
        <div className="flex flex-col gap-4">
          {visibleSnapshots.length === 0 ? (
            <p className="text-sm text-bs-muted">No period data available.</p>
          ) : (
            visibleSnapshots.map((snapshot) => (
              <PeriodMasteryHeatmap key={snapshot.periodId} snapshot={snapshot} />
            ))
          )}
        </div>
      )}
    </section>
  );
}
