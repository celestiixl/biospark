"use client";

import { useMemo } from "react";
import { BackLink } from "@/components/nav/BackLink";
import { useParams } from "next/navigation";
import { getImportedPhenomenonBySlug } from "@/lib/phenomenaImports";

export default function ImportedPhenomenonPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug ?? "";

  const item = useMemo(() => getImportedPhenomenonBySlug(slug), [slug]);

  if (!item || item.status !== "approved") {
    return (
      <main style={{ minHeight: "100vh", background: "#f0f4f2", fontFamily: "var(--font-dm-sans), sans-serif" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "32px 20px" }}>
          <div style={{ background: "#ffffff", border: "1px solid rgba(0,0,0,0.07)", borderRadius: 16, padding: 24 }}>
            <h1 style={{ fontSize: 20, fontWeight: 600, color: "#0a1a14" }}>
              Imported phenomenon not available
            </h1>
            <p style={{ marginTop: 8, fontSize: 14, color: "#8aada0" }}>
              This imported HTML is missing or still pending approval.
            </p>
            <div style={{ marginTop: 16 }}>
              <BackLink href="/phenomena-studio" label="Back to phenomena" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        background: "#f0f4f2",
      }}
    >
      <header
        style={{
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          padding: "0 16px",
          borderBottom: "1px solid rgba(0,0,0,0.07)",
          background: "#ffffff",
        }}
      >
        <BackLink href="/phenomena-studio" label="Back to phenomena" />

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              border: "1px solid rgba(0,0,0,0.07)",
              borderRadius: 999,
              padding: "4px 10px",
              fontSize: 12,
              color: "#8aada0",
            }}
          >
            Imported
          </span>
          <span
            style={{
              border: "1px solid rgba(0,0,0,0.07)",
              borderRadius: 999,
              padding: "4px 10px",
              fontSize: 12,
              color: "#8aada0",
            }}
          >
            {item.slug}
          </span>
        </div>
      </header>

      <iframe
        srcDoc={item.html}
        width="100%"
        height="calc(100vh - 64px)"
        style={{
          border: "none",
          display: "block",
          height: "calc(100dvh - 64px)",
          flex: 1,
        }}
        title={item.title}
        sandbox="allow-scripts allow-same-origin allow-forms"
      />
    </main>
  );
}
