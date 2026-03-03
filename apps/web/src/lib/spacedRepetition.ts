"use client";

/**
 * Simplified SM-2 spaced repetition engine stored in localStorage.
 * Quality scale: 0–5 (0–2 = fail/repeat soon, 3–5 = pass/increase interval).
 */

export type ReviewRecord = {
  teksId: string;
  easeFactor: number; // starts at 2.5, min 1.3
  interval: number; // days until next review
  repetitions: number; // consecutive correct reps
  nextReviewAt: string; // ISO timestamp
  lastScore: number; // last quality score 0–5
  lastPracticed: string | null;
};

const SR_KEY = "sr_records_v1";

export function getReviewRecords(): Record<string, ReviewRecord> {
  try {
    const raw = localStorage.getItem(SR_KEY);
    return raw ? (JSON.parse(raw) as Record<string, ReviewRecord>) : {};
  } catch {
    return {};
  }
}

export function saveReviewRecords(records: Record<string, ReviewRecord>): void {
  try {
    localStorage.setItem(SR_KEY, JSON.stringify(records));
  } catch {}
}

/**
 * SM-2 update after a practice session for a single TEKS standard.
 * quality: 0 = total blank, 3 = hard recall, 5 = perfect.
 */
export function updateRecord(teksId: string, quality: number): ReviewRecord {
  const records = getReviewRecords();
  const prev = records[teksId];

  const ef = prev?.easeFactor ?? 2.5;
  const reps = prev?.repetitions ?? 0;

  // SM-2 ease factor update
  const newEF = Math.max(
    1.3,
    ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)),
  );

  let newInterval: number;
  let newReps: number;

  if (quality < 3) {
    // Failed: reset
    newInterval = 1;
    newReps = 0;
  } else {
    if (reps === 0) newInterval = 1;
    else if (reps === 1) newInterval = 6;
    else newInterval = Math.round((prev?.interval ?? 6) * newEF);
    newReps = reps + 1;
  }

  const nextReviewAt = new Date(
    Date.now() + newInterval * 24 * 60 * 60 * 1000,
  ).toISOString();

  const record: ReviewRecord = {
    teksId,
    easeFactor: newEF,
    interval: newInterval,
    repetitions: newReps,
    nextReviewAt,
    lastScore: quality,
    lastPracticed: new Date().toISOString(),
  };

  records[teksId] = record;
  saveReviewRecords(records);
  return record;
}

/**
 * Seed a TEKS record based on known proficiency (0–1).
 * Called when importing existing mastery data into the SR engine.
 */
export function seedFromMastery(teksId: string, masteryPct: number): void {
  const records = getReviewRecords();
  if (records[teksId]) return; // don't overwrite existing

  // Convert mastery to SM-2 quality (0–5)
  const quality = Math.round(masteryPct * 5);
  updateRecord(teksId, quality);
}

/** Returns TEKS IDs that are due for review (nextReviewAt <= now). */
export function getDueItems(teksIds: string[]): string[] {
  const records = getReviewRecords();
  const now = Date.now();
  return teksIds.filter((id) => {
    const rec = records[id];
    if (!rec) return true; // never reviewed = always due
    return new Date(rec.nextReviewAt).getTime() <= now;
  });
}

export type QueueItem = {
  teksId: string;
  daysOverdue: number;
  lastScore: number | null;
  interval: number;
  repetitions: number;
  nextReviewAt: string | null;
  neverReviewed: boolean;
};

/**
 * Returns all TEKS IDs sorted by review priority:
 * 1. Never reviewed
 * 2. Most overdue first
 * 3. Lowest ease factor (struggling)
 */
export function getReviewQueue(teksIds: string[]): QueueItem[] {
  const records = getReviewRecords();
  const now = Date.now();

  return teksIds
    .map((id): QueueItem => {
      const rec = records[id];
      if (!rec) {
        return {
          teksId: id,
          daysOverdue: 999,
          lastScore: null,
          interval: 0,
          repetitions: 0,
          nextReviewAt: null,
          neverReviewed: true,
        };
      }
      const msOverdue = now - new Date(rec.nextReviewAt).getTime();
      return {
        teksId: id,
        daysOverdue: Math.max(0, msOverdue / (1000 * 60 * 60 * 24)),
        lastScore: rec.lastScore,
        interval: rec.interval,
        repetitions: rec.repetitions,
        nextReviewAt: rec.nextReviewAt,
        neverReviewed: false,
      };
    })
    .sort((a, b) => b.daysOverdue - a.daysOverdue);
}

/** Human-readable "due in X days" or "overdue by X days". */
export function formatNextReview(nextReviewAt: string | null): string {
  if (!nextReviewAt) return "Due now";
  const ms = new Date(nextReviewAt).getTime() - Date.now();
  const days = Math.round(ms / (1000 * 60 * 60 * 24));
  if (days <= 0) return "Due now";
  if (days === 1) return "Due tomorrow";
  return `Due in ${days} days`;
}

/** Proficiency label from repetitions + last score. */
export function proficiencyLabel(rec: ReviewRecord | undefined): string {
  if (!rec || rec.repetitions === 0) return "Not started";
  if (rec.repetitions <= 1) return "Learning";
  if (rec.repetitions <= 3) return "Developing";
  if (rec.lastScore >= 4) return "Proficient";
  return "Reviewing";
}
