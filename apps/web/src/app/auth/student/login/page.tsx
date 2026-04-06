"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStudentAuth } from "@/lib/studentAuth";

export default function StudentLoginPage() {
  const router = useRouter();
  const setStudent = useStudentAuth((s) => s.setStudent);

  const [displayName, setDisplayName] = useState("");
  const [period, setPeriod] = useState("1");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!displayName.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/student/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName: displayName.trim(), period: Number(period) }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError((data as { error?: string }).error ?? "Login failed.");
        setLoading(false);
        return;
      }

      const student = await res.json() as { id: string; displayName: string; period: number };
      setStudent({ id: student.id, displayName: student.displayName, period: student.period });
      router.replace("/student/dashboard");
    } catch {
      setError("Could not connect. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div
      className="relative min-h-dvh flex flex-col"
      style={{ background: "#f0f4f2", fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Header */}
      <div style={{ borderBottom: "1px solid rgba(0,0,0,0.06)", background: "white" }}>
        <div className="mx-auto max-w-6xl px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="grid h-8 w-8 place-items-center rounded-xl text-sm font-bold" style={{ background: "#006e55", color: "white" }}>
              ⚡
            </div>
            <div>
              <div className="text-sm font-semibold" style={{ color: "#0a1a14" }}>BioSpark</div>
              <div className="text-xs" style={{ color: "#5a7d72" }}>STAAR Biology • Practice &amp; Mastery</div>
            </div>
          </div>
        </div>
      </div>

      {/* Centered content */}
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-12">
        {/* Hero */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl text-2xl" style={{ background: "rgba(0,110,85,0.1)", border: "1px solid rgba(0,110,85,0.2)" }}>
            <span role="img" aria-label="spark">⚡</span>
          </div>
          <h1 className="text-3xl font-bold" style={{ color: "#0a1a14" }}>
            Welcome back, scientist
          </h1>
          <p className="mt-2 text-sm" style={{ color: "#8aada0" }}>
            Enter your name and class period to sign in
          </p>
        </div>

        {/* Login card */}
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm rounded-2xl p-8"
          style={{ background: "white", border: "1px solid rgba(0,0,0,0.07)" }}
        >
          <div className="flex flex-col gap-5">
            {/* Name input */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="displayName" className="text-sm font-medium" style={{ color: "#0a1a14" }}>
                Your name
              </label>
              <input
                ref={nameRef}
                id="displayName"
                type="text"
                aria-label="Your name"
                placeholder="First Last"
                value={displayName}
                onChange={(e) => { setDisplayName(e.target.value); setError(null); }}
                disabled={loading}
                autoComplete="name"
                className="w-full rounded-xl px-4 py-3 text-base transition-all duration-200 disabled:opacity-50"
                style={{ background: "#f0f4f2", border: "1px solid rgba(0,0,0,0.07)", color: "#0a1a14" }}
              />
            </div>

            {/* Period select */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="period" className="text-sm font-medium" style={{ color: "#0a1a14" }}>
                Class period
              </label>
              <select
                id="period"
                aria-label="Class period"
                value={period}
                onChange={(e) => { setPeriod(e.target.value); setError(null); }}
                disabled={loading}
                className="w-full rounded-xl px-4 py-3 text-base disabled:opacity-50"
                style={{ background: "#f0f4f2", border: "1px solid rgba(0,0,0,0.07)", color: "#0a1a14" }}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((p) => (
                  <option key={p} value={p}>Period {p}</option>
                ))}
              </select>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={!displayName.trim() || loading}
              className="w-full rounded-xl py-3 text-base font-bold tracking-wide transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: "#006e55", color: "white" }}
            >
              {loading ? "Signing in..." : "Sign in →"}
            </button>

            {/* Error message */}
            {error && (
              <p role="alert" className="text-sm text-center -mt-1" style={{ color: "#dc2626" }}>
                {error}
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

