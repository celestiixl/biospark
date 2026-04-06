"use client";

import { BackLink } from "@/components/nav/BackLink";

export default function PlantSystemsB12BInExplorerPage() {
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
          <a
            href="/lessons/plant-systems-b12b.html"
            download="plant-systems-b12b.html"
            style={{
              border: "1px solid rgba(0,0,0,0.07)",
              borderRadius: 999,
              padding: "4px 10px",
              fontSize: 12,
              color: "#8aada0",
              textDecoration: "none",
            }}
          >
            Download HTML
          </a>
          <span
            style={{
              border: "1px solid rgba(0,0,0,0.07)",
              borderRadius: 999,
              padding: "4px 10px",
              fontSize: 12,
              color: "#8aada0",
            }}
          >
            Unit 7
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
            B.12B
          </span>
        </div>
      </header>

      <iframe
        src="/lessons/plant-systems-b12b.html"
        width="100%"
        height="calc(100vh - 64px)"
        style={{
          border: "none",
          display: "block",
          height: "calc(100dvh - 64px)",
          flex: 1,
        }}
        title="Plant Systems B.12B Lesson"
      />
    </main>
  );
}
