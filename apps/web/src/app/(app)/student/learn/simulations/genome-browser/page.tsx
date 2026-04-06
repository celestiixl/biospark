"use client";

/**
 * Genome Browser page – Interactive sequence and annotation navigator.
 * Route: /student/genome-browser
 * TEKS: B.7A (DNA components, nucleotide sequence specifies traits), B.7C (DNA changes).
 */

import Link from "next/link";
import { useState } from "react";
import GenomeBrowser from "@/components/student/GenomeBrowser";
import {
  DEMO_SEQUENCES,
  DEFAULT_SEQUENCE_ID,
} from "@/data/genomeBrowserData";
import { BackLink } from "@/components/nav/BackLink";

const BASE_COLOR_LEGEND = [
  { base: "A", color: "bg-green-500",  label: "Adenine" },
  { base: "T", color: "bg-red-500",    label: "Thymine" },
  { base: "C", color: "bg-blue-500",   label: "Cytosine" },
  { base: "G", color: "bg-amber-500",  label: "Guanine" },
];

export default function GenomeBrowserPage() {
  const [activeId, setActiveId] = useState(DEFAULT_SEQUENCE_ID);

  const activeSeq =
    DEMO_SEQUENCES.find((s) => s.id === activeId) ?? DEMO_SEQUENCES[0];

  return (
    <main style={{ minHeight: "100vh", background: "#f0f4f2", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "16px 20px 8px" }}>
        <BackLink href="/student/dashboard" label="Back to dashboard" />
      </div>
      <div style={{ background: "#003d2e", padding: "20px 24px", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: 24, fontWeight: 800, fontStyle: "italic", color: "white", marginBottom: 4 }}>
              🧬 Genome Browser ✦
            </h1>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
              Navigate DNA sequences and gene annotations interactively • TEKS B.7A, B.7C
            </p>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            <Link
              href="/student/learn"
              style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 10, padding: "8px 20px", fontSize: 13, fontWeight: 600, color: "white", textDecoration: "none" }}
            >
              Learning Hub
            </Link>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, padding: "0 20px 40px", overflowY: "auto" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", flexDirection: "column", gap: 24, paddingRight: 4 }}>

          {/* ── Sequence selector ──────────────────────────────────────── */}
          {DEMO_SEQUENCES.length > 1 && (
            <div className="flex flex-wrap gap-2">
              {DEMO_SEQUENCES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActiveId(s.id)}
                  className={`rounded-bs border px-4 py-2 text-sm font-semibold transition ${
                    activeId === s.id
                      ? "bg-indigo-600 border-indigo-600 text-white shadow"
                      : "bg-bs-surface border-[var(--bs-border)] text-bs-text-sub hover:bg-[var(--bs-raised)]"
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          )}

          {/* ── Sequence metadata card ─────────────────────────────────── */}
          <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-indigo-900">
                  {activeSeq.name}
                </h2>
                <p className="mt-1 text-sm text-indigo-700">
                  {activeSeq.description}
                </p>
                <div className="mt-2 flex flex-wrap gap-3 text-xs text-indigo-600">
                  <span>🦠 {activeSeq.organism}</span>
                  <span>📍 {activeSeq.chromosome}</span>
                  <span>📏 {activeSeq.sequence.length} bp</span>
                  <span>🔖 {activeSeq.annotations.length} annotations</span>
                </div>
              </div>

              {/* Base color legend */}
              <div className="flex flex-wrap gap-2">
                {BASE_COLOR_LEGEND.map(({ base, color, label }) => (
                  <div key={base} className="flex items-center gap-1.5">
                    <span className={`h-4 w-4 rounded ${color} flex items-center justify-center text-[9px] font-bold text-white`}>
                      {base}
                    </span>
                    <span className="text-xs text-indigo-700">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Browser ────────────────────────────────────────────────── */}
          <GenomeBrowser sequence={activeSeq} />

          {/* ── Educational context ────────────────────────────────────── */}
          <section className="rounded-2xl border border-[var(--bs-border)] bg-bs-surface p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-bs-text">
              About Genome Browsers
            </h2>
            <p className="text-sm text-bs-text-sub leading-relaxed">
              A <strong>genome browser</strong> is a bioinformatics tool that lets scientists
              navigate and visualize genomic sequences and their annotations. Professional
              browsers like the{" "}
              <span className="font-semibold">UCSC Genome Browser</span> and{" "}
              <span className="font-semibold">Ensembl</span> display the complete human
              genome (~3.2 billion bp) with thousands of annotation tracks.
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-bs border border-[var(--bs-border)] bg-[var(--bs-raised)] p-4">
                <div className="text-sm font-bold text-bs-text mb-2">🧬 TEKS B.7A Connection</div>
                <p className="text-xs text-bs-text-sub leading-relaxed">
                  The sequence displayed here shows how{" "}
                  <strong>nucleotide order specifies traits</strong>. The ATG start codon,
                  coding exons, and TAA stop codon together define the protein sequence.
                  Changing even one base can alter the protein — demonstrating how
                  nucleotide sequence specifies traits.
                </p>
              </div>
              <div className="rounded-bs border border-[var(--bs-border)] bg-[var(--bs-raised)] p-4">
                <div className="text-sm font-bold text-bs-text mb-2">🔬 TEKS B.7C Connection</div>
                <p className="text-xs text-bs-text-sub leading-relaxed">
                  The <strong>pink mutation markers</strong> in the browser show examples
                  of a point mutation (single nucleotide substitution) and a missense
                  mutation. Click them to see how{" "}
                  <strong>changes in DNA sequence</strong> can affect gene function,
                  potentially altering the amino acid sequence of the protein or
                  disrupting splicing signals.
                </p>
              </div>
            </div>

            <div className="rounded-bs border border-blue-100 bg-blue-50 p-4">
              <div className="text-sm font-bold text-blue-900 mb-2">🗺️ How to Use This Browser</div>
              <ul className="text-xs text-blue-800 leading-relaxed space-y-1 list-inside list-disc">
                <li>Use <strong>Pan ◀ ▶</strong> buttons to scroll along the sequence</li>
                <li>Use <strong>🔍+ / 🔍−</strong> to zoom in and see individual bases or zoom out for the whole region</li>
                <li>Click any <strong>colored annotation bar</strong> to see its biological description</li>
                <li>Toggle <strong>Show Complement</strong> to reveal the antiparallel strand</li>
                <li>Click any feature in the <strong>All Features</strong> table to jump to it</li>
                <li>Use <strong>Filter</strong> pills to highlight specific feature types</li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
