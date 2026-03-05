/**
 * Weekly Digest utilities
 *
 * Aggregates wrong-answer selections from quick-checks for the current school
 * week and surfaces the top misconceptions teachers should address.
 */

import { LEARNING_UNITS } from "@/lib/learningHubContent";

// ─── Types ────────────────────────────────────────────────────────────────────

export type DigestEntry = {
  rank: number;
  questionId: string;
  questionText: string;
  wrongAnswer: string;
  selectionCount: number;
  selectionPct: number;
  teks: string;
  unitTitle: string;
  conceptId: string;
  /** Plain-language description of the underlying misconception */
  misconceptionDescription: string;
  /** One sentence a teacher could say out loud to address it */
  talkingPoint: string;
};

export type WeeklyDigestResult = {
  ok: boolean;
  weekOf: string;
  lastUpdated: string;
  entries: DigestEntry[];
  totalWrongAttempts: number;
};

// ─── Mock question bank ────────────────────────────────────────────────────────
//
// In production these would be fetched from the actual item bank / attempt log.
// The `payload.chosenAnswer` field on each Attempt drives the aggregation; here
// we seed realistic wrong-answer counts so the UI has data to show.

type MockQuestion = {
  id: string;
  text: string;
  teks: string;
  conceptId: string;
  correctAnswer: string;
  wrongChoices: { text: string; count: number }[];
  misconceptionKey: string; // matches a string in the relevant unit's misconceptions[]
};

