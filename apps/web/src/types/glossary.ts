/**
 * Glossary Types for Tap-to-Translate feature
 * Allows teachers to define glossary entries and authors to mark tokens in text
 */

export type GlossaryEntry = {
  key: string;              // stable id, e.g. "gratuito"
  surface: string;          // what appears in the passage, e.g. "gratuito"
  es: string;               // Spanish definition/translation shown first
  en: string;               // English translation
  partOfSpeech?: string;    // optional, e.g. "adjective", "noun"
};

export type GlossarySegment = 
  | { type: "text"; value: string }
  | { type: "token"; key: string; surface: string };
