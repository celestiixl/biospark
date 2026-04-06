import Link from "next/link";
import { BackLink } from "@/components/nav/BackLink";
import PlantSystemsB12BPhenomenon from "@/components/student/PlantSystemsB12BPhenomenon";

const C = {
  ink:    "#0a1a14",
  muted:  "#8aada0",
  surface:"#ffffff",
  tealDeep:"#003d2e",
  tealDark:"#006e55",
  border: "rgba(0,0,0,0.07)",
  pageBg: "#f0f4f2",
} as const;

export default function PlantSystemsB12BPhenomenonPage() {
  return (
    <div style={{ minHeight: "100vh", background: C.pageBg, fontFamily: "var(--font-dm-sans), sans-serif" }}>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "32px 20px 60px" }}>
        <BackLink href="/student/learn/unit-7" label="Back to unit" />

        <div style={{ background: C.tealDeep, borderRadius: 16, padding: "28px 30px 24px", marginBottom: 24, marginTop: 12 }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "rgba(255,255,255,0.5)" }}>
                Unit 7 • Processes in Plants
              </div>
              <h1 style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: 28, fontWeight: 800, fontStyle: "italic", color: "white", marginTop: 4, marginBottom: 4 }}>
                Plant Systems B.12B Phenomenon ✦
              </h1>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
                Analyze how plant structures facilitate interactions among
                transport, reproduction, and response systems.
              </p>
            </div>
            <div>
              <span style={{ borderRadius: 999, background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)", padding: "4px 12px", fontSize: 12, fontWeight: 600, color: "white" }}>
                TEKS B.12B
              </span>
            </div>
          </div>
        </div>

        <PlantSystemsB12BPhenomenon />

        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20, marginTop: 16 }}>
          <div style={{ fontSize: 13, color: C.muted }}>
            Next step: Complete the standalone Unit 7 lesson and use your
            observations to explain how disruptions in one system affect the
            others.
          </div>
          <div style={{ marginTop: 12 }}>
            <Link
              href="/student/learn/unit-7/plant-systems-b12b"
              style={{ display: "inline-flex", background: C.tealDark, borderRadius: 8, padding: "8px 14px", fontSize: 12, fontWeight: 600, color: "white", textDecoration: "none" }}
            >
              Continue to Lesson →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
