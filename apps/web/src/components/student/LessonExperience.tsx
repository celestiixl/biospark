"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useLessonProgress } from "@/hooks/useLessonProgress";
import Link from "next/link";
import type {
  ExplanationSection,
  LearningLesson,
  LearningUnit,
  LessonSection,
  QuickCheck,
} from "@/lib/learningHubContent";
import {
  interventionStrategyForTier,
  interventionTierFromCheck,
  type LearningLevel,
} from "@/lib/curriculumPolicy";
import {
  addLessonTime,
  getLessonProgress,
  updateLessonProgress,
} from "@/lib/learningProgress";
import PhenomenonBanner from "@/components/student/PhenomenonBanner";
import { getPhenomenonForLesson } from "@/lib/texasPhenomena";
import LessonNotebook from "@/components/student/LessonNotebook";
import LessonCompletionScreen from "@/components/student/LessonCompletionScreen";
import { useStudentAuth } from "@/lib/studentAuth";
import { speakText, stopSpeaking } from "@/lib/accommodations";
import { useAccommodations } from "@/lib/useAccommodations";

const HOOK_DISMISSED_KEY = "biospark.hook.dismissed.v1";

/** Returns a stable string key for any LessonSection variant. */
function getSectionKey(section: LessonSection, index: number): string {
  if (section.type === "misconception-spotlight")
    return `misconception-${index}-${section.misconception.slice(0, 20)}`;
  if (section.type === "vocabulary-spotlight") return `vocab-spotlight-${index}`;
  if (section.type === "activity") return `activity-${index}-${section.heading}`;
  if ("heading" in section && section.heading)
    return `${section.heading}-${index}`;
  return `section-${index}`;
}

/** Returns readable plain text from any LessonSection for TTS / read-aloud. */
function getSectionText(section: LessonSection): string {
  if (!section.type || section.type === "explanation") {
    const s = section as ExplanationSection;
    return `${s.heading}. ${s.body.join(" ")}`;
  }
  if (section.type === "worked-example") {
    return `${section.heading}. ${section.scenario} ${section.steps.join(" ")} ${section.conclusion ?? ""}`;
  }
  if (section.type === "misconception-spotlight") {
    return `Common misconception: ${section.misconception}. Correction: ${section.correction}`;
  }
  if (section.type === "visual-diagram") {
    return `${section.heading}. ${section.description} ${section.elements.map((e) => `${e.label}: ${e.detail}`).join(". ")}`;
  }
  if (section.type === "vocabulary-spotlight") {
    return section.terms.map((t) => `${t.term}: ${t.definition}`).join(". ");
  }
  if (section.type === "activity") {
    return `${section.heading}. ${section.prompt}`;
  }
  return "";
}

type LessonExperienceProps = {
  unit: LearningUnit;
  lesson: LearningLesson;
  previousLesson: LearningLesson | null;
  nextLesson: LearningLesson | null;
};

type CheckQuestion = {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  teks: string;
  learningLevel: LearningLevel;
  conceptId: string;
  misconceptionTarget?: boolean;
  misconceptionDescription?: string;
};

function buildQuestions(
  unit: LearningUnit,
  lesson: LearningLesson,
): CheckQuestion[] {
  if (Array.isArray(lesson.quickChecks) && lesson.quickChecks.length) {
    return lesson.quickChecks.map((row: QuickCheck) => ({ ...row }));
  }

  const keyTerms = lesson.keyTerms.length ? lesson.keyTerms : ["concept"];
  const firstTerm = keyTerms[0] ?? "concept";
  const secondTerm = keyTerms[1] ?? "evidence";
  const teks = unit.teks[0] ?? "B.5A";
  const conceptId = `${unit.id}-${lesson.slug}`;
  const misconceptionDescription =
    unit.misconceptions[0] ?? "Common misconception";

  return [
    {
      id: "q1",
      question: "Which term is a key focus of this lesson?",
      options: [firstTerm, secondTerm, "None of these", "Random guess"],
      correctAnswer: firstTerm,
      teks,
      learningLevel: "developing",
      conceptId,
      misconceptionTarget: true,
      misconceptionDescription,
    },
    {
      id: "q2",
      question: "What is this lesson format?",
      options: ["Reading", "Lecture", "Notes", "Assessment"],
      correctAnswer: lesson.type,
      teks,
      learningLevel: "progressing",
      conceptId,
    },
    {
      id: "q3",
      question: "How should you unlock the next lesson?",
      options: [
        "Finish reading and score at least 70%",
        "Only click Next",
        "Skip all sections",
        "Close the page",
      ],
      correctAnswer: "Finish reading and score at least 70%",
      teks,
      learningLevel: "proficient",
      conceptId,
    },
  ];
}

