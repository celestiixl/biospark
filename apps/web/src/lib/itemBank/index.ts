// Client-side utilities for the private teacher item bank (localStorage-based).
// Server-side loading lives in ./load.ts (Node fs); do NOT import it here.

export type { Item, ItemBank, ItemType, Difficulty } from "./schema";

// ─── Private Bank Types ──────────────────────────────────────────────────────

/** A question saved by a teacher to their private item bank. */
export type PrivateQuestion = {
  id: string;
  type: string;
  teks: string[];
  learningLevel?: string;
  stem?: string;
  prompt?: string;
  [key: string]: unknown;
};

export type ItemBankEntry = {
  id: string;
  question: PrivateQuestion;
  createdAt: string;
  usageCount: number;
};

// ─── Storage Key Helpers ─────────────────────────────────────────────────────

function privateBankKey(teacherId: string): string {
  return `biospark:item-bank:private:${teacherId}`;
}

const REVIEW_QUEUE_KEY = "biospark:item-bank:review";

// ─── Private Bank CRUD ───────────────────────────────────────────────────────

export function getPrivateBank(teacherId: string): ItemBankEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(privateBankKey(teacherId));
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as ItemBankEntry[]) : [];
  } catch {
    return [];
  }
}

export function saveItemBank(
  entries: ItemBankEntry[],
  teacherId: string,
): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(privateBankKey(teacherId), JSON.stringify(entries));
}

// ─── Review Queue ────────────────────────────────────────────────────────────

type ReviewEntry = {
  question: PrivateQuestion;
  teacherId: string;
  submittedAt: string;
};

export function submitForReview(
  question: PrivateQuestion,
  teacherId: string,
): void {
  if (typeof window === "undefined") return;
  let queue: ReviewEntry[] = [];
  try {
    const parsed: unknown = JSON.parse(
      localStorage.getItem(REVIEW_QUEUE_KEY) ?? "[]",
    );
    queue = Array.isArray(parsed) ? (parsed as ReviewEntry[]) : [];
  } catch {
    queue = [];
  }
  queue.push({ question, teacherId, submittedAt: new Date().toISOString() });
  localStorage.setItem(REVIEW_QUEUE_KEY, JSON.stringify(queue));
}
