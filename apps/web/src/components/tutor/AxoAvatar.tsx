// AxoAvatar — coral circle placeholder for the Axo mascot.
// When the real mascot illustration is ready, only this file needs to change.
// Every other Axo avatar reference imports this component.

interface AxoAvatarProps {
  size?: number;
  className?: string;
}

export default function AxoAvatar({ size = 36, className }: AxoAvatarProps) {
  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "#e05a2a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
      aria-label="Axo"
    >
      <span
        style={{
          color: "white",
          fontFamily: "var(--font-lora), Georgia, serif",
          fontWeight: 700,
          fontStyle: "italic",
          fontSize: Math.round(size * 0.44),
          lineHeight: 1,
          userSelect: "none",
        }}
        aria-hidden="true"
      >
        A
      </span>
    </div>
  );
}