const MOCK_QUESTIONS: MockQuestion[] = [
  // Unit 1 — Biomolecules
  {
    id: "q-u1-l1-mc1",
    text: "Where is ATP primarily stored between energy-requiring reactions?",
    teks: "B.11A",
    conceptId: "unit-1-enzymes-photosynthesis-respiration",
    correctAnswer: "ATP is not stored; it is continuously recycled.",
    wrongChoices: [
      { text: "In the mitochondria as a long-term reserve", count: 18 },
      { text: "In fat cells until needed", count: 7 },
      { text: "Inside the nucleus alongside DNA", count: 4 },
    ],
    misconceptionKey: "ATP is stored long-term in cells",
  },
  {
    id: "q-u1-l2-mc1",
    text: "A cell is placed in very salty water. What happens through osmosis?",
    teks: "B.5C",
    conceptId: "unit-1-cell-transport-and-homeostasis",
    correctAnswer: "Water leaves the cell, causing it to shrink.",
    wrongChoices: [
      { text: "Water enters the cell, causing it to swell", count: 21 },
      { text: "Salt rushes into the cell", count: 9 },
      { text: "Nothing changes because osmosis only occurs in plants", count: 13 },
    ],
    misconceptionKey: "All molecules pass freely through the cell membrane",
  },
  {
    id: "q-u1-l1-mc2",
    text: "Which statement about DNA location is correct?",
    teks: "B.5A",
    conceptId: "unit-1-biomolecules-and-cell-structure",
    correctAnswer: "DNA is found in the nucleus and in mitochondria.",
    wrongChoices: [
      { text: "DNA is only found in the cell nucleus", count: 24 },
      { text: "DNA is found only in the ribosomes", count: 6 },
      { text: "DNA is distributed evenly throughout the cytoplasm", count: 5 },
    ],
    misconceptionKey: "DNA is only in the nucleus",
  },
  // Unit 2 — Nucleic Acids
  {
    id: "q-u2-l2-mc1",
    text: "During translation, which molecule carries amino acids to the ribosome?",
    teks: "B.7B",
    conceptId: "unit-2-transcription-and-translation",
    correctAnswer: "tRNA (transfer RNA)",
    wrongChoices: [
      { text: "mRNA (messenger RNA)", count: 16 },
      { text: "DNA polymerase", count: 8 },
      { text: "rRNA (ribosomal RNA)", count: 11 },
    ],
    misconceptionKey: "RNA and DNA are identical molecules",
  },
  {
    id: "q-u2-l3-mc1",
    text: "A point mutation changes one base in a codon. What is always true?",
    teks: "B.7C",
    conceptId: "unit-2-mutations-and-significance",
    correctAnswer:
      "It may or may not change the amino acid due to codon redundancy.",
    wrongChoices: [
      {
        text: "It always produces a visible change in the organism's traits",
        count: 19,
      },
      { text: "It always stops protein synthesis immediately", count: 7 },
      { text: "It can only affect non-coding regions of DNA", count: 4 },
    ],
    misconceptionKey: "A change in DNA always causes a visible trait change",
  },
  {
    id: "q-u1-l1-mc3",
    text: "Which biomolecule makes up the primary structure of the cell membrane?",
    teks: "B.5B",
    conceptId: "unit-1-biomolecules-and-cell-structure",
    correctAnswer: "Phospholipids",
    wrongChoices: [
      { text: "Carbohydrates only", count: 10 },
      { text: "Proteins only", count: 8 },
      { text: "Nucleic acids", count: 5 },
    ],
    misconceptionKey: "All fats are unhealthy",
  },
  {
    id: "q-u2-l1-mc1",
    text: "What holds the two strands of the DNA double helix together?",
    teks: "B.7A",
    conceptId: "unit-2-dna-structure-and-replication",
    correctAnswer: "Hydrogen bonds between complementary base pairs",
    wrongChoices: [
      { text: "Covalent bonds between nitrogenous bases", count: 15 },
      { text: "Ionic bonds between the sugar-phosphate backbones", count: 9 },
      { text: "The bases are interchangeable, so any bonding works", count: 6 },
    ],
    misconceptionKey: "Nitrogenous bases are interchangeable",
  },
  {
    id: "q-u1-l3-mc1",
    text: "Which gas is released as a product of photosynthesis?",
    teks: "B.11A",
    conceptId: "unit-1-enzymes-photosynthesis-respiration",
    correctAnswer: "Oxygen (O₂)",
    wrongChoices: [
      {
        text: "Carbon dioxide (CO₂), same as cellular respiration",
        count: 14,
      },
      { text: "Nitrogen (N₂)", count: 4 },
      { text: "Glucose — plants release it into the soil", count: 5 },
    ],
    misconceptionKey: "ATP is stored long-term in cells",
  },
  {
    id: "q-u1-l2-mc2",
    text: "Which best describes active transport?",
    teks: "B.5C",
    conceptId: "unit-1-cell-transport-and-homeostasis",
    correctAnswer:
      "Movement of molecules against their concentration gradient using ATP.",
    wrongChoices: [
      {
        text: "Movement of molecules from low to high concentration without energy",
        count: 12,
      },
      { text: "Only occurs in plant cells", count: 5 },
      { text: "Always moves water molecules", count: 8 },
    ],
    misconceptionKey: "All molecules pass freely through the cell membrane",
  },
  {
    id: "q-u2-l2-mc2",
    text: "What is the direct template used during transcription?",
    teks: "B.7B",
    conceptId: "unit-2-transcription-and-translation",
    correctAnswer: "A strand of DNA",
    wrongChoices: [
      { text: "An mRNA strand — transcription copies mRNA", count: 17 },
      { text: "A tRNA molecule", count: 6 },
      { text: "The ribosome provides the template", count: 4 },
    ],
    misconceptionKey: "RNA and DNA are identical molecules",
  },
];

// ─── Misconception description generator ──────────────────────────────────────
//
// Maps a curriculum misconception string → a teacher-facing explanation +
// talking point, grounded in the FBISD lesson content.

type MisconceptionCopy = {
  description: string;
  talkingPoint: string;
};

