/**
 * Re-exports the full item bank API from the canonical module.
 *
 * All business logic, storage keys (`biospark:itembank:private:{teacherId}`),
 * and localStorage error handling live in `../itemBank.ts`. This barrel keeps
 * the `@/lib/itemBank` import path working for both the directory-based schema
 * types and the flat-module helpers.
 *
 * Server-side loading (Node `fs`) lives in `./load.ts` and is NOT exported
 * here to prevent it from being bundled into client code.
 */

export * from "../itemBank";
export type { Item, ItemBank, ItemType, Difficulty, Stimulus, Choice, AnswerLogic, GlossaryEntry } from "./schema";
