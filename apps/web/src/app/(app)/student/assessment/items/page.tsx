import Link from "next/link";
import { BackLink } from "@/components/nav/BackLink";

const C = {
  ink:     "#0a1a14",
  muted:   "#8aada0",
  surface: "#ffffff",
  tealDeep:"#003d2e",
  border:  "rgba(0,0,0,0.07)",
  pageBg:  "#f0f4f2",
} as const;

export default function InteractiveItemsTestScreen() {
  return (
    <div style={{ minHeight: "100vh", background: C.pageBg, fontFamily: "var(--font-dm-sans), sans-serif" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px 60px" }}>
        <BackLink href="/student/assessment" label="Back to lab" />

        <div style={{ background: C.tealDeep, borderRadius: 16, padding: "28px 30px 24px", marginBottom: 24, marginTop: 12 }}>
          <h1 style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: 28, fontWeight: 800, fontStyle: "italic", color: "white", marginBottom: 4 }}>
            Interactive Items Test Screen ✦
          </h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
            Placeholder sandbox. Next patch will render a small demo set (including Inline Choice).
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 16 }}>
          <div />
          <div style={{ display: "flex", gap: 8 }}>
            <Link
              href="/practice"
              style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "8px 12px", fontSize: 13, color: C.ink, textDecoration: "none" }}
            >
              Practice
            </Link>
          </div>
        </div>

        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.ink }}>Next up</div>
          <ul style={{ marginTop: 8, paddingLeft: 20, fontSize: 14, color: C.muted, lineHeight: 1.8 }}>
            <li>Render demo item types (MC, drag, hotspot, Inline Choice)</li>
            <li>Verify item-type pills + check button behavior</li>
            <li>Toggle learn/test modes and attempt limits</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
