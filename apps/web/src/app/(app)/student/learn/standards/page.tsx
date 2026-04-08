"use client";

import { useMemo } from "react";
import Link from "next/link";
import { BackLink } from "@/components/nav/BackLink";
import { buildTeksHeatmap, getWeakestTeks } from "@/lib/learningInsights";
import { loadLearningProgress } from "@/lib/learningProgress";
import { isPriorityTeks } from "@/lib/curriculumPolicy";
import TeksTag from "@/components/ui/TeksTag";

// ─── TEKS plain-language labels ───────────────────────────────────────────────
const TEKS_LABELS: Record<string, string> = {
  "B.1A": "Ask Questions & Define Problems",
  "B.1B": "Plan & Conduct Investigations",
  "B.1C": "Scientific Reasoning",
  "B.1D": "Lab Tools & Equipment",
  "B.1E": "Scientific Data",
  "B.1F": "Science & Society",
  "B.1G": "Models in Science",
  "B.2A": "Model Advantages & Limits",
  "B.2B": "Data Analysis",
  "B.3A": "Data-Supported Explanations",
  "B.3B": "Communicate Findings",
  "B.3C": "Peer Review",
  "B.4B": "Science Connections",
  "B.4C": "Science Applications",
  "B.5A": "Biomolecule Functions",
  "B.5B": "Prokaryotic vs Eukaryotic Cells",
  "B.5C": "Cell Transport & Homeostasis",
  "B.7A": "DNA Structure & Replication",
  "B.7B": "Gene Expression & Protein Synthesis",
  "B.7C": "DNA Changes & Mutations",
  "B.7D": "Molecular Technologies",
  "B.8B": "Genetic Crosses & Inheritance",
  "B.11A": "Photosynthesis & Cellular Respiration",
  "B.11B": "Enzyme Roles in Cells",
  "B.12B": "Plant Systems & Structures",
};

// ─── Heatmap color helpers ────────────────────────────────────────────────────
function getHeatmapStyle(avgCheck: number): { bg: string; text: string; border: string } {
  if (avgCheck >= 75) return { bg: "#d6f0e4", text: "#0d4a2f", border: "#1a7a4e" };
  if (avgCheck >= 40) return { bg: "#d6ede6", text: "#0d4a2f", border: "#4a8a6e" };
  return { bg: "#fde8e0", text: "#c04a20", border: "#e05a2a" };
}

const CARD_STYLE: React.CSSProperties = {
  backgroundColor: "#ffffff",
  border: "1px solid rgba(10,60,30,0.10)",
  borderRadius: "12px",
  padding: "20px",
  boxShadow: "0 1px 4px rgba(10,60,30,0.06)",
};

