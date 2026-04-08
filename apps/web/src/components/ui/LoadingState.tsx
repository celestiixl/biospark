import { AXO_TOKENS } from "@/styles/tokens";

export default function LoadingState() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.75rem",
        padding: "2rem",
      }}
    >
      <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: AXO_TOKENS.buttonGreen,
              display: "inline-block",
              animation: "axo-bounce 1.2s ease-in-out infinite",
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>
      <span
        style={{
          fontFamily: "var(--font-dm-mono, 'DM Mono', monospace)",
          fontSize: "10px",
          color: AXO_TOKENS.labelText,
          letterSpacing: "0.05em",
        }}
      >
        Loading...
      </span>
      <style>{`
        @keyframes axo-bounce {
          0%, 80%, 100% { transform: scale(0.8); opacity: 0.6; }
          40% { transform: scale(1.2); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
