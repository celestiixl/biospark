import Link from "next/link";
import { notFound } from "next/navigation";
import { getUnitById } from "@/lib/learningHubContent";
import { BackLink } from "@/components/nav/BackLink";

const C = {
  ink:    "#0a1a14",
  muted:  "#8aada0",
  surface:"#ffffff",
  tealDeep:"#003d2e",
  tealDark:"#006e55",
  border: "rgba(0,0,0,0.07)",
  pageBg: "#f0f4f2",
} as const;

export default function Unit3PageStub() {
  const unit = getUnitById("unit-3");
  if (!unit) notFound();

  return (
    <div style={{ minHeight: "100vh", background: C.pageBg, fontFamily: "var(--font-dm-sans), sans-serif" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px 60px" }}>
        <BackLink href="/student/learn" label="Back to hub" />

        <div style={{ background: C.tealDeep, borderRadius: 16, padding: "28px 30px 24px", marginBottom: 24, marginTop: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "rgba(255,255,255,0.5)" }}>
            Grading Period {unit.gradingPeriod}
          </div>
          <h1 style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: 28, fontWeight: 800, fontStyle: "italic", color: "white", marginTop: 4, marginBottom: 4 }}>
            Unit {unit.unitNumber}: {unit.title} ✦
          </h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
            {unit.objective}
          </p>
        </div>

        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: C.ink, marginBottom: 12 }}>
            Lessons in this Unit
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {unit.lessons.map((lesson, index) => (
              <article
                key={lesson.id}
                style={{ border: `1px solid ${C.border}`, borderRadius: 12, padding: 16, background: "#f9fbfa" }}
              >
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: C.muted }}>
                  Lesson {index + 1} • {lesson.type} • {lesson.minutes} min
                </div>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: C.ink, marginTop: 4 }}>
                  {lesson.title}
                </h3>
                <p style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>{lesson.summary}</p>
                <div style={{ marginTop: 12 }}>
                  <Link
                    href={`/student/learn/${unit.id}/${lesson.slug}`}
                    style={{ display: "inline-flex", background: C.tealDark, borderRadius: 8, padding: "8px 14px", fontSize: 12, fontWeight: 600, color: "white", textDecoration: "none" }}
                  >
                    Open Lesson
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
