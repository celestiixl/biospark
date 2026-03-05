"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

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
    <main className="mx-auto w-full max-w-6xl p-6 text-slate-900">
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">Curriculum Import Validator</h1>
            <p className="mt-1 text-sm text-slate-600">
              Paste structured curriculum JSON to preview and validate before
              publishing.
            </p>
            <p className="mt-1 text-xs font-semibold text-amber-700">
              Current implementation scope: FBISD Biology Units 1-2 only.
            </p>
          </div>
          <Link
            href="/teacher/dashboard"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Back to Dashboard
          </Link>
        </div>
      </section>

      <section className="mt-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <label className="text-sm font-semibold text-slate-900">
          Import payload (JSON)
        </label>
        <textarea
          value={payload}
          onChange={(event) => setPayload(event.target.value)}
          rows={14}
          className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 font-mono text-xs"
        />
      </section>

      <section className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">Validation</h2>
          <div className="mt-2 space-y-2 text-sm">
            {errors.length === 0 ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-emerald-800">
                No validation errors found.
              </div>
            ) : (
              errors.map((error) => (
                <div
                  key={error}
                  className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-rose-800"
                >
                  {error}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">Preview</h2>
          <div className="mt-2 space-y-2 text-sm text-slate-700">
            {parsed.rows.slice(0, 8).map((unit) => (
              <div
                key={unit.id}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2"
              >
                <div className="font-semibold">
                  {unit.id} • {unit.title}
                </div>
                <div className="text-xs text-slate-500">
                  TEKS: {(unit.teks || []).join(", ") || "—"}
                </div>
                <div className="text-xs text-slate-500">
                  Lessons: {unit.lessons?.length ?? 0}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
