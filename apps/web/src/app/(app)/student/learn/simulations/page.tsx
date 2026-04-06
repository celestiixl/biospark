import Link from "next/link";
import { BackLink } from "@/components/nav/BackLink";

const C = {
  ink:     "#0a1a14",
  muted:   "#8aada0",
  surface: "#ffffff",
  tealDeep:"#003d2e",
  tealDark:"#006e55",
  border:  "rgba(0,0,0,0.07)",
  pageBg:  "#f0f4f2",
} as const;

const SIMULATIONS = [
  {
    slug: "bottle-ecosystem-cycles",
    title: "Bottle Ecosystem Cycles Lab",
    description:
      "Build a sealed bottle ecosystem and observe how water, carbon, and nitrogen cycle through the system. Predict outcomes and complete a CER reflection.",
    teks: ["B.12A", "B.12B"],
    duration: "20 min",
    icon: "🍶",
  },
  {
    slug: "population-genetics",
    title: "Population Genetics Simulator",
    description:
      "Explore Hardy-Weinberg equilibrium, genetic drift, natural selection, and population bottlenecks through interactive graphs.",
    teks: ["B.6A", "B.6B"],
    duration: "15 min",
    icon: "🧬",
  },
  {
    slug: "ecological-succession",
    title: "Ecological Succession",
    description:
      "Step through primary and secondary succession scenarios and observe how ecosystems recover and change over time.",
    teks: ["B.6D"],
    duration: "15 min",
    icon: "🌿",
  },
  {
    slug: "genome-browser",
    title: "Genome Browser",
    description:
      "Explore gene sequences, annotations, and chromosomal regions",
    teks: ["B.7A", "B.7C"],
    duration: "15 min",
    icon: "🧬",
  },
];

export default function SimulationsPage() {
  return (
    <div style={{ minHeight: "100vh", background: C.pageBg, fontFamily: "var(--font-dm-sans), sans-serif" }}>
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "32px 20px 60px" }}>
        <BackLink href="/student/learn" label="Back to learn" />

        <div style={{ background: C.tealDeep, borderRadius: 16, padding: "28px 30px 24px", marginBottom: 24, marginTop: 12 }}>
          <h1 style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: 28, fontWeight: 800, fontStyle: "italic", color: "white", marginBottom: 4 }}>
            🔬 Simulations ✦
          </h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
            Interactive labs and simulations aligned to FBISD Biology TEKS.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {SIMULATIONS.map((sim) => (
            <article
              key={sim.slug}
              style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20 }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                <span style={{ fontSize: 28 }} aria-hidden>
                  {sim.icon}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: C.muted }}>
                    Simulation • {sim.duration}
                  </div>
                  <h2 style={{ fontSize: 15, fontWeight: 600, color: C.ink, marginTop: 2 }}>
                    {sim.title}
                  </h2>
                  <p style={{ fontSize: 13, color: C.muted, marginTop: 4, lineHeight: 1.5 }}>
                    {sim.description}
                  </p>
                  <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {sim.teks.map((t) => (
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
                      href={`/student/learn/simulations/${sim.slug}`}
                      style={{ display: "inline-flex", background: C.tealDark, borderRadius: 10, padding: "8px 14px", fontSize: 12, fontWeight: 600, color: "white", textDecoration: "none" }}
                    >
                      Open Simulation →
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
