"use client";

import Link from "next/link";
import { type DailyWonder } from "@/data/dailyWonders";
import { TeksTag } from "@/components/ui/Badge";
import { normalizeTeksCategory } from "@/lib/teksColors";

interface DailyWonderLearnMoreProps {
  wonder: DailyWonder;
}

export default function DailyWonderLearnMore({
  wonder,
}: DailyWonderLearnMoreProps) {
  return (
    <div style={{ minHeight: "100vh", background: "#eef3ee" }}>
      {/* Header bar */}
      <div
        style={{
          background: "#0d4a2f",
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <Link
          href="/student/dashboard"
          style={{
            fontFamily: "var(--font-dm-mono), monospace",
            fontSize: 10,
            textTransform: "uppercase",
            color: "#d6f0e4",
            opacity: 0.45,
            textDecoration: "none",
            letterSpacing: "0.06em",
          }}
          aria-label="Back to dashboard"
        >
          ← Back
        </Link>
        <p
          style={{
            fontFamily: "var(--font-lora), Georgia, serif",
            fontStyle: "italic",
            fontWeight: 700,
            fontSize: 15,
            color: "#d6f0e4",
            margin: 0,
          }}
        >
          Daily Wonder
        </p>
      </div>

      {/* Body */}
      <div
        style={{
          padding: "18px 22px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          maxWidth: 680,
        }}
      >
        {/* Wonder fact card */}
        <p
          style={{
            fontFamily: "var(--font-lora), Georgia, serif",
            fontStyle: "italic",
            fontWeight: 700,
            fontSize: 14,
            color: "#0d4a2f",
            lineHeight: 1.5,
            background: "#d6ede6",
            borderRadius: 10,
            padding: "14px 16px",
            margin: 0,
          }}
        >
          {wonder.fact}
        </p>

        {/* Body paragraphs */}
        {wonder.learnMore.body.map((paragraph, i) => (
          <p
            key={i}
            style={{
              fontFamily: "var(--font-dm-sans), sans-serif",
              fontSize: 13,
              color: "#1a2e22",
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            {paragraph}
          </p>
        ))}

        {/* TEKS tags */}
        {wonder.learnMore.teks.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {wonder.learnMore.teks.map((code) => {
              const isRcCategory = normalizeTeksCategory(code) !== null;
              if (isRcCategory) {
                return <TeksTag key={code} category={code} />;
              }
              return (
                <span
                  key={code}
                  style={{
                    background: "#ffffff",
                    border: "1px solid rgba(10,60,30,0.10)",
                    borderRadius: 20,
                    padding: "5px 12px",
                    fontFamily: "var(--font-dm-mono), monospace",
                    fontSize: 10,
                    color: "#6a9a82",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 3,
                  }}
                >
                  <strong style={{ color: "#0d4a2f" }}>{code}</strong>
                </span>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
