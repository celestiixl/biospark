import Link from "next/link";
import { loadBank } from "@/lib/itemBank/load";
import ItemBankTabsClient from "./ItemBankTabsClient";

export const dynamic = "force-dynamic";

const C = {
  ink:     "#0a1a14",
  surface: "#ffffff",
  tealDeep:"#003d2e",
  tealDark:"#006e55",
  border:  "rgba(0,0,0,0.07)",
  pageBg:  "#f0f4f2",
} as const;

export default async function TeacherItemBankPage() {
  const bank = loadBank();
  const items = bank?.items ?? [];

  return (
    <div style={{ minHeight: "100vh", background: C.pageBg, fontFamily: "var(--font-dm-sans), sans-serif" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px 60px" }}>
        <div style={{ background: C.tealDeep, borderRadius: 16, padding: "28px 30px 24px", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div>
              <h1 style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: 28, fontWeight: 800, fontStyle: "italic", color: "white", marginBottom: 4 }}>
                Item Bank ✦
              </h1>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
                {items.length} TEKS-aligned questions ready to add to assessments.
              </p>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Link
                href="/teacher/builder"
                style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 10, padding: "8px 16px", fontSize: 13, fontWeight: 600, color: "white", textDecoration: "none" }}
              >
                + New Item
              </Link>
              <Link
                href="/teacher/dashboard"
                style={{ background: C.tealDark, borderRadius: 10, padding: "8px 16px", fontSize: 13, fontWeight: 600, color: "white", textDecoration: "none" }}
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>

        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20 }}>
          <ItemBankTabsClient publicItems={items} />
        </div>
      </div>
    </div>
  );
}

