import Link from "next/link";
import type { ReactNode } from "react";
import PopulationGeneticsPreview from "@/components/simulations/PopulationGeneticsPreview";
import EnzymeKineticsPreview from "@/components/simulations/EnzymeKineticsPreview";

// ── Design tokens (match teacher dashboard v4 light theme) ───────────────────
const C = {
  ink:      "#0a1a14",
  muted:    "#8aada0",
  surface:  "#ffffff",
  tealDeep: "#003d2e",
  tealDark: "#006e55",
  tealSoft: "#d6f5ed",
  border:   "rgba(0,0,0,0.07)",
  pageBg:   "#f0f4f2",
} as const;

type SimulationCatalogItem = {
  id: string;
  title: string;
  href: string;
  summary: string;
  preview: ReactNode;
  topic: string;
};

const SIMULATIONS: SimulationCatalogItem[] = [
  {
    id: "population-genetics",
    title: "Population Genetics",
    href: "/simulations/population-genetics",
    summary:
      "Model allele frequency change across generations using population size, random drift, and selection pressure.",
    preview: <PopulationGeneticsPreview />,
    topic: "Evolution",
  },
  {
    id: "enzyme-kinetics",
    title: "Enzyme Kinetics Lab",
    href: "/simulations/enzyme-kinetics",
    summary:
      "Investigate lock-and-key specificity, substrate matching, and denaturation effects from temperature and pH shifts.",
    preview: <EnzymeKineticsPreview />,
    topic: "Cellular Processes",
  },
];

export default function SimulationsPage() {
  return (
    <div style={{ minHeight: "100vh", background: C.pageBg, fontFamily: "var(--font-dm-sans), sans-serif" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 20px 60px" }}>

        {/* ── Hero banner ── */}
        <div style={{ background: C.tealDeep, borderRadius: 16, padding: "28px 30px 24px", marginBottom: 24, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -80, right: -60, width: 260, height: 260, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,196,154,0.22) 0%, transparent 70%)", pointerEvents: "none" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginBottom: 4 }}>BioSpark</p>
            <h1 style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: 36, fontWeight: 800, fontStyle: "italic", color: "white", lineHeight: 1.1, marginBottom: 4 }}>
              Simulations ✦
            </h1>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", margin: 0 }}>
              Explore interactive biology simulations and test ideas with live controls.
            </p>
          </div>
        </div>

        {/* ── Simulation cards ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
          {SIMULATIONS.map((sim) => (
            <Link key={sim.id} href={sim.href} style={{ textDecoration: "none" }}>
              <div
                style={{
                  background: C.surface,
                  border: `1px solid ${C.border}`,
                  borderRadius: 16,
                  padding: 20,
                  height: "100%",
                  transition: "box-shadow 0.15s",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 20px rgba(0,0,0,0.10)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; }}
              >
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: C.tealDark, marginBottom: 6 }}>
                  {sim.topic}
                </div>

                <h2 style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: 20, fontWeight: 700, color: C.ink, margin: "0 0 12px" }}>
                  {sim.title}
                </h2>

                {sim.preview}

                <p style={{ fontSize: 13, color: C.muted, margin: "12px 0 16px", lineHeight: 1.5 }}>
                  {sim.summary}
                </p>

                <div style={{ display: "inline-flex", alignItems: "center", background: C.tealSoft, border: `1px solid ${C.tealDark}30`, borderRadius: 10, padding: "7px 14px", fontSize: 12, fontWeight: 700, color: C.tealDark }}>
                  Open Simulation →
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
