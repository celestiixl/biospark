"use client";

import { useMemo } from "react";
import { parseGlossaryMarkup } from "@/lib/glossary/parseGlossaryMarkup";
import GlossaryToken from "./GlossaryToken";
import type { GlossaryEntry } from "@/types/glossary";

type GlossaryTextProps = {
  text: string;
  glossary?: GlossaryEntry[];
  defaultLang?: "es" | "en";
  className?: string;
};

/**
 * GlossaryText: Renders text with glossary tokens
 * 
 * Features:
 * - Parses markup: [[surface|key=wordKey]]
 * - Renders glossary tokens as clickable elements with popovers
 * - Falls back to plain text if glossary entry not found
 * - No glossary: renders plain text
 * 
 * Usage:
 * ```tsx
 * <GlossaryText
 *   text="El Zócalo alberga eventos [[gratuitos|key=gratuito]] para todos."
 *   glossary={[
 *     { key: "gratuito", surface: "gratuitos", es: "Que no cuesta dinero.", en: "Free" }
 *   ]}
 *   defaultLang="es"
 * />
 * ```
 */
export default function GlossaryText({
  text,
  glossary,
  defaultLang = "es",
  className,
}: GlossaryTextProps) {
  // Parse tokens and create lookup
  const { segments, entryMap } = useMemo(() => {
    const segs = parseGlossaryMarkup(text);
    const map: Record<string, GlossaryEntry> = {};

    if (glossary) {
      glossary.forEach((entry) => {
        map[entry.key] = entry;
      });
    }

    return { segments: segs, entryMap: map };
  }, [text, glossary]);

  // Fail-safe: if no glossary provided, just render text
  if (!glossary || glossary.length === 0) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span className={className}>
      {segments.map((seg, idx) => {
        if (seg.type === "text") {
          return <span key={idx}>{seg.value}</span>;
        }

        // Token: look up entry, fallback to plain text if not found
        const entry = entryMap[seg.key];
        if (!entry) {
          return <span key={idx}>{seg.surface}</span>;
        }

        return (
          <GlossaryToken
            key={idx}
            surface={seg.surface}
            entry={entry}
            defaultLang={defaultLang}
          />
        );
      })}
    </span>
  );
}
