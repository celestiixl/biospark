/**
 * Utility to parse glossary markup in text
 * Format: [[surface|key=wordKey]]
 * Example: "El Zócalo alberga eventos [[gratuitos|key=gratuito]] para todos."
 */

import type { GlossarySegment } from "@/types/glossary";

/**
 * Parse text with markup [[surface|key=keyValue]] into segments
 * @param text - Raw text with glossary markup
 * @returns Array of text and token segments
 */
export function parseGlossaryMarkup(text: string): GlossarySegment[] {
  if (!text) return [];

  const segments: GlossarySegment[] = [];
  const regex = /\[\[([^\]|]+)\|key=([^\]]+)\]\]/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    // Add text before this token
    if (match.index > lastIndex) {
      segments.push({
        type: "text",
        value: text.slice(lastIndex, match.index),
      });
    }

    // Add the token
    const surface = match[1];
    const key = match[2];
    segments.push({
      type: "token",
      key,
      surface,
    });

    lastIndex = regex.lastIndex;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    segments.push({
      type: "text",
      value: text.slice(lastIndex),
    });
  }

  // If no markup found, return single text segment
  if (segments.length === 0) {
    segments.push({
      type: "text",
      value: text,
    });
  }

  return segments;
}

/**
 * Generate markup for a surface text with a key
 * Useful for teacher convenience when inserting tokens
 */
export function generateGlossaryMarkup(surface: string, key: string): string {
  return `[[${surface}|key=${key}]]`;
}