export default function StandardsHeatmapPage() {
  const progress = useMemo(() => loadLearningProgress(), []);
  const rows = useMemo(() => buildTeksHeatmap(progress), [progress]);
  const weakest = useMemo(() => getWeakestTeks(progress, 3), [progress]);

  return (
    <main
      className="mx-auto min-h-screen w-full max-w-6xl p-6"
      style={{ backgroundColor: "#eef3ee", color: "#1a2e22" }}
    >
      <BackLink href="/student/learn" label="Back to hub" />

      {/* Header card */}
      <section style={CARD_STYLE}>
        <h1
          style={{
            fontFamily: "var(--font-lora, 'Lora', Georgia, serif)",
            fontStyle: "italic",
            fontWeight: 700,
            fontSize: "24px",
            color: "#0d4a2f",
            margin: 0,
          }}
        >
          Standards Heatmap
        </h1>
        <p style={{ marginTop: "6px", fontSize: "14px", color: "#5a7a66", maxWidth: "640px" }}>
          This heatmap shows how well you know each biology standard.{" "}
          <strong style={{ color: "#0d4a2f" }}>Darker green = stronger mastery</strong>,{" "}
          <span style={{ color: "#4a8a6e" }}>lighter teal = progressing</span>,{" "}
          <span style={{ color: "#c04a20" }}>salmon = needs more practice</span>.
        </p>
      </section>

      {/* Weakest 3 */}
      <section style={{ ...CARD_STYLE, marginTop: "16px", backgroundColor: "#fde8e0", border: "1px solid #e05a2a" }}>
        <h2
          style={{
            fontFamily: "var(--font-lora, 'Lora', Georgia, serif)",
            fontWeight: 700,
            fontSize: "16px",
            color: "#c04a20",
            margin: 0,
          }}
        >
          ⚠ Focus Here — Your 3 Weakest Standards
        </h2>
        <p style={{ marginTop: "4px", fontSize: "13px", color: "#c04a20", marginBottom: "12px" }}>
          Practicing these will boost your mastery the most.
        </p>
        <div className="grid gap-3 md:grid-cols-3">
          {weakest.map((row) => {
            const hs = getHeatmapStyle(row.avgCheck);
            const priority = isPriorityTeks(row.teks);
            return (
              <div
                key={row.teks}
                style={{
                  backgroundColor: hs.bg,
                  border: `1px solid ${hs.border}`,
                  borderRadius: "10px",
                  padding: "12px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                  <TeksTag code={row.teks} priority={priority} />
                  {priority && (
                    <span style={{ fontSize: "9px", fontWeight: 700, color: "#1a7a4e", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      Priority
                    </span>
                  )}
                </div>
                <div style={{ fontSize: "13px", fontWeight: 600, color: hs.text, marginBottom: "6px" }}>
                  {TEKS_LABELS[row.teks] ?? row.teks}
                </div>
                <div style={{ fontSize: "22px", fontWeight: 700, color: hs.text, marginBottom: "2px" }}>
                  {row.avgCheck}%
                </div>
                <div style={{ fontSize: "11px", color: hs.text, opacity: 0.75, marginBottom: "8px" }}>
                  {row.completionPct}% lessons completed
                </div>
                <Link
                  href={`/student/learn?focus=${encodeURIComponent(row.teks)}`}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    backgroundColor: "#0d4a2f",
                    color: "#d6f0e4",
                    fontSize: "12px",
                    fontWeight: 600,
                    borderRadius: "8px",
                    padding: "5px 12px",
                    textDecoration: "none",
                  }}
                >
                  Practice this →
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* Full heatmap table */}
      <section style={{ ...CARD_STYLE, marginTop: "16px" }}>
        <h2
          style={{
            fontFamily: "var(--font-lora, 'Lora', Georgia, serif)",
            fontWeight: 700,
            fontSize: "16px",
            color: "#0d4a2f",
            margin: "0 0 12px 0",
          }}
        >
          All Standards
        </h2>
        <div className="overflow-x-auto">
          <table style={{ width: "100%", minWidth: "640px", fontSize: "14px", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(10,60,30,0.10)", textAlign: "left" }}>
                {["Standard", "Topic", "Mastery", "Completion", "Status"].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "8px 12px 8px 0",
                      fontSize: "11px",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      color: "#6a9a82",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const hs = getHeatmapStyle(row.avgCheck);
                const priority = isPriorityTeks(row.teks);
                return (
                  <tr
                    key={row.teks}
                    style={{ borderBottom: "1px solid rgba(10,60,30,0.07)" }}
                  >
                    <td style={{ padding: "10px 12px 10px 0" }}>
                      <TeksTag code={row.teks} priority={priority} />
                    </td>
                    <td style={{ padding: "10px 12px 10px 0", color: "#1a2e22", fontWeight: 500 }}>
                      {TEKS_LABELS[row.teks] ?? "—"}
                    </td>
                    <td style={{ padding: "10px 12px 10px 0", fontWeight: 700, color: hs.text }}>
                      {row.avgCheck}%
                    </td>
                    <td style={{ padding: "10px 12px 10px 0", color: "#5a7a66" }}>
                      {row.completionPct}%
                    </td>
                    <td style={{ padding: "10px 12px 10px 0" }}>
                      <span
                        style={{
                          display: "inline-block",
                          backgroundColor: hs.bg,
                          color: hs.text,
                          border: `1px solid ${hs.border}`,
                          borderRadius: "20px",
                          padding: "2px 10px",
                          fontSize: "11px",
                          fontWeight: 600,
                        }}
                      >
                        {row.proficiency.replace("-", " ")}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
