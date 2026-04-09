"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { type DailyWonder } from "@/data/dailyWonders";

const LAST_WONDER_KEY = "biospark:lastWonderDate";

function getTodayString(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

interface DailyWonderSplashProps {
  wonder: DailyWonder;
  onComplete: () => void;
}

export default function DailyWonderSplash({
  wonder,
  onComplete,
}: DailyWonderSplashProps) {
  const [visible, setVisible] = useState(true);
  const calledRef = useRef(false);

  const handleComplete = useCallback(() => {
    if (calledRef.current) return;
    calledRef.current = true;
    localStorage.setItem(LAST_WONDER_KEY, getTodayString());
    setVisible(false);
  }, []);

  // Auto-advance after 3000ms
  useEffect(() => {
    const timer = setTimeout(() => {
      handleComplete();
    }, 3000);
    return () => clearTimeout(timer);
  }, [handleComplete]);

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {visible && (
        <motion.div
          key="daily-wonder-splash"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{
            opacity: { duration: visible ? 0.4 : 0.35 },
            scale: { duration: 0.35 },
          }}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            minHeight: "100vh",
            background: "#0d4a2f",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
          }}
          aria-modal="true"
          role="dialog"
          aria-label="Daily Wonder"
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              maxWidth: 560,
              padding: "0 24px",
            }}
          >
            {/* BioSpark wordmark */}
            <p
              style={{
                fontFamily: "var(--font-lora), Georgia, serif",
                fontStyle: "italic",
                fontWeight: 700,
                fontSize: 13,
                color: "#d6f0e4",
                opacity: 0.35,
                letterSpacing: "0.04em",
                marginBottom: 48,
              }}
            >
              BioSpark
            </p>

            {/* "Daily Wonder" label */}
            <p
              style={{
                fontFamily: "var(--font-dm-mono), monospace",
                fontSize: 9,
                textTransform: "uppercase",
                letterSpacing: "0.13em",
                color: "#d6f0e4",
                opacity: 0.4,
                marginBottom: 20,
              }}
            >
              Daily Wonder
            </p>

            {/* Wonder fact */}
            <p
              style={{
                fontFamily: "var(--font-lora), Georgia, serif",
                fontStyle: "italic",
                fontWeight: 700,
                fontSize: 26,
                color: "#d6f0e4",
                lineHeight: 1.45,
                maxWidth: 500,
                marginBottom: 48,
              }}
            >
              {wonder.fact}
            </p>

            {/* Tap to continue */}
            <button
              type="button"
              onClick={handleComplete}
              style={{
                fontFamily: "var(--font-dm-mono), monospace",
                fontSize: 9,
                textTransform: "uppercase",
                color: "#d6f0e4",
                opacity: 0.22,
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "8px 16px",
                letterSpacing: "0.08em",
              }}
              aria-label="Dismiss daily wonder and continue to dashboard"
            >
              tap to continue
            </button>
          </div>

          {/* Progress bar pinned to bottom */}
          <ProgressBar />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ProgressBar() {
  const [started, setStarted] = useState(false);

  useEffect(() => {
    // Kick off the animation on next tick so the transition fires
    const raf = requestAnimationFrame(() => setStarted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 3,
        background: "rgba(214,240,228,0.1)",
      }}
      aria-hidden="true"
    >
      <div
        style={{
          height: "100%",
          background: "#d6f0e4",
          width: started ? "100%" : "0%",
          transition: started ? "width 3000ms linear" : "none",
        }}
      />
    </div>
  );
}
