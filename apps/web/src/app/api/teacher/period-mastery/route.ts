import { NextRequest } from "next/server";
import { computePeriodMastery } from "@/lib/computePeriodMastery";
import type {
  StudentMasteryEntry,
  PeriodMasterySnapshot,
} from "@/types/period-mastery";

// TODO: Add teacher-role auth check once a server-side session/auth layer is
// wired up. For now the /api/teacher/* namespace is treated as internal only.
// See apps/web/src/lib/teacherAuth.ts for the demo auth store reference.

export const runtime = "nodejs";

// ─── Period metadata ──────────────────────────────────────────────────────────

const PERIOD_LABELS: Record<string, string> = {
  "period-1": "Period 1 — 8:00 AM",
  "period-2": "Period 2 — 9:00 AM",
  "period-3": "Period 3 — 10:00 AM",
  "period-4": "Period 4 — 11:00 AM",
};

const ALL_PERIOD_IDS = Object.keys(PERIOD_LABELS).sort();

// ─── Mock student mastery data ────────────────────────────────────────────────
//
// In production this would be fetched from the mastery store (mirroring the
// pattern used by /api/mastery — see apps/web/src/app/api/mastery/route.ts).
// For now we generate a deterministic mock so the UI always has data.

const TEKS_CODES = [
  "B.5A",
  "B.5B",
  "B.5C",
  "B.7A",
  "B.7B",
  "B.7C",
  "B.11A",
  "B.11B",
];

const STUDENTS_PER_PERIOD = 25;

/**
 * Generate a stable numeric hash for a string (djb2-lite variant).
 * Used to produce deterministic mock scores without external dependencies.
 */
function stableHash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) >>> 0;
  }
  return h;
}

/**
 * Build a deterministic mock dataset of StudentMasteryEntry records.
 *
 * Each (period, student, teks) triple produces a stable score in [0, 1] and
 * an attempt count derived from the same hash so results are reproducible
 * across requests without a real data store.
 */
function buildMockEntries(): StudentMasteryEntry[] {
  const entries: StudentMasteryEntry[] = [];
  const now = Date.now();

  for (const periodId of ALL_PERIOD_IDS) {
    for (let sIdx = 0; sIdx < STUDENTS_PER_PERIOD; sIdx++) {
      const studentId = `${periodId}-student-${String(sIdx + 1).padStart(2, "0")}`;

      for (const teks of TEKS_CODES) {
        const seed = stableHash(`${periodId}:${studentId}:${teks}`);
        // Score: use low 10 bits mapped to [0, 1] with two decimal places
        const raw = (seed & 0x3ff) / 0x3ff;
        const score = Math.round(raw * 100) / 100;
        // attemptCount: 1 or 2 (heavier weight toward 1)
        const attemptCount = (seed >> 10) % 3 === 0 ? 2 : 1;
        // Spread lastUpdated across the past 30 days
        const ageMs = ((seed >> 12) % (30 * 24 * 60 * 60 * 1000));
        const lastUpdated = now - ageMs;

        entries.push({
          studentId,
          periodId,
          teks,
          score,
          attemptCount,
          lastUpdated,
        });
      }
    }
  }

  return entries;
}

// ─── Route handler ────────────────────────────────────────────────────────────

/**
 * GET /api/teacher/period-mastery
 *
 * Query params:
 *   periodId  — optional; if omitted all periods are returned
 *
 * Returns PeriodMasterySnapshot[] sorted by periodId ascending.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const periodIdParam = searchParams.get("periodId") ?? undefined;

    // Determine which period(s) to compute
    const targetPeriodIds = periodIdParam
      ? [periodIdParam]
      : ALL_PERIOD_IDS;

    // Validate the requested periodId if provided
    if (periodIdParam && !PERIOD_LABELS[periodIdParam]) {
      return Response.json(
        { error: `Unknown periodId: ${periodIdParam}` },
        { status: 400 },
      );
    }

    // TODO: Replace with real mastery data source once persistence is wired.
    // Follow the same pattern as GET /api/mastery — query the mastery store
    // for all students assigned to the requested period(s).
    const allEntries = buildMockEntries();

    // targetPeriodIds is derived from ALL_PERIOD_IDS (already sorted ascending)
    // or is a single-element array, so the resulting snapshots are already in
    // ascending periodId order.
    const snapshots: PeriodMasterySnapshot[] = targetPeriodIds.map((pid) =>
      computePeriodMastery(allEntries, pid, PERIOD_LABELS[pid]!),
    );

    return Response.json({ ok: true, snapshots });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
