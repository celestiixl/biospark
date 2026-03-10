"use client";

import { useState } from "react";
import Link from "next/link";
import { PageContent, Card } from "@/components/ui";
import { useTeacherAuth } from "@/lib/teacherAuth";
import {
  approveImportedPhenomenon,
  isSiteAdminEmail,
  loadImportedPhenomena,
  rejectImportedPhenomenon,
  submitImportedPhenomenon,
} from "@/lib/phenomenaImports";

export default function PhenomenaUploadGuidePage() {
  const { teacher } = useTeacherAuth();
  const isAdmin = isSiteAdminEmail(teacher?.email);
  const requester = teacher?.email ?? "anonymous";

  const [htmlInput, setHtmlInput] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [prMessage, setPrMessage] = useState<string | null>(null);
  const [isCreatingPr, setIsCreatingPr] = useState(false);
  const [, setRefreshTick] = useState(0);

  const imports = loadImportedPhenomena();
  const pending = imports.filter((entry) => entry.status === "pending");
  const approved = imports.filter((entry) => entry.status === "approved");

  function refresh() {
    setRefreshTick((n) => n + 1);
  }

  function onSubmitHtml() {
    setPrMessage(null);
    const result = submitImportedPhenomenon({
      html: htmlInput,
      requestedBy: requester,
      requestedByIsAdmin: isAdmin,
    });

    if (!result.ok) {
      setMessage(result.error);
      return;
    }

    setHtmlInput("");
    setMessage(
      result.item.status === "approved"
        ? "Imported and auto-approved. It is now visible in Phenomena Explorer."
        : "Submitted for approval. A site admin must approve before it appears in Phenomena Explorer.",
    );
    refresh();
  }

  async function onCreatePullRequest() {
    setPrMessage(null);
    if (!htmlInput.trim()) {
      setPrMessage("Paste HTML first, then create a PR.");
      return;
    }

    setIsCreatingPr(true);
    try {
      const res = await fetch("/api/phenomena/import-pr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          html: htmlInput,
          requestedBy: requester,
          requestedByIsAdmin: isAdmin,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        prUrl?: string;
        prNumber?: number;
        error?: string;
        detail?: string;
      };

      if (!res.ok || !data.ok) {
        setPrMessage(
          `PR creation failed: ${data.error ?? "unknown error"}${data.detail ? ` (${data.detail})` : ""}`,
        );
        return;
      }

      setPrMessage(
        data.prUrl
          ? `PR created: ${data.prUrl}`
          : `PR #${data.prNumber ?? "?"} created successfully.`,
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "request failed";
      setPrMessage(`PR creation failed: ${msg}`);
    } finally {
      setIsCreatingPr(false);
    }
  }

  function onApprove(id: string) {
    if (!teacher?.email) return;
    approveImportedPhenomenon(id, teacher.email);
    refresh();
  }

  function onReject(id: string) {
    rejectImportedPhenomenon(id);
    refresh();
  }

  return (
    <main>
      <PageContent className="py-8">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-3xl font-semibold tracking-tight text-bs-text">
            Phenomena Import Console
          </h1>
          <p className="mt-2 text-sm text-bs-text-sub">
            Paste full HTML, submit to BioSpark, and publish with admin
            approval.
          </p>

          <Card
            className="mt-6 rounded-3xl border border-bs-border bg-bs-surface p-5"
            glow
          >
            <div className="text-sm font-semibold text-bs-text">Paste HTML</div>
            <p className="mt-2 text-sm text-bs-text-sub">
              Accepts full documents starting with &lt;!doctype html&gt; or
              &lt;html&gt;.
            </p>
            <textarea
              value={htmlInput}
              onChange={(e) => setHtmlInput(e.target.value)}
              placeholder="Paste your full HTML phenomenon here..."
              className="mt-3 min-h-65 w-full rounded-2xl border border-bs-border bg-bs-raised p-4 font-mono text-xs text-bs-text"
            />

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={onSubmitHtml}
                className="rounded-xl border border-bs-teal/55 bg-(--bs-teal-dim) px-4 py-2 text-xs font-semibold text-bs-teal"
              >
                Submit Import
              </button>
              <button
                type="button"
                onClick={onCreatePullRequest}
                disabled={isCreatingPr}
                className="rounded-xl border border-blue-400/60 bg-blue-500/10 px-4 py-2 text-xs font-semibold text-blue-300 disabled:opacity-50"
              >
                {isCreatingPr ? "Creating PR..." : "Create GitHub PR"}
              </button>
              <Link
                href="/phenomena-studio"
                className="rounded-xl border border-bs-border bg-bs-raised px-4 py-2 text-xs font-semibold text-bs-text-sub hover:border-bs-teal/55 hover:text-bs-teal"
              >
                Back to Explorer
              </Link>
              <span className="text-xs text-bs-text-sub">
                Requester: {requester}{" "}
                {isAdmin ? "(site admin)" : "(non-admin)"}
              </span>
            </div>

            {message ? (
              <div className="mt-3 rounded-xl border border-bs-border bg-bs-raised px-3 py-2 text-xs text-bs-text-sub">
                {message}
              </div>
            ) : null}
            {prMessage ? (
              <div className="mt-2 rounded-xl border border-blue-400/30 bg-blue-500/10 px-3 py-2 text-xs text-blue-200">
                {prMessage}
              </div>
            ) : null}
            <p className="mt-2 text-[11px] text-bs-text-sub">
              PR route env required: GITHUB_TOKEN (optional overrides:
              GITHUB_REPO_OWNER, GITHUB_REPO_NAME, GITHUB_BASE_BRANCH).
            </p>
          </Card>

          <Card
            className="mt-4 rounded-3xl border border-bs-border bg-bs-surface p-5"
            glow
          >
            <div className="text-sm font-semibold text-bs-text">
              Approval Queue
            </div>
            <p className="mt-1 text-xs text-bs-text-sub">
              Non-admin submissions stay pending until approved by a site admin.
            </p>
            <div className="mt-3 space-y-2">
              {pending.length === 0 ? (
                <div className="text-xs text-bs-text-sub">
                  No pending imports.
                </div>
              ) : (
                pending.map((entry) => (
                  <div
                    key={entry.id}
                    className="rounded-xl border border-bs-border bg-bs-raised px-3 py-3"
                  >
                    <div className="text-sm font-semibold text-bs-text">
                      {entry.title}
                    </div>
                    <div className="mt-1 text-xs text-bs-text-sub">
                      slug: {entry.slug} · by {entry.requestedBy}
                    </div>
                    {isAdmin ? (
                      <div className="mt-2 flex gap-2">
                        <button
                          type="button"
                          onClick={() => onApprove(entry.id)}
                          className="rounded-lg border border-emerald-400/50 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => onReject(entry.id)}
                          className="rounded-lg border border-rose-400/50 bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-300"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <div className="mt-2 text-xs text-amber-300">
                        Awaiting site-admin approval.
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </Card>

          <Card
            className="mt-4 rounded-3xl border border-bs-border bg-bs-surface p-5"
            glow
          >
            <div className="text-sm font-semibold text-bs-text">
              Approved Imports
            </div>
            <div className="mt-3 space-y-2">
              {approved.length === 0 ? (
                <div className="text-xs text-bs-text-sub">
                  No approved imports yet.
                </div>
              ) : (
                approved.map((entry) => (
                  <div
                    key={entry.id}
                    className="rounded-xl border border-bs-border bg-bs-raised px-3 py-3"
                  >
                    <div className="text-sm font-semibold text-bs-text">
                      {entry.title}
                    </div>
                    <div className="mt-1 text-xs text-bs-text-sub">
                      slug: {entry.slug} · approved by{" "}
                      {entry.approvedBy ?? "admin"}
                    </div>
                    <Link
                      href={`/phenomena-studio/imported/${entry.slug}`}
                      className="mt-2 inline-flex rounded-lg border border-bs-teal/55 bg-(--bs-teal-dim) px-3 py-1 text-xs font-semibold text-bs-teal"
                    >
                      Open Imported Phenomenon
                    </Link>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </PageContent>
    </main>
  );
}
