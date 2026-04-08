"use client";
import { AXO_TOKENS } from "@/styles/tokens";

interface TeksTagProps {
  code: string;
  priority?: boolean;
}

export default function TeksTag({ code, priority = false }: TeksTagProps) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        backgroundColor: AXO_TOKENS.mint,
        color: AXO_TOKENS.darkGreen,
        fontFamily: "var(--font-dm-mono, 'DM Mono', monospace)",
        fontSize: "9px",
        fontWeight: 500,
        textTransform: "uppercase" as const,
        letterSpacing: "0.06em",
        borderRadius: "20px",
        padding: "3px 8px",
        borderLeft: priority ? `2px solid ${AXO_TOKENS.buttonGreen}` : undefined,
        whiteSpace: "nowrap" as const,
      }}
    >
      {code}
    </span>
  );
}
