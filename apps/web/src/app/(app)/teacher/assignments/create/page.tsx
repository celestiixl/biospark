import { BackLink } from "@/components/nav/BackLink";
import AssignmentMakerSection from "@/components/teacher/AssignmentMakerSection";

const C = {
  surface: "#ffffff",
  tealDeep:"#003d2e",
  border:  "rgba(0,0,0,0.07)",
  pageBg:  "#f0f4f2",
} as const;

export default function NewAssignmentPage() {
  return (
    <div style={{ minHeight: "100vh", background: C.pageBg, fontFamily: "var(--font-dm-sans), sans-serif" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px 60px" }}>
        <BackLink href="/teacher/dashboard" label="Back to dashboard" />

        <div style={{ background: C.tealDeep, borderRadius: 16, padding: "28px 30px 24px", marginBottom: 24, marginTop: 12 }}>
          <h1 style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: 28, fontWeight: 800, fontStyle: "italic", color: "white", marginBottom: 4 }}>
            New Assignment ✦
          </h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
            Build and publish a custom assignment from your question banks.
          </p>
        </div>

        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20 }}>
          <AssignmentMakerSection />
        </div>
      </div>
    </div>
  );
}
