import { ReactNode } from "react";
import { AXO_TOKENS } from "@/styles/tokens";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function EmptyState({ icon, title, subtitle, action }: EmptyStateProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        backgroundColor: AXO_TOKENS.surface,
        border: `1px solid ${AXO_TOKENS.border}`,
        borderRadius: "12px",
        padding: "2rem",
        gap: "0.75rem",
      }}
    >
      <div style={{ fontSize: "2.5rem", lineHeight: 1 }}>{icon}</div>
      <h3
        style={{
          fontFamily: "var(--font-lora, 'Lora', Georgia, serif)",
          fontStyle: "italic",
          fontWeight: 700,
          fontSize: "1.125rem",
          color: AXO_TOKENS.darkGreen,
          margin: 0,
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
          fontSize: "0.875rem",
          color: AXO_TOKENS.subText,
          margin: 0,
          maxWidth: "320px",
        }}
      >
        {subtitle}
      </p>
      {action && (
        <button
          onClick={action.onClick}
          style={{
            marginTop: "0.5rem",
            backgroundColor: AXO_TOKENS.darkGreen,
            color: AXO_TOKENS.darkGreenText,
            fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)",
            fontWeight: 500,
            fontSize: "0.875rem",
            border: "none",
            borderRadius: "999px",
            padding: "8px 20px",
            cursor: "pointer",
          }}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
