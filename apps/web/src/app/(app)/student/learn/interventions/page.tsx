"use client";

import Link from "next/link";
import { useMemo } from "react";
import { buildInterventionQueue } from "@/lib/learningInsights";
import { loadLearningProgress } from "@/lib/learningProgress";
import { BackLink } from "@/components/nav/BackLink";
import { EmptyState } from "@/components/ui/EmptyState";

export default function InterventionQueuePage() {
  const progress = useMemo(() => loadLearningProgress(), []);
  const queue = useMemo(() => buildInterventionQueue(progress), [progress]);

  const tier3 = queue.filter((item) => item.tier === 3);
  const tier2 = queue.filter((item) => item.tier === 2);
  const sorted = [...tier3, ...tier2];

  return (
    <main
      style={{ backgroundColor: "#eef3ee", minHeight: "100vh" }}
      className="mx-auto w-full max-w-5xl p-6"
    >
      <BackLink href="/student/learn" label="Back to hub" />

      <section
        style={{
          backgroundColor: "#ffffff",
          border: "1px solid rgba(10,60,30,0.10)",
          borderRadius: 12,
        }}
        className="p-5 shadow-sm"
      >
        <h1 className="text-2xl font-bold" style={{ color: "#1a2e22" }}>
          Your personalized study guide
        </h1>
        <p className="mt-1 text-sm" style={{ color: "#5a7a66" }}>
          These topics showed up in your recent work. Here's your personalized
          plan to get back on track.
        </p>
      </section>

      <section className="mt-4 space-y-3">
        {sorted.length === 0 ? (
          <EmptyState
            icon="🌱"
            message="You're on track! Nothing needs attention right now."
          />
        ) : (
          sorted.map((item) => {
            const isUrgent = item.tier === 3;
            return (
              <article
                key={item.lessonId}
                style={{
                  backgroundColor: isUrgent ? "#fde8e0" : "#fef3d6",
                  border: `1px solid ${isUrgent ? "#e05a2a" : "rgba(10,60,30,0.10)"}`,
                  borderRadius: 12,
                  padding: isUrgent ? "20px" : "16px",
                  boxShadow: isUrgent
                    ? "0 2px 8px rgba(224,90,42,0.15)"
                    : undefined,
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div
                      className="text-xs font-semibold uppercase tracking-wide"
                      style={{ color: isUrgent ? "#c04a20" : "#b8860b" }}
                    >
                      {item.unitTitle}
                    </div>
                    <h2
                      className="mt-1 font-semibold"
                      style={{
                        color: "#1a2e22",
                        fontSize: isUrgent ? "1.05rem" : "0.95rem",
                      }}
                    >
                      {item.lessonTitle}
                    </h2>
                  </div>
                  <span
                    className="shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold"
                    style={{
                      backgroundColor: isUrgent ? "#e05a2a" : "#b8860b",
                      color: "#ffffff",
                    }}
                  >
                    {isUrgent ? "Needs urgent review" : "Needs practice"}
                  </span>
                </div>

                <p className="mt-2 text-sm" style={{ color: "#1a2e22" }}>
                  <span className="font-medium">Why: </span>
                  {item.reason}
                </p>
                <p className="mt-1 text-sm" style={{ color: "#1a2e22" }}>
                  <span className="font-medium">Next step: </span>
                  {item.recommendation}
                </p>

                <div className="mt-3">
                  <Link
                    href={item.href}
                    className="inline-block rounded-lg px-4 py-2 text-sm font-semibold text-white"
                    style={{
                      backgroundColor: isUrgent ? "#e05a2a" : "#1a7a4e",
                    }}
                  >
                    {isUrgent ? "Review now →" : "Practice this →"}
                  </Link>
                </div>
              </article>
            );
          })
        )}
      </section>
    </main>
  );
}
