import { notFound } from "next/navigation";
import { getLessonBySlug, getUnitById } from "@/lib/learningHubContent";
import { FlashcardDeck } from "@/components/student/FlashcardDeck";
import { BackLink } from "@/components/nav/BackLink";

const C = {
  ink:    "#0a1a14",
  muted:  "#8aada0",
  pageBg: "#f0f4f2",
} as const;

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
    <div style={{ minHeight: "100vh", background: C.pageBg, fontFamily: "var(--font-dm-sans), sans-serif" }}>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "32px 20px 60px" }}>
        <BackLink href={`/student/learn/${unitId}/${lessonSlug}`} label="Back to lesson" />
        <h1 style={{ fontSize: 24, fontWeight: 600, color: C.ink, marginBottom: 4, marginTop: 16 }}>
          {lesson.title} — Vocabulary
        </h1>
        <p style={{ fontSize: 14, color: C.muted, marginBottom: 32 }}>
          Content-specific terms only
        </p>
        <FlashcardDeck lesson={lesson} />
      </div>
    </div>
  );
}
