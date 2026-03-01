"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { GlossaryEntry } from "@/types/glossary";

type GlossaryTokenProps = {
  surface: string;
  entry: GlossaryEntry;
  defaultLang?: "es" | "en";
};

/**
 * GlossaryToken: Renders a clickable glossary token with a popover
 * - Default: shows Spanish meaning
 * - Toggle button: switch to English
 * - Keyboard accessible: Enter/Space opens, Esc closes
 * - Mobile friendly: tap opens/closes
 */
export default function GlossaryToken({
  surface,
  entry,
  defaultLang = "es",
}: GlossaryTokenProps) {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState<"es" | "en">(defaultLang);
  const [coords, setCoords] = useState<{
    top: number;
    left: number;
  }>({ top: 0, left: 0 });

  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Update popover position when it opens
  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const popoverHeight = popoverRef.current?.offsetHeight ?? 200;

    // Position below token, centered horizontally
    let top = rect.bottom + 8;
    let left = rect.left + rect.width / 2 - 160; // center assuming ~320px width

    // Ensure popover stays within viewport
    if (left < 8) left = 8;
    if (left + 320 > window.innerWidth) left = window.innerWidth - 320 - 8;
    if (top + popoverHeight > window.innerHeight) {
      top = rect.top - popoverHeight - 8;
    }

    setCoords({ top, left });
  }, [open]);

  // Handle keyboard: Enter/Space opens, Esc closes
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      setOpen(!open);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
    }
  };

  // Close when clicking outside
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (!popoverRef.current?.contains(e.target as Node) &&
          !triggerRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [open]);

  const displayText = lang === "es" ? entry.es : entry.en;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(!open)}
        onKeyDown={handleKeyDown}
        className="
          inline underline decoration-dotted
          hover:decoration-solid
          text-inherit focus:outline-none
          focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
          relative
        "
        aria-label={`Glossary term: ${surface}`}
        aria-expanded={open}
      >
        {surface}
      </button>

      {open &&
        createPortal(
          <div
            ref={popoverRef}
            style={{
              position: "fixed",
              top: `${coords.top}px`,
              left: `${coords.left}px`,
              zIndex: 9999,
            }}
            className="w-80 rounded-lg border bg-white shadow-lg p-4"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <div className="font-semibold text-sm text-slate-900">
                  {entry.surface}
                </div>
                {entry.partOfSpeech && (
                  <div className="text-xs text-slate-500 italic mt-0.5">
                    {entry.partOfSpeech}
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="
                  text-slate-400 hover:text-slate-600
                  font-bold text-lg leading-none
                  w-6 h-6 flex items-center justify-center
                  hover:bg-slate-100 rounded
                "
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {/* Definition */}
            <div className="mt-3 text-sm text-slate-700 leading-normal">
              {displayText}
            </div>

            {/* Language toggle */}
            {entry.es && entry.en && (
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setLang("es")}
                  className={`
                    flex-1 px-3 py-1.5 rounded text-xs font-semibold
                    transition-colors
                    ${
                      lang === "es"
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }
                  `}
                >
                  ES
                </button>
                <button
                  type="button"
                  onClick={() => setLang("en")}
                  className={`
                    flex-1 px-3 py-1.5 rounded text-xs font-semibold
                    transition-colors
                    ${
                      lang === "en"
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }
                  `}
                >
                  EN
                </button>
              </div>
            )}
          </div>,
          document.body
        )}
    </>
  );
}