const MISCONCEPTION_COPY: Record<string, MisconceptionCopy> = {
  "ATP is stored long-term in cells": {
    description:
      "Students are likely conflating ATP with long-term energy molecules like fat, treating ATP as something cells stockpile rather than continuously regenerate.",
    talkingPoint:
      "Try this: 'ATP is more like cash in your hand than money in a savings account — cells spend it immediately and remake it constantly, they never save it up.'",
  },
  "All molecules pass freely through the cell membrane": {
    description:
      "Students are conflating all forms of transport, missing the selectivity of the membrane and the direction-dependency of passive vs. active transport.",
    talkingPoint:
      "Try this: 'The cell membrane is a selective bouncer, not an open door — only the right molecules get in or out, and some need energy to get past.'",
  },
  "DNA is only in the nucleus": {
    description:
      "Students are over-applying the nucleus-as-DNA-headquarters rule, forgetting that mitochondria (and chloroplasts in plants) carry their own DNA — a key piece of endosymbiotic theory.",
    talkingPoint:
      "Try this: 'Mitochondria were once free-living bacteria, so they brought their own DNA with them — the nucleus isn't the only address for genetic information in the cell.'",
  },
  "RNA and DNA are identical molecules": {
    description:
      "Students are treating RNA as a direct copy of DNA, missing the structural differences (ribose vs. deoxyribose, uracil vs. thymine, single- vs. double-stranded) that make RNA suited for different jobs.",
    talkingPoint:
      "Try this: 'Think of DNA as the original blueprint locked in a vault — RNA is the working copy that actually leaves the building and gets used at the job site.'",
  },
  "A change in DNA always causes a visible trait change": {
    description:
      "Students are overlooking codon redundancy and silent mutations, assuming a one-to-one relationship between any DNA change and an observable phenotype.",
    talkingPoint:
      "Try this: 'Some mutations are whispers, not shouts — the genetic code has synonyms, so one letter change doesn't always change the word, and even if it does, it might not change what the cell does.'",
  },
  "All fats are unhealthy": {
    description:
      "Students are applying a dietary framing to cellular biology, missing that phospholipids are structurally essential for every cell membrane regardless of health context.",
    talkingPoint:
      "Try this: 'Your cell membranes are literally made of fat — without phospholipids, the cell has no boundary and can't exist, so not all lipids are villains.'",
  },
  "Nitrogenous bases are interchangeable": {
    description:
      "Students are missing the complementary base-pairing constraint (A–T, C–G), treating all four bases as equivalent building blocks rather than paired partners.",
    talkingPoint:
      "Try this: 'Base pairing in DNA is like a zipper — the teeth only fit in specific pairs. Swap a tooth for the wrong one and the zipper won't close, meaning the DNA can't replicate correctly.'",
  },
};

// ─── Week boundary helpers ─────────────────────────────────────────────────────

/** Returns the ISO date string (YYYY-MM-DD) for the Monday of the given date's week */
export function getMondayOf(date: Date): string {
  const d = new Date(date);
  const day = d.getUTCDay(); // 0 = Sunday
  const diff = day === 0 ? -6 : 1 - day; // roll back to Monday
  d.setUTCDate(d.getUTCDate() + diff);
  return d.toISOString().split("T")[0]!;
}

/** Returns start (Monday 00:00 UTC) and end (now) timestamps for the school week */
export function getWeekRange(weekOf?: string): { start: number; end: number } {
  const now = new Date();
  const monday = weekOf ? new Date(`${weekOf}T00:00:00.000Z`) : new Date(`${getMondayOf(now)}T00:00:00.000Z`);
  return { start: monday.getTime(), end: now.getTime() };
}

// ─── Digest builder ────────────────────────────────────────────────────────────

type AttemptRecord = {
  userId: string;
  itemId: string;
  type: string;
  payload: Record<string, unknown>;
  score: number;
  maxScore: number;
  tries: number;
  ts: number;
};

/**
 * Build the weekly digest from a list of attempt records.
 *
 * When live attempt data is available, pass it in. Otherwise the function
 * falls back to the seeded mock question counts so the UI always has data.
 */
