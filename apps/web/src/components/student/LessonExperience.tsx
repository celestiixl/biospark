"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
  isPriorityTeks,
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
import { useStudentAuth } from "@/lib/studentAuth";
import { speakText, stopSpeaking } from "@/lib/accommodations";
import { useAccommodations } from "@/lib/useAccommodations";
import TeksTag from "@/components/ui/TeksTag";

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

  useEffect(() => {
    const saved = getLessonProgress(lesson.id);
    const baseline: Record<string, boolean> = {};
    lesson.sections.forEach((section, idx) => {
      const key = getSectionKey(section, idx);
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

  const readingProgress = useMemo(() => {
    const total = lesson.sections.length;
    if (!total) return 100;
    const done = lesson.sections.filter(
      (section, idx) => effectiveSectionChecks[getSectionKey(section, idx)],
    ).length;
    return Math.round((done / total) * 100);
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
  }

  const phenomenon = getPhenomenonForLesson(lesson.id);

  return (
    <main className="ia-vh-page relative min-h-dvh px-4 py-3 md:px-9 md:py-4" style={{ background: "#eef3ee", color: "#1a2e22" }}>
      <div className="mx-auto grid w-full max-w-4xl gap-3">
        <section className="rounded-3xl border p-5 shadow-sm" style={{ background: "#ffffff", borderColor: "rgba(10,60,30,0.10)" }}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#4a8a6e" }}>
                Grading Period {unit.gradingPeriod} • Unit {unit.unitNumber}
              </div>
              <h1 className="mt-1 text-2xl font-bold" style={{ color: "#0d4a2f" }}>
                {lesson.title}
              </h1>
              {lesson.teks && lesson.teks.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {lesson.teks.map((code) => (
                    <TeksTag key={code} code={code} priority={isPriorityTeks(code)} />
                  ))}
                </div>
              )}
              {(lesson.vocabularyTiers?.contentSpecific?.length ?? 0) > 0 && (
                <Link
                  href={`/student/learn/${unit.id}/${lesson.slug}/flashcards`}
                  className="mt-2 inline-block rounded-[6px] border border-bs-teal px-[14px] py-[6px] font-sans text-[13px] text-bs-teal hover:bg-[rgba(0,212,170,0.08)]"
                >
                  📚 Study vocabulary (
                  {lesson.vocabularyTiers?.contentSpecific?.length ?? 0} terms)
                </Link>
              )}
              <div className="mt-2 text-sm" style={{ color: "#5a7a66" }}>
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
                className="rounded-xl px-3 py-2 text-xs font-semibold"
                style={
                  acc.tts
                    ? { background: "#ffffff", color: "#0d4a2f", border: "1px solid rgba(10,60,30,0.10)" }
                    : { background: "#ffffff", color: "rgba(13,74,47,0.4)", border: "1px solid rgba(10,60,30,0.10)", cursor: "not-allowed" }
                }
              >
                Read Aloud
              </button>
              <button
                type="button"
                onClick={() => setDyslexiaMode((value) => !value)}
                className="rounded-xl px-3 py-2 text-xs font-semibold" style={{ background: "#ffffff", color: "#0d4a2f", border: "1px solid rgba(10,60,30,0.10)" }}
              >
                {dyslexiaMode ? "Standard Font" : "Dyslexia Friendly"}
              </button>
              <button
                type="button"
                onClick={() =>
                  setLanguage((prev) => (prev === "en" ? "es" : "en"))
                }
                className="rounded-xl px-3 py-2 text-xs font-semibold" style={{ background: "#ffffff", color: "#0d4a2f", border: "1px solid rgba(10,60,30,0.10)" }}
              >
                {language === "en" ? "ES Support" : "EN Support"}
              </button>
            </div>
          </div>
          <p className="mt-3 text-sm leading-6" style={{ color: "#5a7a66" }}>
            {lesson.summary}
          </p>

          <div className="mt-3 rounded-2xl p-3" style={{ background: "#ffffff", border: "1px solid rgba(10,60,30,0.10)" }}>
            <div className="mb-1 flex items-center justify-between text-xs font-semibold" style={{ color: "#5a7a66" }}>
              <span>Reading Progress — {Object.values(effectiveSectionChecks).filter(Boolean).length} of {lesson.sections.length} sections</span>
              <span>{readingProgress}%</span>
            </div>
            <div className="h-2 rounded-full" style={{ background: "rgba(10,60,30,0.08)" }}>
              <div
                style={{ height: "100%", background: "#1a7a4e", borderRadius: 3, width: `${readingProgress}%`, transition: "width 0.3s" }}
              />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {lesson.keyTerms.map((term) => (
              <span
                key={term}
                className="rounded-full px-3 py-1 text-xs font-semibold" style={{ background: "#d6ede6", color: "#0d4a2f", border: "1px solid rgba(10,60,30,0.10)" }}
              >
                {term}
              </span>
            ))}
          </div>

          {lesson.vocabularyTiers ? (
            <div className="mt-4 rounded-2xl p-3" style={{ background: "#ffffff", border: "1px solid rgba(10,60,30,0.10)" }}>
              <div className="text-xs font-semibold uppercase tracking-wide text-bs-text-sub">
                Vocabulary: Everyday to Academic to Content Specific
              </div>
              <div className="mt-2 grid gap-3 md:grid-cols-3">
                <div>
                  <div className="text-xs font-semibold" style={{ color: "#5a7a66" }}>
                    Everyday
                  </div>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {lesson.vocabularyTiers.everyday.map((word) => (
                      <span
                        key={`v-e-${word}`}
                        className="rounded-full px-2 py-0.5 text-[11px] font-semibold" style={{ background: "rgba(10,60,30,0.06)", color: "#0d4a2f", border: "1px solid rgba(10,60,30,0.10)" }}
                      >
                        {word}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-semibold" style={{ color: "#5a7a66" }}>
                    Academic
                  </div>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {lesson.vocabularyTiers.academic.map((word) => (
                      <span
                        key={`v-a-${word}`}
                        className="rounded-full px-2 py-0.5 text-[11px] font-semibold" style={{ background: "rgba(10,60,30,0.06)", color: "#0d4a2f", border: "1px solid rgba(10,60,30,0.10)" }}
                      >
                        {word}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-semibold" style={{ color: "#5a7a66" }}>
                    Content Specific
                  </div>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {lesson.vocabularyTiers.contentSpecific.map((word) => (
                      <span
                        key={`v-c-${word}`}
                        className="rounded-full px-2 py-0.5 text-[11px] font-bold" style={{ background: "#d6ede6", color: "#0d4a2f", border: "1px solid rgba(10,60,30,0.12)" }}
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

        <section className="rounded-3xl border p-5 shadow-sm" style={{ background: "#ffffff", borderColor: "rgba(10,60,30,0.10)" }}>
          {/* Learning intention block — shown before first section */}
          {lesson.learningIntentions && lesson.learningIntentions.length > 0 && (
            <div className="mb-5 rounded-xl p-4" style={{ background: "#d6ede6", border: "1px solid rgba(10,60,30,0.10)" }}>
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide" style={{ color: "#4a8a6e" }}>
                Learning Intentions
              </div>
              <ul className="space-y-1.5">
                {lesson.learningIntentions.map((intent, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "#0d4a2f" }}>
                    <span style={{ color: "#1a7a4e", marginTop: 3, flexShrink: 0 }}>→</span>
                    <span>{intent}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="space-y-5">
            {lesson.sections.map((section, idx) => {
              const sectionKey = getSectionKey(section, idx);
              return (
                <article
                  key={sectionKey}
                  ref={(el) => {
                    sectionRefs.current[sectionKey] = el;
                  }}
                  className="rounded-xl p-4" style={{ background: "#ffffff", border: "1px solid rgba(10,60,30,0.10)" }}
                >
                  {/* Section X of Y badge */}
                  <div className="mb-2 flex items-center gap-2">
                    <span className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide" style={{ background: "#d6ede6", color: "#4a8a6e" }}>
                      Section {idx + 1} of {lesson.sections.length}
                    </span>
                    {effectiveSectionChecks[sectionKey] && (
                      <span style={{ color: "#1a7a4e", fontSize: 13, fontWeight: 700 }} aria-label="Section complete">✓</span>
                    )}
                  </div>
                  {/* ── Explanation (default) ── */}
                  {(!section.type || section.type === "explanation") && (
                    <>
                      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                        <h2 className="text-lg font-semibold" style={{ color: "#0d4a2f" }}>
                          {(section as ExplanationSection).heading}
                        </h2>
                        <label className="inline-flex items-center gap-2 text-xs font-semibold" style={{ color: "#4a8a6e" }}>
                          <input
                            type="checkbox"
                            checked={Boolean(effectiveSectionChecks[sectionKey])}
                            onChange={(event) => {
                              const checked = event.target.checked;
                              setSectionChecks((prev) => ({
                                ...prev,
                                [sectionKey]: checked,
                              }));
                              if (checked) markSectionComplete(sectionKey);
                            }}
                          />
                          {effectiveSectionChecks[sectionKey] ? "✓ Read" : "Mark read"}
                        </label>
                      </div>
                      <div className="mt-2 space-y-3">
                        {(section as ExplanationSection).body.map((paragraph, pIdx) => (
                          <p
                            key={pIdx}
                            className={`text-sm leading-7 ${dyslexiaMode ? "tracking-wide" : ""}`}
                            style={{ color: "#5a7a66" }}
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
                        <h2 className="flex items-center gap-2 text-lg font-semibold text-indigo-800">
                          <span className="rounded-md bg-indigo-100 px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-indigo-600">
                            Worked Example
                          </span>
                          {section.heading}
                        </h2>
                        <label className="inline-flex items-center gap-2 text-xs font-semibold" style={{ color: "#4a8a6e" }}>
                          <input
                            type="checkbox"
                            checked={Boolean(effectiveSectionChecks[sectionKey])}
                            onChange={(event) => {
                              const checked = event.target.checked;
                              setSectionChecks((prev) => ({ ...prev, [sectionKey]: checked }));
                              if (checked) markSectionComplete(sectionKey);
                            }}
                          />
                          {effectiveSectionChecks[sectionKey] ? "✓ Read" : "Mark read"}
                        </label>
                      </div>
                      <p className={`mb-3 rounded-lg bg-indigo-50 p-3 text-sm text-indigo-900 ${dyslexiaMode ? "tracking-wide" : ""}`}>
                        <span className="font-semibold">Scenario: </span>
                        {section.scenario}
                      </p>
                      <ol className="list-decimal space-y-2 pl-5">
                        {section.steps.map((step, i) => (
                          <li key={i} className={`text-sm leading-7 ${dyslexiaMode ? "tracking-wide" : ""}`} style={{ color: "#5a7a66" }}>
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
                        <h2 className="flex items-center gap-2 text-base font-semibold" style={{ color: "#b8860b" }}>
                          <span className="rounded-md px-2 py-0.5 text-xs font-bold uppercase tracking-wide" style={{ background: "#fef3d6", color: "#b8860b" }}>
                            ⚠ Misconception Spotlight
                          </span>
                        </h2>
                        <label className="inline-flex items-center gap-2 text-xs font-semibold" style={{ color: "#4a8a6e" }}>
                          <input
                            type="checkbox"
                            checked={Boolean(effectiveSectionChecks[sectionKey])}
                            onChange={(event) => {
                              const checked = event.target.checked;
                              setSectionChecks((prev) => ({ ...prev, [sectionKey]: checked }));
                              if (checked) markSectionComplete(sectionKey);
                            }}
                          />
                          {effectiveSectionChecks[sectionKey] ? "✓ Read" : "Mark read"}
                        </label>
                      </div>
                      <div className="rounded-lg p-3" style={{ background: "#fef3d6", border: "1px solid rgba(184,134,11,0.2)" }}>
                        <p className={`mb-1 text-sm font-semibold ${dyslexiaMode ? "tracking-wide" : ""}`} style={{ color: "#b8860b" }}>
                          ✗ Common misconception: &ldquo;{section.misconception}&rdquo;
                        </p>
                        <p className={`text-sm ${dyslexiaMode ? "tracking-wide" : ""}`} style={{ color: "#b8860b" }}>
                          <span className="font-semibold" style={{ color: "#1a7a4e" }}>✓ Correction: </span>
                          {section.correction}
                        </p>
                        {section.teks ? (
                          <span className="mt-2 inline-block rounded px-2 py-0.5 text-xs" style={{ background: "rgba(10,60,30,0.06)", color: "#5a7a66" }}>
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
                        <h2 className="flex items-center gap-2 text-lg font-semibold" style={{ color: "#0d4a2f" }}>
                          <span className="rounded-md px-2 py-0.5 text-xs font-bold uppercase tracking-wide" style={{ background: "#d6ede6", color: "#1a7a4e" }}>
                            Visual Diagram
                          </span>
                          {section.heading}
                        </h2>
                        <label className="inline-flex items-center gap-2 text-xs font-semibold" style={{ color: "#4a8a6e" }}>
                          <input
                            type="checkbox"
                            checked={Boolean(effectiveSectionChecks[sectionKey])}
                            onChange={(event) => {
                              const checked = event.target.checked;
                              setSectionChecks((prev) => ({ ...prev, [sectionKey]: checked }));
                              if (checked) markSectionComplete(sectionKey);
                            }}
                          />
                          {effectiveSectionChecks[sectionKey] ? "✓ Read" : "Mark read"}
                        </label>
                      </div>
                      <p className={`mb-3 text-sm ${dyslexiaMode ? "tracking-wide" : ""}`} style={{ color: "#5a7a66" }}>
                        {section.description}
                      </p>
                      <dl className="space-y-2">
                        {section.elements.map((el) => (
                          <div key={el.label} className="rounded-lg px-3 py-2" style={{ background: "#d6ede6", border: "1px solid rgba(10,60,30,0.10)" }}>
                            <dt className="text-xs font-bold uppercase tracking-wide" style={{ color: "#1a7a4e" }}>
                              {el.label}
                            </dt>
                            <dd className={`mt-0.5 text-sm ${dyslexiaMode ? "tracking-wide" : ""}`} style={{ color: "#0d4a2f" }}>
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
                        <h2 className="flex items-center gap-2 text-base font-semibold" style={{ color: "#5a3d9a" }}>
                          <span className="rounded-md px-2 py-0.5 text-xs font-bold uppercase tracking-wide" style={{ background: "#ece8f8", color: "#5a3d9a" }}>
                            Vocabulary Spotlight
                          </span>
                        </h2>
                        <label className="inline-flex items-center gap-2 text-xs font-semibold" style={{ color: "#4a8a6e" }}>
                          <input
                            type="checkbox"
                            checked={Boolean(effectiveSectionChecks[sectionKey])}
                            onChange={(event) => {
                              const checked = event.target.checked;
                              setSectionChecks((prev) => ({ ...prev, [sectionKey]: checked }));
                              if (checked) markSectionComplete(sectionKey);
                            }}
                          />
                          {effectiveSectionChecks[sectionKey] ? "✓ Read" : "Mark read"}
                        </label>
                      </div>
                      <dl className="space-y-3">
                        {section.terms.map((term) => (
                          <div key={term.term} className="rounded-lg px-3 py-2" style={{ background: "#ece8f8", border: "1px solid rgba(90,61,154,0.12)" }}>
                            <dt className="text-sm font-bold" style={{ color: "#5a3d9a" }}>{term.term}</dt>
                            <dd className={`mt-0.5 text-sm ${dyslexiaMode ? "tracking-wide" : ""}`} style={{ color: "#5a3d9a" }}>
                              {term.definition}
                            </dd>
                            {term.example ? (
                              <p className={`mt-1 rounded px-2 py-1 text-xs italic ${dyslexiaMode ? "tracking-wide" : ""}`} style={{ background: "rgba(255,255,255,0.7)", color: "#5a7a66" }}>
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
                        <h2 className="flex items-center gap-2 text-lg font-semibold" style={{ color: "#0d4a2f" }}>
                          <span className="rounded-md px-2 py-0.5 text-xs font-bold uppercase tracking-wide" style={{ background: "#d6ede6", color: "#1a7a4e" }}>
                            Activity
                          </span>
                          {section.heading}
                        </h2>
                        <label className="inline-flex items-center gap-2 text-xs font-semibold" style={{ color: "#4a8a6e" }}>
                          <input
                            type="checkbox"
                            checked={Boolean(effectiveSectionChecks[sectionKey])}
                            onChange={(event) => {
                              const checked = event.target.checked;
                              setSectionChecks((prev) => ({ ...prev, [sectionKey]: checked }));
                              if (checked) markSectionComplete(sectionKey);
                            }}
                          />
                          {effectiveSectionChecks[sectionKey] ? "✓ Read" : "Mark read"}
                        </label>
                      </div>
                      <p className={`mb-3 text-sm leading-7 ${dyslexiaMode ? "tracking-wide" : ""}`} style={{ color: "#5a7a66" }}>
                        {section.prompt}
                      </p>
                      {section.sentenceFrames && section.sentenceFrames.length > 0 ? (
                        <div className="mt-2 rounded-lg p-3" style={{ background: "#d6ede6", border: "1px solid rgba(10,60,30,0.10)" }}>
                          <p className="mb-2 text-xs font-semibold uppercase tracking-wide" style={{ color: "#1a7a4e" }}>
                            Sentence Frames
                          </p>
                          <ul className="space-y-2">
                            {section.sentenceFrames.map((frame, i) => (
                              <li key={i} className={`rounded px-3 py-1.5 text-sm italic ${dyslexiaMode ? "tracking-wide" : ""}`} style={{ background: "rgba(255,255,255,0.8)", color: "#0d4a2f" }}>
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

        <section className="rounded-3xl border p-5 shadow-sm" style={{ background: "#ffffff", borderColor: "rgba(10,60,30,0.10)" }}>
          <div className="text-sm font-semibold" style={{ color: "#0d4a2f" }}>
            Quick Check
          </div>
          <p className="mt-1 text-xs" style={{ color: "#5a7a66" }}>
            Score at least 70% to unlock the next lesson on the mastery path.
          </p>
          <div className="mt-3 space-y-4">
            {questions.map((question, index) => (
              <div
                key={question.id}
                className="rounded-xl p-4"
                style={{ background: "#ffffff", border: "1px solid rgba(10,60,30,0.10)", borderRadius: 12 }}
              >
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <TeksTag code={question.teks} priority={isPriorityTeks(question.teks)} />
                  <span className="rounded-full px-2.5 py-1 text-[11px] font-semibold" style={{ background: "#ece8f8", color: "#5a3d9a", border: "1px solid rgba(90,61,154,0.12)" }}>
                    {question.learningLevel}
                  </span>
                </div>
                <div className="text-sm font-semibold" style={{ color: "#0d4a2f" }}>
                  {index + 1}. {question.question}
                </div>
                <div className="mt-2 space-y-2">
                  {question.options.map((choice, optionIndex) => (
                    <label
                      key={choice}
                      className="flex min-h-[44px] cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-sm transition-colors"
                      style={{
                        color: "#5a7a66",
                        border: answers[question.id] === optionIndex
                          ? "1px solid rgba(10,60,30,0.25)"
                          : "1px solid transparent",
                        background: answers[question.id] === optionIndex
                          ? "rgba(10,60,30,0.04)"
                          : "transparent",
                      }}
                    >
                      <input
                        type="radio"
                        aria-label={`${question.id}-${choice}`}
                        name={question.id}
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
                {/* Correct feedback — mint */}
                {submitted && questionResults[question.id]?.correct ? (
                  <div className="mt-3 rounded-xl px-3 py-2 text-xs" style={{ background: "#d6ede6", border: "1px solid rgba(13,74,47,0.12)", color: "#0d4a2f" }}>
                    <div className="font-semibold">✓ Correct!</div>
                    {question.misconceptionTarget && question.misconceptionDescription ? (
                      <div className="mt-1">{question.misconceptionDescription}</div>
                    ) : null}
                  </div>
                ) : null}
                {/* Incorrect feedback — salmon */}
                {submitted && questionResults[question.id] !== undefined && !questionResults[question.id]?.correct ? (
                  <div className="mt-3 rounded-xl px-3 py-2 text-xs" style={{ background: "#fde8e0", border: "1px solid rgba(224,90,42,0.2)", color: "#c04a20" }}>
                    <div className="font-semibold">✗ Not quite.</div>
                    <div className="mt-1">
                      The correct answer is:{" "}
                      <span className="font-semibold">{question.correctAnswer}</span>
                    </div>
                    {question.misconceptionTarget && question.misconceptionDescription ? (
                      <div className="mt-1" style={{ color: "#c04a20" }}>{question.misconceptionDescription}</div>
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
              className="rounded-xl px-4 py-2 text-sm font-semibold" style={{ background: "#1a7a4e", color: "#ffffff" }}
            >
              Submit Check
            </button>
            <button
              type="button"
              onClick={markComplete}
              aria-label="Mark lesson complete"
              className="rounded-xl px-4 py-2 text-sm font-semibold" style={{ background: "#ffffff", color: "#0d4a2f", border: "1px solid rgba(10,60,30,0.10)" }}
            >
              Mark Lesson Complete
            </button>
            {submitted && score !== null ? (
              <div className="rounded-xl px-3 py-2 text-sm font-semibold" style={{ background: "#d6ede6", color: "#0d4a2f", border: "1px solid rgba(13,74,47,0.12)" }}>
                Score: {score}%
              </div>
            ) : null}
            {submitted && interventionTier ? (
              <div
                style={
                  interventionTier === 3
                    ? { background: "#fde8e0", border: "1px solid rgba(224,90,42,0.2)", color: "#c04a20", borderRadius: 12, padding: "8px 12px", fontSize: 14, fontWeight: 600 }
                    : { background: "#fef3d6", border: "1px solid rgba(184,134,11,0.2)", color: "#b8860b", borderRadius: 12, padding: "8px 12px", fontSize: 14, fontWeight: 600 }
                }
              >
                Tier {interventionTier} intervention triggered:{" "}
                {interventionStrategyForTier(interventionTier)}
              </div>
            ) : null}
          </div>

          {submitted && lesson.hook ? (
            <div className="mt-5 rounded-2xl p-4" style={{ background: "#fef3d6", borderLeft: "4px solid #b8860b", border: "1px solid rgba(184,134,11,0.2)" }}>
              <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#b8860b" }}>
                Remember why this mattered
              </p>
              <p className="mt-1 text-sm font-semibold" style={{ color: "#b8860b" }}>
                {lesson.hook.headline}
              </p>
              <p className="mt-1 text-sm leading-6" style={{ color: "#b8860b" }}>
                {lesson.hook.body}
              </p>
              {lesson.hook.source ? (
                <p className="mt-2 text-xs" style={{ color: "#b8860b" }}>
                  — {lesson.hook.source}
                </p>
              ) : null}
            </div>
          ) : null}
        </section>

        {/* ── Lesson Completion Celebration ── */}
        {readingProgress === 100 && submitted && (score ?? 0) >= 70 && (
          <section className="rounded-3xl border p-6 shadow-sm text-center" style={{ background: "#d6ede6", borderColor: "rgba(10,60,30,0.12)" }}>
            <div className="text-3xl mb-2" aria-hidden="true">🎉</div>
            <h2 className="text-xl font-bold" style={{ color: "#0d4a2f" }}>Lesson Complete!</h2>
            <p className="mt-1 text-sm" style={{ color: "#4a8a6e" }}>
              You scored <span className="font-bold" style={{ color: "#1a7a4e" }}>{score}%</span> and read all {lesson.sections.length} sections.
            </p>
            <div className="mt-3 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold" style={{ background: "#0d4a2f", color: "#d6f0e4" }}>
              +{Math.round(50 + (score ?? 0) / 2)} XP earned
            </div>
            {nextLesson ? (
              <div className="mt-4">
                <Link
                  href={`/student/learn/${unit.id}/${nextLesson.slug}`}
                  className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold"
                  style={{ background: "#1a7a4e", color: "#ffffff" }}
                  aria-label={`Continue to next lesson: ${nextLesson.title}`}
                >
                  Next: {nextLesson.title} →
                </Link>
              </div>
            ) : (
              <div className="mt-4">
                <Link
                  href={`/student/learn/${unit.id}`}
                  className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold"
                  style={{ background: "#1a7a4e", color: "#ffffff" }}
                >
                  Back to Unit →
                </Link>
              </div>
            )}
          </section>
        )}

        <section className="rounded-3xl border p-4 shadow-sm" style={{ background: "#ffffff", borderColor: "rgba(10,60,30,0.10)" }}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex gap-2">
              <Link
                href="/student/learn"
                className="rounded-xl px-3 py-2 text-xs font-semibold" style={{ background: "#ffffff", color: "#0d4a2f", border: "1px solid rgba(10,60,30,0.10)" }}
              >
                Hub
              </Link>
              <Link
                href={`/student/learn/${unit.id}`}
                className="rounded-xl px-3 py-2 text-xs font-semibold" style={{ background: "#ffffff", color: "#0d4a2f", border: "1px solid rgba(10,60,30,0.10)" }}
              >
                Unit
              </Link>
            </div>

            <div className="flex gap-2">
              {previousLesson ? (
                <Link
                  href={`/student/learn/${unit.id}/${previousLesson.slug}`}
                  className="rounded-xl px-3 py-2 text-xs font-semibold" style={{ background: "#ffffff", color: "#0d4a2f", border: "1px solid rgba(10,60,30,0.10)" }}
                >
                  ← Previous
                </Link>
              ) : null}
              {nextLesson ? (
                <Link
                  href={`/student/learn/${unit.id}/${nextLesson.slug}`}
                  className="rounded-xl px-3 py-2 text-xs font-semibold" style={{ background: "#1a7a4e", color: "#ffffff" }}
                >
                  Next →
                </Link>
              ) : null}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