export default function LessonExperience({
  unit,
  lesson,
  previousLesson,
  nextLesson,
}: LessonExperienceProps) {
  const router = useRouter();
  const { acc } = useAccommodations();
  const student = useStudentAuth((s) => s.student);
  const {
    completedSections,
    lastSectionId,
    markSectionComplete,
    markLessonComplete: markLessonProgressComplete,
  } = useLessonProgress(lesson.slug);
  // Ref map: section heading → article DOM element (for scroll-restore).
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const questions = useMemo(() => buildQuestions(unit, lesson), [lesson, unit]);
  const [language, setLanguage] = useState<"en" | "es">("en");
  const [dyslexiaMode, setDyslexiaMode] = useState(false);
  const [hookDismissed, setHookDismissed] = useState(false);
  const [sectionChecks, setSectionChecks] = useState<Record<string, boolean>>(
    {},
  );
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [questionResults, setQuestionResults] = useState<
    Record<string, { correct: boolean }>
  >({});
  const [interventionTier, setInterventionTier] = useState<2 | 3 | null>(null);
  const [showCompletion, setShowCompletion] = useState(false);

  useEffect(() => {
    const saved = getLessonProgress(lesson.id);
    const baseline: Record<string, boolean> = {};
    lesson.sections.forEach((section, idx) => {
      const key = getSectionKey(section, idx);
      // FIX 5: load per-section read state from the new per-section key first
      const perKey = `biospark:lesson:${lesson.slug}:section:${key}:read`;
      try {
        const storedVal = localStorage.getItem(perKey);
        if (storedVal !== null) {
          baseline[key] = storedVal === "true";
          return;
        }
      } catch { /* ignore */ }
      // Fall back to lesson-level progress
      baseline[key] = Boolean(saved?.percent === 100);
    });
    setSectionChecks(baseline);
    if (typeof saved?.checkScore === "number") {
      setScore(saved.checkScore);
      setSubmitted(true);
    }

    const start = Date.now();
    return () => {
      const spent = Math.round((Date.now() - start) / 1000);
      addLessonTime(lesson.id, spent);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  // lesson.slug and lesson.sections are derived from lesson.id — intentionally
  // excluded to prevent re-running when parent re-renders with the same lesson.
  }, [lesson.id]);

  // Scroll back to where the student left off once the hook has hydrated
  // and the DOM is fully rendered. requestAnimationFrame ensures refs are
  // populated before we attempt to scroll.
  useEffect(() => {
    if (!lastSectionId) return;
    const rafId = requestAnimationFrame(() => {
      const el = sectionRefs.current[lastSectionId];
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
    return () => cancelAnimationFrame(rafId);
  }, [lastSectionId]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(HOOK_DISMISSED_KEY);
      const dismissed: string[] = raw ? (JSON.parse(raw) as string[]) : [];
      setHookDismissed(dismissed.includes(lesson.id));
    } catch {
      setHookDismissed(false);
    }
  }, [lesson.id]);

  function dismissHook() {
    setHookDismissed(true);
    try {
      const raw = localStorage.getItem(HOOK_DISMISSED_KEY);
      const dismissed: string[] = raw ? (JSON.parse(raw) as string[]) : [];
      if (!dismissed.includes(lesson.id)) {
        localStorage.setItem(
          HOOK_DISMISSED_KEY,
          JSON.stringify([...dismissed, lesson.id]),
        );
      }
    } catch {
      // ignore storage errors
    }
  }

  // Merge the persisted completedSections (from useLessonProgress) with any
  // local-session sectionChecks overrides so restored state is reflected
  // reactively without needing a setState-in-effect.
  // When the user explicitly sets a section (including unchecking), that takes
  // precedence over the persisted value; otherwise fall back to completedSections.
  const effectiveSectionChecks = useMemo(() => {
    const merged: Record<string, boolean> = {};
    lesson.sections.forEach((section, idx) => {
      const key = getSectionKey(section, idx);
      merged[key] =
        key in sectionChecks
          ? Boolean(sectionChecks[key])
          : completedSections.includes(key);
    });
    return merged;
  }, [lesson.sections, sectionChecks, completedSections]);

  const { readingProgress, doneCount } = useMemo(() => {
    const total = lesson.sections.length;
    if (!total) return { readingProgress: 100, doneCount: 0 };
    const done = lesson.sections.filter(
      (section, idx) => effectiveSectionChecks[getSectionKey(section, idx)],
    ).length;
    return { readingProgress: Math.round((done / total) * 100), doneCount: done };
  }, [lesson.sections, effectiveSectionChecks]);

  useEffect(() => {
    updateLessonProgress(lesson.id, {
      percent: readingProgress,
      completed: readingProgress === 100 && (score ?? 0) >= 70,
    });
  }, [lesson.id, readingProgress, score]);

  function toggleReadAloud() {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    if (window.speechSynthesis.speaking) {
      stopSpeaking();
      return;
    }

    const body = lesson.sections
      .map((section) => getSectionText(section))
      .join(" ");
    void speakText({
      text: `${lesson.title}. ${lesson.summary}. ${body}`,
      language,
      voicePreference: acc.ttsVoice,
      speedPreference: acc.ttsSpeed,
    });
  }

  async function handleSubmitCheck() {
    const results: Record<string, { correct: boolean }> = {};
    let correctCount = 0;

    for (const question of questions) {
      const selectedIndex = answers[question.id];
      const selectedOption =
        typeof selectedIndex === "number"
          ? question.options[selectedIndex]
          : "";

      let correct = false;
      try {
        const res = await fetch("/api/check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            item: {
              kind: "quick_check",
              id: question.id,
              teks: question.teks,
              correctAnswer: question.correctAnswer,
            },
            response: {
              selectedOption,
            },
          }),
        });
        const data = await res.json();
        correct = Boolean(data?.correct);
      } catch {
        // Client fallback if check endpoint is temporarily unavailable.
        correct = selectedOption === question.correctAnswer;
      }

      results[question.id] = { correct };
      if (correct) correctCount += 1;
    }

    setQuestionResults(results);

    const pct = Math.round((correctCount / questions.length) * 100);
    const prev = getLessonProgress(lesson.id);
    const attempts = (prev?.checkAttempts ?? 0) + 1;
    const failedAttempts =
      (prev?.failedCheckAttempts ?? 0) + (pct < 70 ? 1 : 0);
    const tier = interventionTierFromCheck(pct, failedAttempts);

    updateLessonProgress(lesson.id, {
      checkScore: pct,
      checkAttempts: attempts,
      failedCheckAttempts: failedAttempts,
      completed: readingProgress === 100 && pct >= 70,
      percent: readingProgress,
    });

    // Persist attempt + mastery to Prisma if the student is logged in
    if (student?.id) {
      const studentId = student.id;
      const scoreNormalized = pct / 100;

      // Save one Attempt record per question — run concurrently
      const attemptPromises = questions.map((question) => {
        const { correct } = results[question.id] ?? { correct: false };
        return fetch("/api/attempts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            studentId,
            quickCheckId: `${lesson.id}:${question.id}`,
            teks: question.teks,
            score: correct ? 1 : 0,
            correct,
          }),
        });
      });

      // Update mastery for each TEKS covered by this quick-check — run concurrently
      const teksSet = new Set(questions.map((q) => q.teks));
      const masteryPromises = Array.from(teksSet).map((teks) =>
        fetch("/api/mastery", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ studentId, teks, score: scoreNormalized }),
        }),
      );

      Promise.all([...attemptPromises, ...masteryPromises]).catch(() => {});
    }

    setInterventionTier(tier);
    setScore(pct);
    setSubmitted(true);
  }

  function markComplete() {
    updateLessonProgress(lesson.id, {
      completed: readingProgress === 100 && (score ?? 0) >= 70,
      percent: readingProgress,
    });
    markLessonProgressComplete();
    setShowCompletion(true);
  }

  /** Handle "Mark read" checkbox toggle with localStorage persistence (FIX 5). */
  function handleSectionCheck(sectionKey: string, checked: boolean) {
    setSectionChecks((prev) => ({ ...prev, [sectionKey]: checked }));
    if (checked) markSectionComplete(sectionKey);
    const perKey = `biospark:lesson:${lesson.slug}:section:${sectionKey}:read`;
    try { localStorage.setItem(perKey, String(checked)); } catch { /* ignore */ }
  }

  const phenomenon = getPhenomenonForLesson(lesson.id);

  // Navigation handlers for the completion screen
  function handleKeepGoing() {
    if (nextLesson) {
      router.push(`/student/learn/${unit.id}/${nextLesson.slug}`);
    } else {
      router.push("/student/learn");
    }
  }

  function handleComeBackLater() {
    router.push("/student/learn");
  }

  return (
    <main className="ia-vh-page relative min-h-dvh" style={{ background: "#eef3ee", color: "#1a2e22" }}>
      {showCompletion && (
        <LessonCompletionScreen
          lessonTitle={lesson.title}
          teks={lesson.teks ?? unit.teks}
          xpEarned={30}
          completionHook={lesson.completionHook ?? "You just unlocked a foundational concept in modern biology."}
          onKeepGoing={handleKeepGoing}
          onComeBackLater={handleComeBackLater}
        />
      )}
      {/* FIX 7 — Sticky section progress indicator */}
      <div style={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        background: "#ffffff",
        borderBottom: "1px solid rgba(10,60,30,0.10)",
        padding: "10px 20px",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div style={{
            fontFamily: "var(--font-dm-sans), sans-serif",
            fontWeight: 500,
            fontSize: 13,
            color: "#0d4a2f",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            flex: 1,
          }}>
            {lesson.title}
          </div>
          <div style={{
            fontFamily: "var(--font-dm-mono), monospace",
            fontSize: 10,
            color: "#6a9a82",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}>
            Section {Math.min(doneCount + 1, lesson.sections.length)} of {lesson.sections.length}
          </div>
        </div>
        <div style={{ marginTop: 6, background: "rgba(10,60,30,0.08)", height: 3 }}>
          <div style={{ background: "#1a7a4e", height: "100%", width: `${readingProgress}%`, transition: "width 0.3s" }} />
        </div>
      </div>
      <div className="px-4 py-3 md:px-9 md:py-4">
      <div className="mx-auto grid w-full max-w-4xl gap-3">
        <section className="rounded-3xl p-5 shadow-sm" style={{ background: "#ffffff", border: "1px solid rgba(10,60,30,0.10)" }}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                Grading Period {unit.gradingPeriod} • Unit {unit.unitNumber}
              </div>
              <h1 className="mt-1 text-2xl font-bold" style={{ color: "#1a2e22" }}>
                {lesson.title}
              </h1>
              {(lesson.vocabularyTiers?.contentSpecific?.length ?? 0) > 0 && (
                <Link
                  href={`/student/learn/${unit.id}/${lesson.slug}/flashcards`}
                  className="mt-2 inline-block rounded-[6px] border border-bs-teal px-[14px] py-[6px] font-sans text-[13px] text-bs-teal hover:bg-[rgba(0,212,170,0.08)]"
                >
                  📚 Study vocabulary (
                  {lesson.vocabularyTiers?.contentSpecific?.length ?? 0} terms)
                </Link>
              )}
              <div className="mt-2 text-sm text-bs-text-sub">
                {lesson.type} • {lesson.minutes} min
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={toggleReadAloud}
                disabled={!acc.tts}
                title={
                  acc.tts
                    ? "Read this lesson aloud"
                    : "Enable Read aloud in Supports to use this"
                }
                className="rounded-xl border border-[rgba(0,0,0,0.08)] px-3 py-2 text-xs font-semibold"
                style={
                  acc.tts
                    ? { background: "#ffffff", border: "1px solid rgba(10,60,30,0.10)", color: "#1a2e22" }
                    : { background: "#ffffff", border: "1px solid rgba(10,60,30,0.10)", color: "rgba(26,46,34,0.4)", cursor: "not-allowed" }
                }
              >
                Read Aloud
              </button>
              <button
                type="button"
                onClick={() => setDyslexiaMode((value) => !value)}
                className="rounded-xl px-3 py-2 text-xs font-semibold" style={{ background: "#ffffff", border: "1px solid rgba(10,60,30,0.10)", color: "#1a2e22" }}
              >
                {dyslexiaMode ? "Standard Font" : "Dyslexia Friendly"}
              </button>
              <button
                type="button"
                onClick={() =>
                  setLanguage((prev) => (prev === "en" ? "es" : "en"))
                }
                className="rounded-xl px-3 py-2 text-xs font-semibold" style={{ background: "#ffffff", border: "1px solid rgba(10,60,30,0.10)", color: "#1a2e22" }}
              >
                {language === "en" ? "ES Support" : "EN Support"}
              </button>
            </div>
          </div>
          <p className="mt-3 text-sm leading-6 text-bs-text-sub">
            {lesson.summary}
          </p>

          {/* FIX 4 — Reading progress bar */}
          <div className="mt-3 rounded-2xl p-3" style={{ border: "1px solid rgba(10,60,30,0.10)" }}>
            <div className="mb-1 flex items-center justify-between" style={{ fontFamily: "var(--font-dm-mono), monospace", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.08em", color: "#6a9a82" }}>
              <span>Reading Progress</span>
              <span>{readingProgress}%</span>
            </div>
            <div style={{ height: 6, borderRadius: 20, background: "rgba(10,60,30,0.08)" }}>
              <div
                style={{ height: "100%", background: "#1a7a4e", borderRadius: 20, width: `${readingProgress}%`, transition: "width 0.3s" }}
              />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {lesson.keyTerms.map((term) => (
              <span
                key={term}
                style={{ background: "#d6ede6", color: "#0d4a2f", borderRadius: 20, fontFamily: "var(--font-dm-sans), sans-serif", fontSize: 12, padding: "4px 12px", display: "inline-block" }}
              >
                {term}
              </span>
            ))}
          </div>

          {/* FIX 3 — Vocabulary three-tier card */}
          {lesson.vocabularyTiers ? (
            <div className="mt-4 rounded-2xl p-3" style={{ border: "1px solid rgba(10,60,30,0.10)" }}>
              <div style={{ fontFamily: "var(--font-dm-mono), monospace", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", color: "#6a9a82" }}>
                Vocabulary: Everyday · Academic · Content Specific
              </div>
              <div className="mt-2 grid gap-3 md:grid-cols-3">
                <div>
                  <div style={{ fontFamily: "var(--font-dm-mono), monospace", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", color: "#6a9a82", marginBottom: 6 }}>
                    Everyday
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {(lesson.vocabularyTiers.everyday ?? []).map((word) => (
                      <span
                        key={`v-e-${word}`}
                        style={{ background: "#d6ede6", color: "#0d4a2f", borderRadius: 20, fontFamily: "var(--font-dm-sans), sans-serif", fontSize: 12, padding: "4px 12px", display: "inline-block" }}
                      >
                        {word}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div style={{ fontFamily: "var(--font-dm-mono), monospace", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", color: "#6a9a82", marginBottom: 6 }}>
                    Academic
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {(lesson.vocabularyTiers.academic ?? []).map((word) => (
                      <span
                        key={`v-a-${word}`}
                        style={{ background: "#d6ede6", color: "#0d4a2f", borderRadius: 20, fontFamily: "var(--font-dm-sans), sans-serif", fontSize: 12, padding: "4px 12px", display: "inline-block" }}
                      >
                        {word}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div style={{ fontFamily: "var(--font-dm-mono), monospace", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", color: "#6a9a82", marginBottom: 6 }}>
                    Content Specific
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {(lesson.vocabularyTiers.contentSpecific ?? []).map((word) => (
                      <span
                        key={`v-c-${word}`}
                        style={{ background: "#d6ede6", color: "#0d4a2f", borderRadius: 20, fontFamily: "var(--font-dm-sans), sans-serif", fontSize: 12, padding: "4px 12px", display: "inline-block" }}
                      >
                        {word}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </section>

        {phenomenon ? <PhenomenonBanner phenomenon={phenomenon} /> : null}

        <section className="rounded-3xl p-5 shadow-sm" style={{ background: "#ffffff", border: "1px solid rgba(10,60,30,0.10)" }}>
          <div className="space-y-5">
            {lesson.sections.map((section, idx) => {
              const sectionKey = getSectionKey(section, idx);
              const isRead = Boolean(effectiveSectionChecks[sectionKey]);
              return (
                <article
                  key={sectionKey}
                  ref={(el) => {
                    sectionRefs.current[sectionKey] = el;
                  }}
                  className="rounded-xl"
                  style={{
                    background: isRead ? "#d6ede6" : "#ffffff",
                    border: "1px solid rgba(10,60,30,0.10)",
                    borderRadius: 12,
                    padding: 16,
                    transition: "background 200ms ease-in-out",
                  }}
                >
                  {/* ── Explanation (default) ── */}
                  {(!section.type || section.type === "explanation") && (
                    <>
                      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                        <h2 className="text-[16px] md:text-[18px]" style={{ fontFamily: "var(--font-lora), Georgia, serif", fontStyle: "italic", fontWeight: 700, color: isRead ? "#4a8a6e" : "#0d4a2f", transition: "color 200ms ease-in-out", display: "flex", alignItems: "center", gap: 6 }}>
                          {isRead && <span aria-hidden="true">✓</span>}
                          {(section as ExplanationSection).heading}
                        </h2>
                        <label className="inline-flex items-center gap-2 text-xs font-semibold" style={{ color: "#5a7a66" }}>
                          <input
                            type="checkbox"
                            checked={isRead}
                            style={{ accentColor: "#1a7a4e" }}
                            onChange={(event) => handleSectionCheck(sectionKey, event.target.checked)}
                          />
                          Mark read
                        </label>
                      </div>
                      <div className="mt-2 space-y-3">
                        {(section as ExplanationSection).body.map((paragraph, pIdx) => (
                          <p
                            key={pIdx}
                            className={`text-sm leading-7 ${dyslexiaMode ? "tracking-wide" : ""}`}
                            style={{ color: "#1a2e22" }}
                          >
                            {paragraph}
                          </p>
                        ))}
                        {language === "es" ? (
                          <p className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-xs text-blue-800">
                            Apoyo en español: resume esta sección con tus propias
                            palabras antes de continuar.
                          </p>
                        ) : null}
                      </div>
                    </>
                  )}

                  {/* ── Worked Example ── */}
                  {section.type === "worked-example" && (
                    <>
                      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                        <h2 className="flex items-center gap-2 text-[16px] md:text-[18px]" style={{ fontFamily: "var(--font-lora), Georgia, serif", fontStyle: "italic", fontWeight: 700, color: isRead ? "#4a8a6e" : "#0d4a2f", transition: "color 200ms ease-in-out" }}>
                          <span className="rounded-md bg-indigo-100 px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-indigo-600">
                            Worked Example
                          </span>
                          {isRead && <span aria-hidden="true">✓</span>}
                          {section.heading}
                        </h2>
                        <label className="inline-flex items-center gap-2 text-xs font-semibold" style={{ color: "#5a7a66" }}>
                          <input
                            type="checkbox"
                            checked={isRead}
                            style={{ accentColor: "#1a7a4e" }}
                            onChange={(event) => handleSectionCheck(sectionKey, event.target.checked)}
                          />
                          Mark read
                        </label>
                      </div>
                      <p className={`mb-3 rounded-lg bg-indigo-50 p-3 text-sm text-indigo-900 ${dyslexiaMode ? "tracking-wide" : ""}`}>
                        <span className="font-semibold">Scenario: </span>
                        {section.scenario}
                      </p>
                      <ol className="list-decimal space-y-2 pl-5">
                        {section.steps.map((step, i) => (
                          <li key={i} className={`text-sm leading-7 text-bs-text-sub ${dyslexiaMode ? "tracking-wide" : ""}`}>
                            {step}
                          </li>
                        ))}
                      </ol>
                      {section.conclusion ? (
                        <p className={`mt-3 rounded-lg bg-indigo-100 p-3 text-sm font-medium text-indigo-800 ${dyslexiaMode ? "tracking-wide" : ""}`}>
                          <span className="font-bold">Conclusion: </span>
                          {section.conclusion}
                        </p>
                      ) : null}
                    </>
                  )}

                  {/* ── Misconception Spotlight ── */}
                  {section.type === "misconception-spotlight" && (
                    <>
                      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                        <h2 className="flex items-center gap-2 text-[16px] md:text-[18px]" style={{ fontFamily: "var(--font-lora), Georgia, serif", fontStyle: "italic", fontWeight: 700, color: isRead ? "#4a8a6e" : "#0d4a2f", transition: "color 200ms ease-in-out" }}>
                          <span className="rounded-md bg-amber-100 px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-amber-700">
                            ⚠ Misconception Spotlight
                          </span>
                          {isRead && <span aria-hidden="true">✓</span>}
                        </h2>
                        <label className="inline-flex items-center gap-2 text-xs font-semibold" style={{ color: "#5a7a66" }}>
                          <input
                            type="checkbox"
                            checked={isRead}
                            style={{ accentColor: "#1a7a4e" }}
                            onChange={(event) => handleSectionCheck(sectionKey, event.target.checked)}
                          />
                          Mark read
                        </label>
                      </div>
                      <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                        <p className={`mb-1 text-sm font-semibold text-amber-900 ${dyslexiaMode ? "tracking-wide" : ""}`}>
                          ✗ Common misconception: &ldquo;{section.misconception}&rdquo;
                        </p>
                        <p className={`text-sm text-amber-900 ${dyslexiaMode ? "tracking-wide" : ""}`}>
                          <span className="font-semibold text-green-700">✓ Correction: </span>
                          {section.correction}
                        </p>
                        {section.teks ? (
                          <span className="mt-2 inline-block rounded bg-[rgba(0,0,0,0.06)] px-2 py-0.5 text-xs text-bs-text-sub">
                            {section.teks}
                          </span>
                        ) : null}
                      </div>
                    </>
                  )}

                  {/* ── Visual Diagram ── */}
                  {section.type === "visual-diagram" && (
                    <>
                      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                        <h2 className="flex items-center gap-2 text-[16px] md:text-[18px]" style={{ fontFamily: "var(--font-lora), Georgia, serif", fontStyle: "italic", fontWeight: 700, color: isRead ? "#4a8a6e" : "#0d4a2f", transition: "color 200ms ease-in-out" }}>
                          <span className="rounded-md bg-teal-100 px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-teal-600">
                            Visual Diagram
                          </span>
                          {isRead && <span aria-hidden="true">✓</span>}
                          {section.heading}
                        </h2>
                        <label className="inline-flex items-center gap-2 text-xs font-semibold" style={{ color: "#5a7a66" }}>
                          <input
                            type="checkbox"
                            checked={isRead}
                            style={{ accentColor: "#1a7a4e" }}
                            onChange={(event) => handleSectionCheck(sectionKey, event.target.checked)}
                          />
                          Mark read
                        </label>
                      </div>
                      <p className={`mb-3 text-sm text-bs-text-sub ${dyslexiaMode ? "tracking-wide" : ""}`}>
                        {section.description}
                      </p>
                      <dl className="space-y-2">
                        {section.elements.map((el) => (
                          <div key={el.label} className="rounded-lg border border-teal-100 bg-teal-50 px-3 py-2">
                            <dt className="text-xs font-bold uppercase tracking-wide text-teal-700">
                              {el.label}
                            </dt>
                            <dd className={`mt-0.5 text-sm text-teal-900 ${dyslexiaMode ? "tracking-wide" : ""}`}>
                              {el.detail}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </>
                  )}

                  {/* ── Vocabulary Spotlight ── */}
                  {section.type === "vocabulary-spotlight" && (
                    <>
                      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                        <h2 className="flex items-center gap-2 text-[16px] md:text-[18px]" style={{ fontFamily: "var(--font-lora), Georgia, serif", fontStyle: "italic", fontWeight: 700, color: isRead ? "#4a8a6e" : "#0d4a2f", transition: "color 200ms ease-in-out" }}>
                          <span className="rounded-md bg-purple-100 px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-purple-600">
                            Vocabulary Spotlight
                          </span>
                          {isRead && <span aria-hidden="true">✓</span>}
                        </h2>
                        <label className="inline-flex items-center gap-2 text-xs font-semibold" style={{ color: "#5a7a66" }}>
                          <input
                            type="checkbox"
                            checked={isRead}
                            style={{ accentColor: "#1a7a4e" }}
                            onChange={(event) => handleSectionCheck(sectionKey, event.target.checked)}
                          />
                          Mark read
                        </label>
                      </div>
                      <dl className="space-y-3">
                        {section.terms.map((term) => (
                          <div key={term.term} className="rounded-lg border border-purple-100 bg-purple-50 px-3 py-2">
                            <dt className="text-sm font-bold text-purple-900">{term.term}</dt>
                            <dd className={`mt-0.5 text-sm text-purple-900 ${dyslexiaMode ? "tracking-wide" : ""}`}>
                              {term.definition}
                            </dd>
                            {term.example ? (
                              <p className={`mt-1 rounded bg-white/70 px-2 py-1 text-xs italic text-gray-700 ${dyslexiaMode ? "tracking-wide" : ""}` }>
                                Example: {term.example}
                              </p>
                            ) : null}
                          </div>
                        ))}
                      </dl>
                    </>
                  )}

                  {/* ── Activity ── */}
                  {section.type === "activity" && (
                    <>
                      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                        <h2 className="flex items-center gap-2 text-[16px] md:text-[18px]" style={{ fontFamily: "var(--font-lora), Georgia, serif", fontStyle: "italic", fontWeight: 700, color: isRead ? "#4a8a6e" : "#0d4a2f", transition: "color 200ms ease-in-out" }}>
                          <span className="rounded-md bg-green-100 px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-green-600">
                            Activity
                          </span>
                          {isRead && <span aria-hidden="true">✓</span>}
                          {section.heading}
                        </h2>
                        <label className="inline-flex items-center gap-2 text-xs font-semibold" style={{ color: "#5a7a66" }}>
                          <input
                            type="checkbox"
                            checked={isRead}
                            style={{ accentColor: "#1a7a4e" }}
                            onChange={(event) => handleSectionCheck(sectionKey, event.target.checked)}
                          />
                          Mark read
                        </label>
                      </div>
                      <p className={`mb-3 text-sm leading-7 text-bs-text-sub ${dyslexiaMode ? "tracking-wide" : ""}`}>
                        {section.prompt}
                      </p>
                      {section.sentenceFrames && section.sentenceFrames.length > 0 ? (
                        <div className="mt-2 rounded-lg border border-green-200 bg-green-50 p-3">
                          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-green-700">
                            Sentence Frames
                          </p>
                          <ul className="space-y-2">
                            {section.sentenceFrames.map((frame, i) => (
                              <li key={i} className={`rounded bg-white/80 px-3 py-1.5 text-sm italic text-gray-700 ${dyslexiaMode ? "tracking-wide" : ""}`}>
                                {frame}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                    </>
                  )}
                </article>
              );
            })}
          </div>
        </section>

        {/* Lab Notebook — between lesson content and quick-checks */}
        <LessonNotebook lessonSlug={lesson.slug} studentId={student?.id ?? "anonymous"} />

        <section className="rounded-3xl p-5 shadow-sm" style={{ background: "#ffffff", border: "1px solid rgba(10,60,30,0.10)" }}>
          <div className="text-sm font-semibold" style={{ color: "#1a2e22" }}>
            Quick Check
          </div>
          <p className="mt-1 text-xs text-bs-text-sub">
            Score at least 70% to unlock the next lesson on the mastery path.
          </p>
          <div className="mt-3 space-y-4">
            {questions.map((question, index) => (
              <div
                key={question.id}
                style={{ background: "#ffffff", border: "1px solid rgba(10,60,30,0.10)", borderRadius: 12, padding: 16 }}
              >
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span style={{ background: "#d6ede6", color: "#0d4a2f", borderRadius: 20, fontSize: 11, fontWeight: 600, padding: "3px 10px" }}>
                    TEKS {question.teks}
                  </span>
                  <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-900">
                    {question.learningLevel}
                  </span>
                </div>
                <div className="text-sm font-semibold" style={{ color: "#1a2e22" }}>
                  {index + 1}. {question.question}
                </div>
                <div className="mt-2 space-y-2">
                  {question.options.map((choice, optionIndex) => (
                    <label
                      key={choice}
                      className="flex min-h-[44px] cursor-pointer items-center gap-2 rounded-xl border border-transparent px-3 py-2 text-sm transition-colors hover:border-[rgba(10,60,30,0.10)] hover:bg-[rgba(10,60,30,0.04)]"
                      style={{ color: "#5a7a66" }}
                    >
                      <input
                        type="radio"
                        aria-label={`${question.id}-${choice}`}
                        name={question.id}
                        style={{ accentColor: "#1a7a4e" }}
                        checked={answers[question.id] === optionIndex}
                        onChange={() =>
                          setAnswers((prev) => ({
                            ...prev,
                            [question.id]: optionIndex,
                          }))
                        }
                      />
                      {choice}
                    </label>
                  ))}
                </div>
                {submitted && !questionResults[question.id]?.correct ? (
                  <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
                    <div className="font-semibold">Not quite.</div>
                    <div className="mt-1">
                      Correct answer:{" "}
                      <span className="font-semibold">
                        {question.correctAnswer}
                      </span>
                    </div>
                    {question.misconceptionTarget &&
                    question.misconceptionDescription ? (
                      <div className="mt-1">
                        {question.misconceptionDescription}
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleSubmitCheck}
              aria-label="Submit quick check"
              className="rounded-xl px-4 py-2 text-sm font-semibold" style={{ background: "#1a7a4e", color: "white" }}
            >
              Submit Check
            </button>
            <button
              type="button"
              onClick={markComplete}
              aria-label="Mark lesson complete"
              className="rounded-xl px-4 py-2 text-sm font-semibold" style={{ background: "#ffffff", border: "1px solid rgba(10,60,30,0.10)", color: "#1a2e22" }}
            >
              Mark Lesson Complete
            </button>
            {submitted && score !== null ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800">
                Score: {score}%
              </div>
            ) : null}
            {submitted && interventionTier ? (
              <div
                className={
                  interventionTier === 3
                    ? "rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-800"
                    : "rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-800"
                }
              >
                Tier {interventionTier} intervention triggered:{" "}
                {interventionStrategyForTier(interventionTier)}
              </div>
            ) : null}
          </div>

          {submitted && lesson.hook ? (
            <div className="mt-5 rounded-2xl border-y border-r border-amber-200 border-l-4 border-l-amber-400 bg-amber-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">
                Remember why this mattered
              </p>
              <p className="mt-1 text-sm font-semibold text-amber-900">
                {lesson.hook.headline}
              </p>
              <p className="mt-1 text-sm leading-6 text-amber-800">
                {lesson.hook.body}
              </p>
              {lesson.hook.source ? (
                <p className="mt-2 text-xs text-amber-600">
                  — {lesson.hook.source}
                </p>
              ) : null}
            </div>
          ) : null}
        </section>

        <section className="rounded-3xl p-4 shadow-sm" style={{ background: "#ffffff", border: "1px solid rgba(10,60,30,0.10)" }}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex gap-2">
              <Link
                href="/student/learn"
                className="rounded-xl px-3 py-2 text-xs font-semibold" style={{ background: "#ffffff", border: "1px solid rgba(10,60,30,0.10)", color: "#1a2e22" }}
              >
                Hub
              </Link>
              <Link
                href={`/student/learn/${unit.id}`}
                className="rounded-xl px-3 py-2 text-xs font-semibold" style={{ background: "#ffffff", border: "1px solid rgba(10,60,30,0.10)", color: "#1a2e22" }}
              >
                Unit
              </Link>
            </div>

            <div className="flex gap-2">
              {previousLesson ? (
                <Link
                  href={`/student/learn/${unit.id}/${previousLesson.slug}`}
                  className="rounded-xl px-3 py-2 text-xs font-semibold" style={{ background: "#ffffff", border: "1px solid rgba(10,60,30,0.10)", color: "#1a2e22" }}
                >
                  ← Previous
                </Link>
              ) : null}
              {nextLesson ? (
                <Link
                  href={`/student/learn/${unit.id}/${nextLesson.slug}`}
                  className="rounded-xl px-3 py-2 text-xs font-semibold" style={{ background: "#1a7a4e", color: "white" }}
                >
                  Next →
                </Link>
              ) : null}
            </div>
          </div>
        </section>
      </div>
      </div>
    </main>
  );
}
