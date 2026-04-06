"use client";

import { useMemo, useState } from "react";
import { BackLink } from "@/components/nav/BackLink";

type ImportedUnit = {
  id: string;
  title: string;
  teks: string[];
  lessons: { slug: string; title: string }[];
};

function validateUnits(units: ImportedUnit[]) {
  const errors: string[] = [];
  const seenIds = new Set<string>();
  const seenSlugs = new Set<string>();

  for (const unit of units) {
    if (!unit.id || !unit.title) {
      errors.push(`Unit is missing required id/title: ${JSON.stringify(unit)}`);
      continue;
    }
    if (seenIds.has(unit.id)) {
      errors.push(`Duplicate unit id: ${unit.id}`);
    }
    seenIds.add(unit.id);

    if (!Array.isArray(unit.teks) || unit.teks.length === 0) {
      errors.push(`Unit ${unit.id} is missing TEKS.`);
    }

    if (!Array.isArray(unit.lessons) || unit.lessons.length === 0) {
      errors.push(`Unit ${unit.id} has no lessons.`);
      continue;
    }

    for (const lesson of unit.lessons) {
      if (!lesson.slug || !lesson.title) {
        errors.push(`Lesson in ${unit.id} missing slug/title.`);
        continue;
      }
      const key = `${unit.id}:${lesson.slug}`;
      if (seenSlugs.has(key)) {
        errors.push(`Duplicate lesson slug in ${unit.id}: ${lesson.slug}`);
      }
      seenSlugs.add(key);
    }
  }

  return errors;
}

export default function TeacherImportCurriculumPage() {
  const [payload, setPayload] = useState("[]");

  const parsed = useMemo(() => {
    try {
      const rows = JSON.parse(payload) as ImportedUnit[];
      return { rows, parseError: null as string | null };
    } catch (error: any) {
      return {
        rows: [] as ImportedUnit[],
        parseError: error?.message ?? "Invalid JSON",
      };
    }
  }, [payload]);

  const errors = useMemo(() => {
    if (parsed.parseError) return [parsed.parseError];
    return validateUnits(parsed.rows);
  }, [parsed]);

  return (
    <div style={{ minHeight: "100vh", background: "#f0f4f2", fontFamily: "var(--font-dm-sans), sans-serif" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px 60px" }}>
        <BackLink href="/teacher/dashboard" label="Back to dashboard" />

        <div style={{ background: "#003d2e", borderRadius: 16, padding: "28px 30px 24px", marginBottom: 24, marginTop: 12 }}>
          <h1 style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: 28, fontWeight: 800, fontStyle: "italic", color: "white", marginBottom: 4 }}>
            Curriculum Import Validator ✦
          </h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
            Paste structured curriculum JSON to preview and validate before publishing.
          </p>
          <p style={{ fontSize: 12, color: "rgba(245,168,0,0.9)", marginTop: 4, fontWeight: 600 }}>
            Current implementation scope: FBISD Biology Units 1-2 only.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: "white", border: "1px solid rgba(0,0,0,0.07)", borderRadius: 16, padding: 20 }}>
            <label style={{ fontSize: 14, fontWeight: 600, color: "#0a1a14" }}>
              Import payload (JSON)
            </label>
            <textarea
              value={payload}
              onChange={(event) => setPayload(event.target.value)}
              rows={14}
              style={{ marginTop: 8, width: "100%", border: "1px solid rgba(0,0,0,0.07)", borderRadius: 12, padding: 12, fontFamily: "monospace", fontSize: 12, background: "#f0f4f2", color: "#0a1a14", resize: "vertical", boxSizing: "border-box" }}
            />
          </div>

          <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
            <div style={{ background: "white", border: "1px solid rgba(0,0,0,0.07)", borderRadius: 16, padding: 20 }}>
              <h2 style={{ fontSize: 14, fontWeight: 600, color: "#0a1a14" }}>Validation</h2>
              <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 8, fontSize: 13 }}>
                {errors.length === 0 ? (
                  <div style={{ border: "1px solid #bbf7d0", background: "#f0fdf4", borderRadius: 8, padding: "8px 12px", color: "#166534" }}>
                    No validation errors found.
                  </div>
                ) : (
                  errors.map((error) => (
                    <div
                      key={error}
                      style={{ border: "1px solid #fecaca", background: "#fef2f2", borderRadius: 8, padding: "8px 12px", color: "#991b1b" }}
                    >
                      {error}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div style={{ background: "white", border: "1px solid rgba(0,0,0,0.07)", borderRadius: 16, padding: 20 }}>
              <h2 style={{ fontSize: 14, fontWeight: 600, color: "#0a1a14" }}>Preview</h2>
              <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 8, fontSize: 13, color: "#8aada0" }}>
                {parsed.rows.slice(0, 8).map((unit) => (
                  <div
                    key={unit.id}
                    style={{ border: "1px solid rgba(0,0,0,0.07)", background: "#f0f4f2", borderRadius: 8, padding: "8px 12px" }}
                  >
                    <div style={{ fontWeight: 600, color: "#0a1a14" }}>
                      {unit.id} • {unit.title}
                    </div>
                    <div style={{ fontSize: 11 }}>
                      TEKS: {(unit.teks || []).join(", ") || "—"}
                    </div>
                    <div style={{ fontSize: 11 }}>
                      Lessons: {unit.lessons?.length ?? 0}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
