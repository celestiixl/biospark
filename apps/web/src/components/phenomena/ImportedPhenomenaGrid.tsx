"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Card } from "@/components/ui";
import {
  getApprovedImportedPhenomena,
  type ImportedPhenomenon,
} from "@/lib/phenomenaImports";

function DownloadButton({ item }: { item: ImportedPhenomenon }) {
  function onDownload() {
    const blob = new Blob([item.html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${item.slug}.html`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 250);
  }

  return (
    <button
      type="button"
      onClick={onDownload}
      className="inline-flex rounded-xl border border-bs-border bg-bs-raised px-3 py-2 text-xs font-semibold text-bs-text-sub hover:border-bs-teal/55 hover:text-bs-teal"
    >
      Download HTML
    </button>
  );
}

export default function ImportedPhenomenaGrid() {
  const items = useMemo(() => getApprovedImportedPhenomena(), []);

  if (items.length === 0) return null;

  return (
    <section className="mt-6">
      <h2 className="text-xl font-semibold text-bs-text">Imported Phenomena</h2>
      <p className="mt-1 text-sm text-bs-text-sub">
        Approved custom HTML uploads available in your current browser.
      </p>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        {items.map((item) => (
          <Card
            key={item.id}
            className="h-full rounded-3xl border border-bs-border bg-bs-surface p-4"
            glow
          >
            <div className="overflow-hidden rounded-2xl border border-bs-border bg-bs-bg px-4 py-3 text-xs text-bs-text-sub">
              Imported HTML
            </div>
            <h3 className="mt-3 text-xl font-semibold text-bs-text">
              {item.title}
            </h3>
            <p className="mt-2 text-sm text-bs-text-sub">
              Requested by {item.requestedBy} ·{" "}
              {new Date(item.createdAt).toLocaleDateString()}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full border border-bs-border bg-bs-raised px-2.5 py-1 text-[11px] font-semibold text-bs-text-sub">
                Topic: Custom
              </span>
              <span className="rounded-full border border-bs-border bg-bs-raised px-2.5 py-1 text-[11px] font-semibold text-bs-text-sub">
                Imported
              </span>
              <span className="rounded-full border border-bs-teal/45 bg-(--bs-teal-dim) px-2.5 py-1 text-[11px] font-semibold text-bs-teal">
                #{item.slug}
              </span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href={`/phenomena-studio/imported/${item.slug}`}
                className="inline-flex rounded-xl border border-bs-teal/50 bg-(--bs-teal-dim) px-3 py-2 text-xs font-semibold text-bs-teal"
              >
                Open -&gt;
              </Link>
              <DownloadButton item={item} />
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
