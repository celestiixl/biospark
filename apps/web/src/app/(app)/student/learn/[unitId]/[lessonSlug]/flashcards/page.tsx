import Link from "next/link";
import { notFound } from "next/navigation";
import { getLessonBySlug, getUnitById } from "@/lib/learningHubContent";
import { FlashcardDeck } from "@/components/student/FlashcardDeck";
import StudentFloatingDock from "@/components/student/StudentFloatingDock";
import ThemeToggle from "@/components/ia/ThemeToggle";

type FlashcardsPageProps = {
  params: Promise<{ unitId: string; lessonSlug: string }>;
};

export default async function FlashcardsPage({ params }: FlashcardsPageProps) {
  const { unitId, lessonSlug } = await params;

  const unit = getUnitById(unitId);
  if (!unit) notFound();

  const lesson = getLessonBySlug(unit, lessonSlug);
  if (!lesson) notFound();

  return (
    <>
      <main className="ia-vh-page relative min-h-dvh px-4 py-6 sm:px-6 sm:py-8">
        <div className="mx-auto w-full max-w-xl">
          {/* Back link */}
          <Link
            href={`/student/learn/${unitId}/${lessonSlug}`}
            className="mb-6 inline-flex items-center gap-1 font-sans text-[14px] text-bs-text-sub transition-colors hover:text-bs-text"
          >
            ← Back to lesson
          </Link>

          {/* Header */}
          <h1 className="mb-1 font-sans text-[24px] font-semibold text-bs-text">
            {lesson.title} — Vocabulary
          </h1>
          <p className="mb-8 font-sans text-sm text-bs-text-sub">
            Content-specific terms only
          </p>

          {/* Flashcard deck */}
          <FlashcardDeck lesson={lesson} />
        </div>
      </main>
      <StudentFloatingDock />
      <ThemeToggle />
    </>
  );
}
