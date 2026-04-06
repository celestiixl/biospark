"use client";

import { useMemo, useState } from "react";
import { BackLink } from "@/components/nav/BackLink";

const C = {
  ink:     "#0a1a14",
  muted:   "#8aada0",
  surface: "#ffffff",
  tealDeep:"#003d2e",
  tealSoft:"#d6f5ed",
  border:  "rgba(0,0,0,0.07)",
  pageBg:  "#f0f4f2",
} as const;

type Point = {
  generation: number;
  pA: number;
};

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

function runSimulation(
  generations: number,
  initialPA: number,
  populationSize: number,
  selectionStrength: number,
) {
  const points: Point[] = [{ generation: 0, pA: initialPA }];
  let pA = initialPA;

  for (let g = 1; g <= generations; g += 1) {
    // Selection pushes allele A up (positive) or down (negative).
    const selected = clamp01(pA + selectionStrength * pA * (1 - pA));

    // Drift term scales down as population size increases.
    const driftScale = 1 / Math.sqrt(Math.max(10, populationSize));
    const driftNoise = (Math.random() * 2 - 1) * driftScale;

    pA = clamp01(selected + driftNoise);
    points.push({ generation: g, pA });
  }

  return points;
}

export default function PopulationGeneticsSimulationPage() {
  const [populationSize, setPopulationSize] = useState(120);
  const [initialPA, setInitialPA] = useState(0.5);
  const [selectionStrength, setSelectionStrength] = useState(0.1);
  const [generations, setGenerations] = useState(30);
  const [seed, setSeed] = useState(0);

  const points = useMemo(
    () =>
      runSimulation(generations, initialPA, populationSize, selectionStrength),
    [generations, initialPA, populationSize, selectionStrength, seed],
  );

  const latest = points[points.length - 1];

  return (
    <div style={{ minHeight: "100vh", background: C.pageBg, fontFamily: "var(--font-dm-sans), sans-serif" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px 60px" }}>
        <BackLink href="/simulations" label="Back to simulations" />

        <div style={{ background: C.tealDeep, borderRadius: 16, padding: "28px 30px 24px", marginBottom: 24, marginTop: 12 }}>
          <h1 style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: 28, fontWeight: 800, fontStyle: "italic", color: "white", marginBottom: 4 }}>
            Population Genetics Simulation ✦
          </h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
            Explore how allele frequency changes over time with drift and selection.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 20 }}>
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.ink }}>Controls</div>

            <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 16 }}>
              <label style={{ display: "block" }}>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: C.muted }}>
                  Population Size: {populationSize}
                </div>
                <input
                  aria-label="Population size"
                  type="range"
                  min={30}
                  max={1000}
                  step={10}
                  value={populationSize}
                  onChange={(e) => setPopulationSize(Number(e.target.value))}
                  style={{ marginTop: 8, width: "100%" }}
                />
              </label>

              <label style={{ display: "block" }}>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: C.muted }}>
                  Initial Allele A (p): {initialPA.toFixed(2)}
                </div>
                <input
                  aria-label="Initial allele frequency"
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={initialPA}
                  onChange={(e) => setInitialPA(Number(e.target.value))}
                  style={{ marginTop: 8, width: "100%" }}
                />
              </label>

              <label style={{ display: "block" }}>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: C.muted }}>
                  Selection Strength: {selectionStrength.toFixed(2)}
                </div>
                <input
                  aria-label="Selection strength"
                  type="range"
                  min={-0.4}
                  max={0.4}
                  step={0.01}
                  value={selectionStrength}
                  onChange={(e) =>
                    setSelectionStrength(Number(e.target.value))
                  }
                  style={{ marginTop: 8, width: "100%" }}
                />
              </label>

              <label style={{ display: "block" }}>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: C.muted }}>
                  Generations: {generations}
                </div>
                <input
                  aria-label="Number of generations"
                  type="range"
                  min={5}
                  max={100}
                  step={1}
                  value={generations}
                  onChange={(e) => setGenerations(Number(e.target.value))}
                  style={{ marginTop: 8, width: "100%" }}
                />
              </label>
            </div>

            <div style={{ marginTop: 20 }}>
              <button
                type="button"
                onClick={() => setSeed((s) => s + 1)}
                style={{ background: C.tealDeep, color: "white", border: "none", borderRadius: 10, padding: "10px 20px", fontSize: 14, fontWeight: 600, cursor: "pointer", width: "100%" }}
              >
                Rerun Simulation
              </button>
            </div>
          </div>

          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.ink }}>
                Allele Frequency Over Time
              </div>
              <div style={{ marginTop: 4, fontSize: 12, color: C.muted }}>
                p(A) final: {latest.pA.toFixed(3)} | q(a) final:{" "}
                {(1 - latest.pA).toFixed(3)}
              </div>
            </div>

            <div style={{ marginTop: 16, maxHeight: 384, overflowY: "auto", borderRadius: 12, border: `1px solid ${C.border}` }}>
              <table style={{ minWidth: "100%", fontSize: 14, borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: C.tealSoft }}>
                    <th style={{ padding: "8px 12px", textAlign: "left", fontWeight: 600, color: C.ink }}>
                      Generation
                    </th>
                    <th style={{ padding: "8px 12px", textAlign: "left", fontWeight: 600, color: C.ink }}>
                      p(A)
                    </th>
                    <th style={{ padding: "8px 12px", textAlign: "left", fontWeight: 600, color: C.ink }}>
                      q(a)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {points.map((point) => (
                    <tr key={point.generation} style={{ borderTop: `1px solid ${C.border}` }}>
                      <td style={{ padding: "8px 12px", color: C.muted }}>
                        {point.generation}
                      </td>
                      <td style={{ padding: "8px 12px", fontFamily: "monospace", color: C.ink }}>
                        {point.pA.toFixed(3)}
                      </td>
                      <td style={{ padding: "8px 12px", fontFamily: "monospace", color: C.ink }}>
                        {(1 - point.pA).toFixed(3)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
