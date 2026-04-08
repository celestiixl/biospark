"use client";
import { useState } from "react";
import { AXO_TOKENS } from "@/styles/tokens";

type Tier = "everyday" | "academic" | "content";

const UNDERLINE_COLORS: Record<Tier, string> = {
  content:  AXO_TOKENS.buttonGreen,
  academic: AXO_TOKENS.lavenderText,
  everyday: AXO_TOKENS.labelText,
};

interface VocabTermProps {
  term: string;
  definition: string;
  tier?: Tier;
}

export default function VocabTerm({ term, definition, tier = "content" }: VocabTermProps) {
  const [visible, setVisible] = useState(false);
  const underlineColor = UNDERLINE_COLORS[tier];

  return (
    <span style={{ position: "relative", display: "inline" }}>
      <span
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
        tabIndex={0}
        role="button"
        aria-describedby={`vocab-${term}`}
        style={{
          borderBottom: `1.5px dotted ${underlineColor}`,
          cursor: "help",
          fontWeight: 500,
        }}
      >
        {term}
      </span>
      {visible && (
        <span
          id={`vocab-${term}`}
          role="tooltip"
          style={{
            position: "absolute",
            bottom: "calc(100% + 6px)",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: AXO_TOKENS.darkGreen,
            color: AXO_TOKENS.darkGreenText,
            fontSize: "12px",
            fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
            padding: "6px 10px",
            borderRadius: "8px",
            whiteSpace: "normal",
            zIndex: 50,
            pointerEvents: "none",
            maxWidth: "240px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          }}
        >
          <strong style={{ display: "block", marginBottom: "2px" }}>{term}</strong>
          {definition}
        </span>
      )}
    </span>
  );
}
