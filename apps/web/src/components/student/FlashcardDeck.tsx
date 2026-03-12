"use client";

import type { LearningLesson } from "@/lib/learningHubContent";
import { useFlashcards } from "@/hooks/useFlashcards";

// Types imported from the shared flashcard module — not redeclared here.
import type { Flashcard, FlashcardSession } from "@/types/flashcard"; // eslint-disable-line @typescript-eslint/no-unused-vars

// ---------------------------------------------------------------------------

export interface FlashcardDeckProps {
  lesson: LearningLesson;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function ProgressBar({
  mastered,
  total,
}: {
  mastered: number;
  total: number;
}) {
  const pct = total > 0 ? Math.round((mastered / total) * 100) : 0;

  return (
    <div className="w-full">
      {/* Track */}
      <div
        className="relative h-[6px] w-full overflow-hidden rounded-full"
        style={{ background: "#132638" }}
        role="progressbar"
        aria-valuenow={mastered}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label={`Flashcard progress: ${mastered} of ${total} terms mastered`}
      >
        {/* Fill */}
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: "#00d4aa" }}
        />
      </div>
      {/* Label */}
      <p
        className="mt-1.5 text-right font-mono text-[11px] text-bs-text-sub"
        aria-hidden="true"
      >
        {mastered} / {total} mastered
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------

function FlipCard({
  card,
  flipped,
  onFlip,
}: {
  card: Flashcard;
  flipped: boolean;
  onFlip: () => void;
}) {
  const ariaLabel = flipped
    ? `Back of flashcard for "${card.term}". Press Enter or Space to flip back.`
    : `Flashcard: front face showing the term "${card.term}". Press Enter or Space to see the definition.`;

  return (
    /* Scene — establishes the 3-D perspective context */
    <div
      className="mx-auto w-full px-4"
      style={{ maxWidth: "480px" }}
    >
      <div
        style={{ perspective: "1000px", height: "260px" }}
      >
        {/* Inner wrapper — rotates in 3-D space */}
        <div
          role="button"
          tabIndex={0}
          aria-label={ariaLabel}
          aria-pressed={flipped}
          className="relative h-full w-full cursor-pointer select-none rounded-[16px] transition-transform duration-[400ms] ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00d4aa]"
          style={{
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
          onClick={onFlip}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onFlip();
            }
          }}
        >
          {/* ── FRONT ─────────────────────────────────────────────── */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-[16px]"
            style={{
              background: "#132638",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              boxShadow:
                "0 4px 24px rgba(0,0,0,0.45), 0 0 0 1px rgba(30,63,90,0.6)",
            }}
          >
            <span className="font-sans text-[11px] uppercase tracking-[0.15em] text-bs-text-sub">
              TERM
            </span>
            <span className="px-6 text-center font-sans text-[28px] font-semibold leading-tight text-bs-text">
              {card.term}
            </span>
          </div>

          {/* ── BACK ──────────────────────────────────────────────── */}
          <div
            className="absolute inset-0 flex flex-col gap-3 rounded-[16px] p-6"
            style={{
              background: "#132638",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              boxShadow:
                "0 4px 24px rgba(0,0,0,0.45), 0 0 0 1px rgba(30,63,90,0.6)",
            }}
          >
            {/* Term reprise */}
            <span className="font-sans text-[18px] font-semibold text-bs-teal">
              {card.term}
            </span>

            {/* Placeholder definition */}
            <p className="font-sans text-sm italic text-bs-text-sub">
              Definition coming soon — use your notes or lesson sections to
              define this term.
            </p>

            {/* TEKS pills */}
            {card.teks.length > 0 && (
              <div className="mt-auto flex flex-wrap gap-1.5">
                {card.teks.map((code) => (
                  <span
                    key={code}
                    className="rounded-full px-2 py-0.5 font-sans text-[11px]"
                    style={{
                      background: "rgba(0,212,170,0.12)",
                      color: "#00d4aa",
                    }}
                  >
                    {code}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------

function ActionRow({
  flipped,
  onNeedsReview,
  onMastered,
}: {
  flipped: boolean;
  onNeedsReview: () => void;
  onMastered: () => void;
}) {
  return (
    /* Always rendered so the layout height is preserved; hidden via visibility. */
    <div
      className={`flex justify-center gap-3 ${flipped ? "visible" : "invisible"}`}
      aria-hidden={!flipped}
    >
      <button
        onClick={onNeedsReview}
        disabled={!flipped}
        tabIndex={flipped ? 0 : -1}
        className="rounded-lg px-5 py-[10px] font-sans text-[14px] transition-all hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00d4aa]"
        style={{
          background: "rgba(255,107,107,0.15)",
          color: "#ff6b6b",
          border: "1px solid rgba(255,107,107,0.3)",
        }}
        aria-label="Mark this term as needing more review — it will reappear later"
      >
        Need to review
      </button>

      <button
        onClick={onMastered}
        disabled={!flipped}
        tabIndex={flipped ? 0 : -1}
        className="rounded-lg px-5 py-[10px] font-sans text-[14px] transition-all hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00d4aa]"
        style={{
          background: "rgba(0,212,170,0.15)",
          color: "#00d4aa",
          border: "1px solid rgba(0,212,170,0.3)",
        }}
        aria-label="Mark this term as mastered — it will be removed from the queue"
      >
        Got it ✓
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------

function CompletionState({
  total,
  lessonTitle,
  onRestart,
}: {
  total: number;
  lessonTitle: string;
  onRestart: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-4 py-12 text-center">
      {/* Teal checkmark */}
      <svg
        aria-hidden="true"
        width="56"
        height="56"
        viewBox="0 0 56 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="28" cy="28" r="28" fill="rgba(0,212,170,0.15)" />
        <path
          d="M16 28.5L24 37L40 21"
          stroke="#00d4aa"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <h3 className="font-sans text-[22px] font-semibold text-bs-text">
        All terms mastered!
      </h3>

      <p className="font-sans text-sm text-bs-text-sub">
        {total} content-specific term{total !== 1 ? "s" : ""} from{" "}
        <span className="text-bs-text">{lessonTitle}</span>
      </p>

      <button
        onClick={onRestart}
        className="mt-2 rounded-lg border border-bs-teal/40 px-5 py-2.5 font-sans text-[14px] text-bs-teal transition-all hover:bg-[rgba(0,212,170,0.1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00d4aa]"
        aria-label="Shuffle cards and restart the flashcard session from the beginning"
      >
        Shuffle &amp; restart
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------

function EmptyState() {
  return (
    <p className="py-8 text-center font-sans text-[14px] text-bs-text-muted">
      No vocabulary terms available for this lesson yet.
    </p>
  );
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export function FlashcardDeck({ lesson }: FlashcardDeckProps) {
  const terms = lesson.vocabularyTiers?.contentSpecific ?? [];

  const { currentCard, isComplete, flip, markMastered, markNeedsReview, restart, progress, session } =
    useFlashcards(lesson.slug, lesson);

  if (terms.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="flex w-full flex-col gap-6">
      {/* 1. Progress Bar */}
      <ProgressBar mastered={progress.mastered} total={progress.total} />

      {/* 2. Flashcard / Completion */}
      {isComplete ? (
        <CompletionState
          total={progress.total}
          lessonTitle={lesson.title}
          onRestart={restart}
        />
      ) : (
        <>
          {currentCard && (
            <FlipCard card={currentCard} flipped={session.flipped} onFlip={flip} />
          )}

          {/* 3. Action Row */}
          <ActionRow
            flipped={session.flipped}
            onNeedsReview={markNeedsReview}
            onMastered={markMastered}
          />
        </>
      )}
    </div>
  );
}
