"use client";

import { motion } from "framer-motion";
import { type DailyWonder } from "@/data/dailyWonders";

interface DailyWonderWidgetProps {
  wonder: DailyWonder;
  onLearnMore: () => void;
}

export default function DailyWonderWidget({
  wonder,
  onLearnMore,
}: DailyWonderWidgetProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      style={{
        background: "#0d4a2f",
        borderRadius: 12,
        padding: "14px 16px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginBottom: 12,
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-lora), Georgia, serif",
          fontStyle: "italic",
          fontSize: 12,
          color: "#d6f0e4",
          lineHeight: 1.4,
          flex: 1,
          margin: 0,
        }}
      >
        {wonder.fact}
      </p>
      <button
        type="button"
        onClick={onLearnMore}
        style={{
          padding: "6px 14px",
          background: "rgba(214,240,228,0.12)",
          border: "1px solid rgba(214,240,228,0.2)",
          borderRadius: 20,
          fontFamily: "var(--font-dm-mono), monospace",
          fontSize: 10,
          color: "#d6f0e4",
          cursor: "pointer",
          flexShrink: 0,
          whiteSpace: "nowrap",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background =
            "rgba(214,240,228,0.22)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background =
            "rgba(214,240,228,0.12)";
        }}
        aria-label="Learn more about today's wonder"
      >
        Learn more
      </button>
    </motion.div>
  );
}
