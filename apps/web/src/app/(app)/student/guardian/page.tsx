"use client";

import { useMemo } from "react";
import { BackLink } from "@/components/nav/BackLink";
import { buildGuardianSnapshot } from "@/lib/learningInsights";
import { loadLearningProgress } from "@/lib/learningProgress";

export default function GuardianSnapshotPage() {
  const snapshot = useMemo(
    () => buildGuardianSnapshot(loadLearningProgress()),
    [],
  );

  return (
    <main className="mx-auto w-full max-w-5xl p-6 text-slate-900">
      <BackLink href="/student/learn" label="Back to hub" />
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold">Guardian Weekly Snapshot</h1>
          <p className="mt-1 text-sm text-slate-600">
            A parent-friendly summary of learning progress and upcoming needs.
          </p>
        </div>
      </section>

      <section className="mt-4 grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-xs uppercase tracking-wide text-slate-500">
            Lessons completed
          </div>
          <div className="mt-1 text-2xl font-bold text-slate-900">
            {snapshot.lessonsCompleted}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-xs uppercase tracking-wide text-slate-500">
            Average check score
          </div>
          <div className="mt-1 text-2xl font-bold text-slate-900">
            {snapshot.avgCheck}%
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-xs uppercase tracking-wide text-slate-500">
            Time spent
          </div>
          <div className="mt-1 text-2xl font-bold text-slate-900">
            {snapshot.timeSpentMin} min
          </div>
        </div>
      </section>

      <section className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-sm font-semibold text-slate-900">
            Upcoming Assignments
          </div>
          <div className="mt-2 space-y-2 text-sm text-slate-700">
            {snapshot.upcomingAssignments.length === 0 ? (
              <div className="text-slate-500">
                No upcoming learning assignments.
              </div>
            ) : (
              snapshot.upcomingAssignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2"
                >
                  <div className="font-semibold">{assignment.title}</div>
                  <div className="text-xs text-slate-500">
                    {assignment.dueDate
                      ? new Date(assignment.dueDate).toLocaleDateString()
                      : "No due date"}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-sm font-semibold text-slate-900">
            Missing / Not Started
          </div>
          <div className="mt-2 space-y-2 text-sm text-slate-700">
            {snapshot.missingAssignments.length === 0 ? (
              <div className="text-slate-500">
                No missing assignments this week.
              </div>
            ) : (
              snapshot.missingAssignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2"
                >
                  <div className="font-semibold text-rose-900">
                    {assignment.title}
                  </div>
                  <div className="text-xs text-rose-700">
                    Status: Not started
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
