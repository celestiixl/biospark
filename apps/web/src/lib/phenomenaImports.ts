export type ImportStatus = "pending" | "approved" | "rejected";

export type ImportedPhenomenon = {
  id: string;
  slug: string;
  title: string;
  html: string;
  createdAt: string;
  requestedBy: string;
  status: ImportStatus;
  approvedBy?: string;
  approvedAt?: string;
};

const IMPORTS_KEY = "biospark.phenomena.imports.v1";

function nowIso() {
  return new Date().toISOString();
}

function makeId() {
  return `imp_${Math.random().toString(36).slice(2, 10)}_${Date.now()}`;
}

export function isSiteAdminEmail(email?: string | null) {
  if (!email) return false;
  const e = email.toLowerCase().trim();
  return e === "teacher@biospark.app" || e.endsWith("@biospark.app");
}

export function slugifyTitle(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 64);
}

export function extractHtmlTitle(html: string) {
  const m = html.match(/<title>([\s\S]*?)<\/title>/i);
  const title = (m?.[1] ?? "Untitled Imported Phenomenon").trim();
  return title || "Untitled Imported Phenomenon";
}

function readAllUnsafe(): ImportedPhenomenon[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(IMPORTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ImportedPhenomenon[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAllUnsafe(items: ImportedPhenomenon[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(IMPORTS_KEY, JSON.stringify(items));
}

export function loadImportedPhenomena() {
  return readAllUnsafe().sort((a, b) =>
    a.createdAt < b.createdAt ? 1 : a.createdAt > b.createdAt ? -1 : 0,
  );
}

export function submitImportedPhenomenon(params: {
  html: string;
  requestedBy: string;
  requestedByIsAdmin: boolean;
}) {
  const cleanHtml = params.html.trim();
  if (!cleanHtml) {
    return { ok: false as const, error: "Paste HTML before submitting." };
  }
  if (!/^\s*<!doctype html>|^\s*<html[\s>]/i.test(cleanHtml)) {
    return {
      ok: false as const,
      error:
        "Only full HTML documents are supported (starting with <!doctype html> or <html>).",
    };
  }

  const all = readAllUnsafe();
  const title = extractHtmlTitle(cleanHtml);
  const baseSlug = slugifyTitle(title) || "imported-phenomenon";

  let slug = baseSlug;
  let i = 2;
  const existingSlugs = new Set(all.map((p) => p.slug));
  while (existingSlugs.has(slug)) {
    slug = `${baseSlug}-${i}`;
    i += 1;
  }

  const isApproved = params.requestedByIsAdmin;
  const item: ImportedPhenomenon = {
    id: makeId(),
    slug,
    title,
    html: cleanHtml,
    createdAt: nowIso(),
    requestedBy: params.requestedBy || "anonymous",
    status: isApproved ? "approved" : "pending",
    approvedBy: isApproved ? params.requestedBy : undefined,
    approvedAt: isApproved ? nowIso() : undefined,
  };

  writeAllUnsafe([item, ...all]);
  return { ok: true as const, item };
}

export function approveImportedPhenomenon(id: string, approverEmail: string) {
  const all = readAllUnsafe();
  let changed = false;
  const next = all.map((entry) => {
    if (entry.id !== id) return entry;
    changed = true;
    return {
      ...entry,
      status: "approved" as const,
      approvedBy: approverEmail,
      approvedAt: nowIso(),
    };
  });
  if (changed) writeAllUnsafe(next);
  return changed;
}

export function rejectImportedPhenomenon(id: string) {
  const all = readAllUnsafe();
  let changed = false;
  const next = all.map((entry) => {
    if (entry.id !== id) return entry;
    changed = true;
    return {
      ...entry,
      status: "rejected" as const,
    };
  });
  if (changed) writeAllUnsafe(next);
  return changed;
}

export function getImportedPhenomenonBySlug(slug: string) {
  const all = readAllUnsafe();
  return all.find((entry) => entry.slug === slug) ?? null;
}

export function getApprovedImportedPhenomena() {
  return loadImportedPhenomena().filter((entry) => entry.status === "approved");
}
