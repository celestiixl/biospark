/**
 * @deprecated Use `searchPublicBank()` from `@/lib/itemBank` instead.
 *
 * `loadBank()` reads `bank.example.json` via Node.js `fs` at runtime.
 * On Vercel serverless the file path can be unresolvable (output-file tracing
 * doesn't trace paths built from runtime values).  The canonical replacement is
 * `searchPublicBank()` which reads from the statically-bundled JSON import and
 * requires no filesystem access.
 *
 * This module is kept for local/CLI tooling and local dev only.
 */
import fs from "node:fs";
import path from "node:path";
import type { ItemBank } from "./schema";

// __dirname points to the compiled output directory; bank.example.json must
// live alongside this file (Next.js output tracing should copy it there).
const BANK_PATH = path.join(__dirname, "bank.example.json");

export function loadBank(): ItemBank {
  try {
    const raw = fs.readFileSync(BANK_PATH, "utf8");
    return JSON.parse(raw) as ItemBank;
  } catch (err) {
    console.warn("[itemBank/load] Could not read bank.example.json:", err);
    return { version: "0", items: [] };
  }
}
