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

export default function Unit7Page() {
  const unit = getUnitById("unit-7");
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
          <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 6 }}>
            {unit.instructionalDays ? (
              <span style={{ borderRadius: 999, background: "rgba(255,255,255,0.15)", padding: "2px 10px", fontSize: 11, fontWeight: 600, color: "white" }}>
                {unit.instructionalDays} instructional days
              </span>
            ) : null}
            {unit.dateRange ? (
              <span style={{ borderRadius: 999, background: "rgba(255,255,255,0.15)", padding: "2px 10px", fontSize: 11, fontWeight: 600, color: "white" }}>
                {unit.dateRange}
              </span>
            ) : null}
          </div>
          <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 6 }}>
            {unit.teks.map((teks) => (
              <span
                key={teks}
                style={{ borderRadius: 999, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", padding: "2px 10px", fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.8)" }}
              >
                {teks}
              </span>
            ))}
            {unit.priorityTeks.map((teks) => (
              <span
                key={`priority-${teks}`}
                style={{ borderRadius: 999, border: "1px solid #bbf7d0", background: "rgba(0,196,154,0.15)", padding: "2px 10px", fontSize: 11, fontWeight: 600, color: "#6ee7b7" }}
              >
                {teks} ★ Priority
              </span>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: C.ink, marginBottom: 4 }}>
              Lessons in this Unit
            </h2>
            <p style={{ fontSize: 13, color: C.muted, marginBottom: 16 }}>
              {unit.lessons.length} lessons • Work through them in order.
            </p>

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
                  <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {lesson.teks?.map((t) => (
                      <span
                        key={t}
                        style={{ borderRadius: 999, border: "1px solid #bbf7d0", background: "#f0fdf4", padding: "2px 8px", fontSize: 11, fontWeight: 600, color: "#166534" }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <div style={{ marginTop: 12 }}>
                    <Link
                      href={`/student/learn/${unit.id}/${lesson.slug}`}
                      style={{ display: "inline-flex", background: C.tealDark, borderRadius: 8, padding: "8px 14px", fontSize: 12, fontWeight: 600, color: "white", textDecoration: "none" }}
                    >
                      Open Lesson →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: C.ink, marginBottom: 12 }}>
              Supplemental Resources
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <article style={{ border: `1px solid ${C.border}`, borderRadius: 12, padding: 16, background: "#f9fbfa" }}>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: C.muted }}>
                  Phenomenon • 12 min
                </div>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: C.ink, marginTop: 4 }}>
                  Plant Systems B.12B — Buffalo Bayou Phenomenon
                </h3>
                <p style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>
                  Explore a Buffalo Bayou flooding scenario and identify how plant
                  systems depend on each other.
                </p>
                <div style={{ marginTop: 12 }}>
                  <Link
                    href="/student/learn/unit-7/plant-systems-b12b-phenomenon"
                    style={{ display: "inline-flex", border: `1px solid ${C.border}`, background: C.surface, borderRadius: 8, padding: "8px 14px", fontSize: 12, fontWeight: 600, color: C.muted, textDecoration: "none" }}
                  >
                    Open Phenomenon →
                  </Link>
                </div>
              </article>

              <article style={{ border: `1px solid ${C.border}`, borderRadius: 12, padding: 16, background: "#f9fbfa" }}>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: C.muted }}>
                  Simulation • 20 min
                </div>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: C.ink, marginTop: 4 }}>
                  Bottle Ecosystem Cycles Lab
                </h3>
                <p style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>
                  Build a sealed bottle ecosystem and observe how water, carbon,
                  and nitrogen cycle through the system.
                </p>
                <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 6 }}>
                  <span style={{ borderRadius: 999, border: "1px solid #bbf7d0", background: "#f0fdf4", padding: "2px 8px", fontSize: 11, fontWeight: 600, color: "#166534" }}>
                    B.12A
                  </span>
                  <span style={{ borderRadius: 999, border: "1px solid #bbf7d0", background: "#f0fdf4", padding: "2px 8px", fontSize: 11, fontWeight: 600, color: "#166534" }}>
                    B.12B
                  </span>
                </div>
                <div style={{ marginTop: 12 }}>
                  <Link
                    href="/student/learn/simulations/bottle-ecosystem-cycles"
                    style={{ display: "inline-flex", border: `1px solid ${C.border}`, background: C.surface, borderRadius: 8, padding: "8px 14px", fontSize: 12, fontWeight: 600, color: C.muted, textDecoration: "none" }}
                  >
                    Open Simulation →
                  </Link>
                </div>
              </article>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
