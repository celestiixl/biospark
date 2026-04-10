"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

type LessonCompletionScreenProps = {
  lessonTitle: string;
  teks: string[];
  xpEarned: number;
  completionHook: string;
  onKeepGoing: () => void;
  onComeBackLater: () => void;
};

// ─── Canvas animation ────────────────────────────────────────────────────────

interface Blob {
  x: number;
  y: number;
  radius: number;
  hue: number;
  baseAlpha: number;
  speed: number;
  phase: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  hue: number;
  speed: number;
  phase: number;
}

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function runCanvasAnimation(canvas: HTMLCanvasElement) {
  const context = canvas.getContext("2d");
  if (!context) return () => {};

  const W = canvas.width;
  const H = canvas.height;

  const blobs: Blob[] = Array.from({ length: 7 }, () => ({
    x: rand(0, W),
    y: rand(0, H),
    radius: rand(80, 220),
    hue: rand(145, 185),
    baseAlpha: rand(0.09, 0.22),
    speed: rand(0.3, 0.8),
    phase: rand(0, Math.PI * 2),
  }));

  const particles: Particle[] = Array.from({ length: 90 }, () => ({
    x: rand(0, W),
    y: rand(0, H),
    vx: rand(-0.15, 0.15),
    vy: rand(-0.15, 0.15),
    radius: rand(0.6, 3),
    hue: rand(150, 200),
    speed: rand(0.4, 1.2),
    phase: rand(0, Math.PI * 2),
  }));

  let t = 0;
  let rafId: number;

  function draw() {
    context.clearRect(0, 0, W, H);

    // Draw blobs
    for (const blob of blobs) {
      const alpha =
        blob.baseAlpha +
        (blob.baseAlpha * 0.5) * Math.sin(t * blob.speed + blob.phase);
      const gradient = context.createRadialGradient(
        blob.x, blob.y, 0,
        blob.x, blob.y, blob.radius,
      );
      gradient.addColorStop(0, `hsla(${blob.hue}, 70%, 55%, ${alpha})`);
      gradient.addColorStop(1, `hsla(${blob.hue}, 70%, 55%, 0)`);
      context.beginPath();
      context.arc(blob.x, blob.y, blob.radius, 0, Math.PI * 2);
      context.fillStyle = gradient;
      context.fill();
    }

    // Draw particles
    for (const p of particles) {
      const opacity = Math.abs(Math.sin(t * p.speed + p.phase));

      // Soft glow
      const glow = context.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 5);
      glow.addColorStop(0, `hsla(${p.hue}, 80%, 70%, ${opacity * 0.3})`);
      glow.addColorStop(1, `hsla(${p.hue}, 80%, 70%, 0)`);
      context.beginPath();
      context.arc(p.x, p.y, p.radius * 5, 0, Math.PI * 2);
      context.fillStyle = glow;
      context.fill();

      // Core dot
      context.beginPath();
      context.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      context.fillStyle = `hsla(${p.hue}, 80%, 80%, ${opacity})`;
      context.fill();

      // Drift + wrap
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;
    }

    t += 0.016;
    rafId = requestAnimationFrame(draw);
  }

  rafId = requestAnimationFrame(draw);
  return () => cancelAnimationFrame(rafId);
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function LessonCompletionScreen({
  lessonTitle,
  teks,
  xpEarned,
  completionHook,
  onKeepGoing,
  onComeBackLater,
}: LessonCompletionScreenProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width || window.innerWidth;
    canvas.height = rect.height || window.innerHeight;

    const cleanup = runCanvasAnimation(canvas);
    return cleanup;
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        background: "#040f07",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
      aria-modal="true"
      role="dialog"
      aria-label="Lesson complete"
    >
      {/* Animated canvas background */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 0,
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          padding: "52px 32px",
          maxWidth: 500,
          margin: "0 auto",
          width: "100%",
        }}
      >
        {/* 1. XP row */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 10,
            marginBottom: 5,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-lora), Georgia, serif",
              fontStyle: "italic",
              fontWeight: 700,
              fontSize: 62,
              color: "#fef3d6",
              lineHeight: 1,
            }}
          >
            {xpEarned}
          </span>
          <span
            style={{
              fontFamily: "var(--font-dm-mono), monospace",
              fontSize: 10,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: "#b8860b",
            }}
          >
            XP earned
          </span>
        </div>

        {/* 2. "Lesson complete." */}
        <p
          style={{
            fontFamily: "var(--font-lora), Georgia, serif",
            fontStyle: "italic",
            fontWeight: 700,
            fontSize: 20,
            color: "#d6f0e4",
            marginBottom: 4,
          }}
        >
          Lesson complete.
        </p>

        {/* 3. lessonTitle */}
        <p
          style={{
            fontFamily: "var(--font-dm-mono), monospace",
            fontSize: 9,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "#8bbfa4",
            opacity: 0.65,
            marginBottom: 30,
          }}
        >
          {lessonTitle}
        </p>

        {/* 4. Hook card */}
        <div
          style={{
            background: "rgba(8,40,20,0.7)",
            border: "1px solid rgba(80,200,150,0.22)",
            borderRadius: 14,
            padding: "20px 24px",
            marginBottom: 26,
            width: "100%",
            textAlign: "left",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-dm-mono), monospace",
              fontSize: 8,
              textTransform: "uppercase",
              letterSpacing: "0.13em",
              color: "#8bbfa4",
              opacity: 0.5,
              marginBottom: 10,
            }}
          >
            What this unlocks in the real world
          </p>
          <p
            style={{
              fontFamily: "var(--font-dm-sans), sans-serif",
              fontWeight: 500,
              fontSize: 14,
              color: "#d6f0e4",
              opacity: 0.92,
              lineHeight: 1.65,
              fontStyle: "normal",
            }}
          >
            {completionHook}
          </p>
        </div>

        {/* 5. TEKS pills */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 6,
            marginBottom: 34,
          }}
        >
          {teks.map((t) => (
            <span
              key={t}
              style={{
                fontFamily: "var(--font-dm-mono), monospace",
                fontSize: 9,
                textTransform: "uppercase",
                color: "#8bbfa4",
                background: "rgba(80,200,150,0.1)",
                border: "1px solid rgba(80,200,150,0.22)",
                borderRadius: 20,
                padding: "4px 11px",
              }}
            >
              {t}
            </span>
          ))}
        </div>

        {/* 6. Button row */}
        <div
          style={{
            display: "flex",
            gap: 14,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <button
            type="button"
            onClick={onKeepGoing}
            aria-label="Keep going to next lesson"
            style={{
              border: "1.5px solid rgba(100,220,170,0.6)",
              borderRadius: 20,
              background: "transparent",
              fontFamily: "var(--font-lora), Georgia, serif",
              fontStyle: "italic",
              fontWeight: 700,
              fontSize: 16,
              color: "#d6f0e4",
              padding: "13px 34px",
              cursor: "pointer",
              animation: "bs-glowpulse 2.4s ease-in-out infinite",
            }}
          >
            Keep going
          </button>

          <button
            type="button"
            onClick={onComeBackLater}
            aria-label="Come back later"
            className="bs-completion-secondary"
            style={{
              border: "1px solid rgba(214,240,228,0.15)",
              borderRadius: 20,
              background: "transparent",
              fontFamily: "var(--font-dm-sans), sans-serif",
              fontWeight: 500,
              fontSize: 14,
              color: "#8bbfa4",
              padding: "13px 34px",
              cursor: "pointer",
            }}
          >
            Come back later
          </button>
        </div>
      </div>

      <style>{`
        @keyframes bs-glowpulse {
          0%, 100% {
            box-shadow: 0 0 8px rgba(80,200,150,0.3), 0 0 20px rgba(80,200,150,0.1);
          }
          50% {
            box-shadow: 0 0 18px rgba(80,200,150,0.6), 0 0 40px rgba(80,200,150,0.2);
          }
        }
        .bs-completion-secondary:hover {
          border-color: rgba(214,240,228,0.35) !important;
          color: #d6f0e4 !important;
        }
      `}</style>
    </motion.div>
  );
}