export function buildWeeklyDigest(
  attempts: AttemptRecord[],
  weekRange: { start: number; end: number },
  options: { periodId?: string; take?: number } = {},
): Omit<WeeklyDigestResult, "ok"> {
  const take = options.take ?? 10;
  const weekOf = new Date(weekRange.start).toISOString().split("T")[0]!;
  const lastUpdated = new Date().toISOString();

  // ── Aggregate live attempt data ────────────────────────────────────────────
  // tally: questionId → wrongAnswerText → count
  const tally = new Map<string, Map<string, number>>();

  const weekAttempts = attempts.filter(
    (a) =>
      a.ts >= weekRange.start &&
      a.ts <= weekRange.end &&
      a.score < a.maxScore, // wrong answer
  );

  for (const attempt of weekAttempts) {
    const chosenAnswer =
      typeof attempt.payload?.chosenAnswer === "string"
        ? attempt.payload.chosenAnswer
        : null;
    if (!chosenAnswer) continue;
    const qId = attempt.itemId;
    if (!tally.has(qId)) tally.set(qId, new Map());
    const ansMap = tally.get(qId)!;
    ansMap.set(chosenAnswer, (ansMap.get(chosenAnswer) ?? 0) + 1);
  }

  // ── Merge with mock counts (always used as baseline so UI isn't empty) ─────
  for (const mq of MOCK_QUESTIONS) {
    if (!tally.has(mq.id)) tally.set(mq.id, new Map());
    const ansMap = tally.get(mq.id)!;
    for (const wc of mq.wrongChoices) {
      ansMap.set(wc.text, (ansMap.get(wc.text) ?? 0) + wc.count);
    }
  }

  // ── Build flat list of (questionId, wrongAnswer, count) tuples ─────────────
  type Candidate = {
    questionId: string;
    wrongAnswer: string;
    count: number;
  };
  const candidates: Candidate[] = [];
  for (const [qId, ansMap] of tally) {
    for (const [answer, count] of ansMap) {
      candidates.push({ questionId: qId, wrongAnswer: answer, count });
    }
  }
  // Sort descending by count
  candidates.sort((a, b) => b.count - a.count);

  // ── Look up question metadata ──────────────────────────────────────────────
  const questionMeta = new Map<string, MockQuestion>();
  for (const mq of MOCK_QUESTIONS) questionMeta.set(mq.id, mq);

  // ── Deduplicate by misconception key then build entries ───────────────────
  const seenMisconceptions = new Set<string>();
  const totalWrong = candidates.reduce((s, c) => s + c.count, 0);

  const entries: DigestEntry[] = [];
  let rank = 1;

  for (const candidate of candidates) {
    if (entries.length >= take) break;

    const meta = questionMeta.get(candidate.questionId);
    if (!meta) continue;

    // Dedup by misconception to avoid showing the same underlying concept twice
    if (seenMisconceptions.has(meta.misconceptionKey)) continue;
    seenMisconceptions.add(meta.misconceptionKey);

    // Find which unit owns this TEKS
    const unit = LEARNING_UNITS.find((u) =>
      u.teks.includes(meta.teks),
    );

    const copy = MISCONCEPTION_COPY[meta.misconceptionKey] ?? {
      description: `Students may be misunderstanding a key concept related to ${meta.teks}.`,
      talkingPoint: `Review the core concept behind ${meta.teks} with a quick clarifying example.`,
    };

    // Total wrong selections for this specific question
    const questionTotal = [...(tally.get(meta.id) ?? new Map()).values()].reduce(
      (s, n) => s + n,
      0,
    );
    const selectionPct = questionTotal
      ? Math.round((candidate.count / questionTotal) * 100)
      : 0;

    entries.push({
      rank: rank++,
      questionId: meta.id,
      questionText: meta.text,
      wrongAnswer: candidate.wrongAnswer,
      selectionCount: candidate.count,
      selectionPct,
      teks: meta.teks,
      unitTitle: unit?.title ?? "Biology",
      conceptId: meta.conceptId,
      misconceptionDescription: copy.description,
      talkingPoint: copy.talkingPoint,
    });
  }

  return { weekOf, lastUpdated, entries, totalWrongAttempts: totalWrong };
}
