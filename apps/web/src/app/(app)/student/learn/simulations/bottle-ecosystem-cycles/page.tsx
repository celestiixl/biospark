"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { PageBanner, PageContent } from "@/components/ui";
import StudentFloatingDock from "@/components/student/StudentFloatingDock";

// ── Types ──────────────────────────────────────────────────────────────────

interface BottleOrganism {
  id: string;
  name: string;
  role: "producer" | "consumer" | "decomposer";
  zone: "terrestrial" | "aquatic";
  svgKey: string;
  emoji: string;
  color: string;
}

type CycleType = "water" | "carbon" | "nitrogen";

interface StudentPrediction {
  sceneId: string;
  questionText: string;
  studentAnswer: string;
  wasCorrect: boolean | null;
}

interface BottleLabState {
  organisms: BottleOrganism[];
  placedOrganisms: string[];
  completedScenes: string[];
  predictions: StudentPrediction[];
  currentScene: number;
  cycleScore: Record<string, number>;
}

// ── Static data ─────────────────────────────────────────────────────────────

const ALL_ORGANISMS: BottleOrganism[] = [
  {
    id: "plant",
    name: "Aquatic Plant",
    role: "producer",
    zone: "aquatic",
    svgKey: "plant",
    emoji: "🌿",
    color: "#22c55e",
  },
  {
    id: "fish",
    name: "Fish",
    role: "consumer",
    zone: "aquatic",
    svgKey: "fish",
    emoji: "🐟",
    color: "#60a5fa",
  },
  {
    id: "cricket",
    name: "Cricket",
    role: "consumer",
    zone: "terrestrial",
    svgKey: "cricket",
    emoji: "🦗",
    color: "#a78bfa",
  },
  {
    id: "worm",
    name: "Worm",
    role: "decomposer",
    zone: "terrestrial",
    svgKey: "worm",
    emoji: "🪱",
    color: "#f59e0b",
  },
  {
    id: "seeds",
    name: "Seeds",
    role: "producer",
    zone: "terrestrial",
    svgKey: "seeds",
    emoji: "🌱",
    color: "#4ade80",
  },
];

const CYCLE_COLORS: Record<CycleType, string> = {
  water: "#60a5fa",
  carbon: "#22c55e",
  nitrogen: "#f59e0b",
};

const SCENE_META = [
  { id: "setup", label: "Setup", icon: "🍶", cycleType: null },
  { id: "water", label: "Water Cycle", icon: "💧", cycleType: "water" as CycleType },
  { id: "carbon", label: "Carbon Cycle", icon: "🌿", cycleType: "carbon" as CycleType },
  { id: "nitrogen", label: "Nitrogen Cycle", icon: "🪱", cycleType: "nitrogen" as CycleType },
  { id: "reflect", label: "Reflect & Connect", icon: "✍️", cycleType: null },
];

// ── Sub-components ───────────────────────────────────────────────────────────

// ── Bottle SVG ────────────────────────────────────────────────────────────

interface BottleSVGProps {
  placedOrganisms: string[];
  activeOrganismIds: string[];
  cycleType: CycleType | null;
  animating: boolean;
}

function BottleSVG({ placedOrganisms, activeOrganismIds, cycleType, animating }: BottleSVGProps) {
  const placed = ALL_ORGANISMS.filter((o) => placedOrganisms.includes(o.id));
  const aquatic = placed.filter((o) => o.zone === "aquatic");
  const terrestrial = placed.filter((o) => o.zone === "terrestrial");

  return (
    <svg
      viewBox="0 0 220 380"
      width="220"
      height="380"
      aria-label="Bottle ecosystem diagram"
      style={{ filter: "drop-shadow(0 0 24px #00d4aa33)" }}
    >
      {/* Bottle outline */}
      <rect x="30" y="20" width="160" height="340" rx="30" ry="30"
        fill="#0d2a3e" stroke="#1e3a52" strokeWidth="2" />

      {/* Aquatic zone */}
      <rect x="31" y="220" width="158" height="139" rx="0" ry="0"
        fill="#0a2540" />
      <rect x="31" y="218" width="158" height="6" rx="2"
        fill="#1e4a7a" opacity="0.7" />

      {/* Soil zone */}
      <rect x="31" y="300" width="158" height="59" rx="0" ry="0"
        fill="#2d1a0a" />
      <rect x="31" y="298" width="158" height="5" rx="0"
        fill="#4a2e12" />

      {/* Air zone label */}
      <text x="110" y="50" textAnchor="middle" fontSize="9" fill="#94a3b8" fontFamily="Outfit, sans-serif">
        AIR
      </text>
      <text x="110" y="245" textAnchor="middle" fontSize="9" fill="#60a5fa" fontFamily="Outfit, sans-serif">
        AQUATIC
      </text>
      <text x="110" y="325" textAnchor="middle" fontSize="9" fill="#a16207" fontFamily="Outfit, sans-serif">
        SOIL
      </text>

      {/* Organisms */}
      {aquatic.map((org, i) => {
        const isActive = activeOrganismIds.includes(org.id);
        const cx = 70 + i * 50;
        const cy = 265;
        return (
          <g key={org.id}>
            {isActive && (
              <circle cx={cx} cy={cy} r="18" fill={org.color} opacity="0.18">
                <animate attributeName="r" values="18;24;18" dur="1.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.18;0.32;0.18" dur="1.5s" repeatCount="indefinite" />
              </circle>
            )}
            <text x={cx} y={cy + 6} textAnchor="middle" fontSize="20" fontFamily="serif">
              {org.emoji}
            </text>
          </g>
        );
      })}
      {terrestrial.map((org, i) => {
        const isActive = activeOrganismIds.includes(org.id);
        const cx = 65 + i * 40;
        const cy = 175;
        return (
          <g key={org.id}>
            {isActive && (
              <circle cx={cx} cy={cy} r="16" fill={org.color} opacity="0.18">
                <animate attributeName="r" values="16;22;16" dur="1.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.18;0.32;0.18" dur="1.5s" repeatCount="indefinite" />
              </circle>
            )}
            <text x={cx} y={cy + 6} textAnchor="middle" fontSize="18" fontFamily="serif">
              {org.emoji}
            </text>
          </g>
        );
      })}

      {/* Bottle cap */}
      <rect x="75" y="10" width="70" height="15" rx="6" fill="#1e3a52" stroke="#2a4a62" strokeWidth="1" />

      {/* Water cycle animation */}
      {cycleType === "water" && animating && (
        <g>
          {/* Evaporation droplets */}
          <circle cx="100" cy="220" r="4" fill="#60a5fa" opacity="0.8">
            <animateMotion dur="2s" repeatCount="indefinite"
              path="M 0 0 C 0 -80 20 -160 10 -180" />
            <animate attributeName="opacity" values="0.8;0.2;0" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="130" cy="220" r="3" fill="#60a5fa" opacity="0.7">
            <animateMotion dur="2.5s" repeatCount="indefinite" begin="0.5s"
              path="M 0 0 C 10 -70 -10 -140 5 -170" />
            <animate attributeName="opacity" values="0.7;0.3;0" dur="2.5s" repeatCount="indefinite" begin="0.5s" />
          </circle>
          {/* Condensation on bottle walls */}
          <circle cx="40" cy="80" r="3" fill="#60a5fa" opacity="0.6">
            <animateMotion dur="3s" repeatCount="indefinite" begin="1s"
              path="M 0 0 L 0 120" />
          </circle>
          <circle cx="180" cy="100" r="3" fill="#60a5fa" opacity="0.6">
            <animateMotion dur="3.5s" repeatCount="indefinite" begin="1.5s"
              path="M 0 0 L 0 100" />
          </circle>
          {/* Label */}
          <text x="110" y="130" textAnchor="middle" fontSize="8" fill="#60a5fa" fontFamily="Outfit, sans-serif" opacity="0.8">
            evaporation ↑
          </text>
          <text x="55" y="160" textAnchor="middle" fontSize="7" fill="#60a5fa" fontFamily="Outfit, sans-serif" opacity="0.7">
            condensation
          </text>
        </g>
      )}

      {/* Carbon cycle animation */}
      {cycleType === "carbon" && animating && (
        <g>
          {/* CO2 from fish */}
          <text x="95" y="250" fontSize="8" fill="#22c55e" fontFamily="Outfit, sans-serif" opacity="0">
            CO₂
            <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite" />
            <animateMotion dur="2s" repeatCount="indefinite" path="M 0 0 L -20 -80" />
          </text>
          {/* CO2 from cricket */}
          <text x="140" y="160" fontSize="8" fill="#22c55e" fontFamily="Outfit, sans-serif" opacity="0">
            CO₂
            <animate attributeName="opacity" values="0;1;0" dur="2.5s" repeatCount="indefinite" begin="0.5s" />
            <animateMotion dur="2.5s" repeatCount="indefinite" begin="0.5s" path="M 0 0 L -30 -60" />
          </text>
          {/* O2 arrow from plant */}
          <text x="65" y="150" fontSize="8" fill="#4ade80" fontFamily="Outfit, sans-serif" opacity="0">
            O₂ →
            <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite" begin="1s" />
            <animateMotion dur="2s" repeatCount="indefinite" begin="1s" path="M 0 0 L 0 -40" />
          </text>
          <text x="110" y="90" textAnchor="middle" fontSize="8" fill="#22c55e" fontFamily="Outfit, sans-serif" opacity="0.8">
            photosynthesis ↓
          </text>
          <text x="110" y="200" textAnchor="middle" fontSize="8" fill="#22c55e" fontFamily="Outfit, sans-serif" opacity="0.7">
            respiration ↑
          </text>
        </g>
      )}

      {/* Nitrogen cycle animation */}
      {cycleType === "nitrogen" && animating && (
        <g>
          {/* Dead matter to soil */}
          <circle cx="90" cy="285" r="4" fill="#f59e0b" opacity="0">
            <animate attributeName="opacity" values="0;0.9;0" dur="2s" repeatCount="indefinite" />
            <animateMotion dur="2s" repeatCount="indefinite" path="M 0 0 L 10 30" />
          </circle>
          {/* Nitrogen arrow to roots */}
          <line x1="80" y1="310" x2="80" y2="340" stroke="#f59e0b" strokeWidth="2" opacity="0">
            <animate attributeName="opacity" values="0;0.8;0" dur="2s" repeatCount="indefinite" begin="0.8s" />
          </line>
          <text x="110" y="285" textAnchor="middle" fontSize="7" fill="#f59e0b" fontFamily="Outfit, sans-serif" opacity="0.8">
            decomposition
          </text>
          <text x="110" y="350" textAnchor="middle" fontSize="7" fill="#f59e0b" fontFamily="Outfit, sans-serif" opacity="0.8">
            N absorbed by roots
          </text>
          {/* Worm movement hint */}
          <circle cx="100" cy="305" r="5" fill="#f59e0b" opacity="0">
            <animate attributeName="opacity" values="0;0.7;0" dur="1.5s" repeatCount="indefinite" begin="0.3s" />
            <animateMotion dur="1.5s" repeatCount="indefinite" begin="0.3s" path="M 0 0 C 10 5 -5 10 5 15" />
          </circle>
        </g>
      )}

      {/* Bottle label */}
      <rect x="65" y="355" width="90" height="16" rx="8" fill="#132638" />
      <text x="110" y="367" textAnchor="middle" fontSize="8" fill="#00d4aa" fontFamily="Outfit, sans-serif" fontWeight="bold">
        BOTTLE ECOSYSTEM
      </text>
    </svg>
  );
}

// ── Prediction Gate ───────────────────────────────────────────────────────

interface PredictionGateProps {
  question: string;
  options?: string[];
  onSubmit: (answer: string) => void;
  submitted: boolean;
}

function PredictionGate({ question, options, onSubmit, submitted }: PredictionGateProps) {
  const [answer, setAnswer] = useState("");

  if (submitted) return null;

  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: "#132638", border: "1px solid #1e3a52" }}
    >
      <p
        style={{
          fontFamily: "Outfit, sans-serif",
          fontSize: 13,
          color: "#f59e0b",
          fontWeight: 600,
          marginBottom: 6,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        🔒 Prediction Gate
      </p>
      <p
        style={{
          fontFamily: "Outfit, sans-serif",
          fontSize: 14,
          color: "#e2e8f0",
          marginBottom: 12,
          lineHeight: 1.6,
        }}
      >
        {question}
      </p>
      {options ? (
        <div className="flex flex-col gap-2">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              aria-pressed={answer === opt}
              onClick={() => setAnswer(opt)}
              className="rounded-xl px-4 py-2 text-sm font-semibold text-left transition-all"
              style={{
                background: answer === opt ? "#00d4aa22" : "#0d1e2c",
                border: `1px solid ${answer === opt ? "#00d4aa" : "#1e3a52"}`,
                color: answer === opt ? "#00d4aa" : "#94a3b8",
                fontFamily: "Outfit, sans-serif",
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      ) : (
        <textarea
          aria-label="Prediction answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          rows={2}
          placeholder="Type your prediction…"
          className="w-full resize-none rounded-xl p-3 text-sm outline-none"
          style={{
            background: "#0d1e2c",
            border: "1px solid #1e3a52",
            color: "#e2e8f0",
            fontFamily: "Outfit, sans-serif",
          }}
        />
      )}
      <button
        type="button"
        aria-label="Submit prediction to unlock animation"
        onClick={() => answer.trim() && onSubmit(answer)}
        disabled={!answer.trim()}
        className="mt-3 rounded-full px-5 py-2 text-sm font-semibold transition-opacity hover:opacity-80 disabled:opacity-40"
        style={{
          background: "#00d4aa",
          color: "#0d1e2c",
          fontFamily: "Outfit, sans-serif",
        }}
      >
        Submit Prediction →
      </button>
    </div>
  );
}

// ── Scene 0: Setup ────────────────────────────────────────────────────────

interface SetupSceneProps {
  placedOrganisms: string[];
  onPlace: (id: string) => void;
}

function SetupScene({ placedOrganisms, onPlace }: SetupSceneProps) {
  return (
    <div className="space-y-4">
      <div
        className="rounded-2xl p-4"
        style={{ background: "#132638", border: "1px solid #1e3a52" }}
      >
        <h3
          style={{
            fontFamily: "Outfit, sans-serif",
            fontWeight: 700,
            fontSize: 15,
            color: "#e2e8f0",
            marginBottom: 6,
          }}
        >
          🍶 Build Your Bottle Ecosystem
        </h3>
        <p style={{ fontFamily: "Outfit, sans-serif", fontSize: 13, color: "#94a3b8", lineHeight: 1.6 }}>
          Click each organism to add it to your bottle. You need all five to activate the simulation.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {ALL_ORGANISMS.map((org) => {
          const placed = placedOrganisms.includes(org.id);
          return (
            <button
              key={org.id}
              type="button"
              aria-pressed={placed}
              aria-label={`${placed ? "Remove" : "Add"} ${org.name}`}
              onClick={() => onPlace(org.id)}
              className="rounded-2xl p-3 text-left transition-all hover:opacity-80"
              style={{
                background: placed ? `${org.color}22` : "#0d1e2c",
                border: `1.5px solid ${placed ? org.color : "#1e3a52"}`,
              }}
            >
              <div style={{ fontSize: 24 }}>{org.emoji}</div>
              <div
                style={{
                  fontFamily: "Outfit, sans-serif",
                  fontWeight: 600,
                  fontSize: 13,
                  color: placed ? org.color : "#e2e8f0",
                  marginTop: 4,
                }}
              >
                {org.name}
              </div>
              <div
                style={{
                  fontFamily: "Outfit, sans-serif",
                  fontSize: 11,
                  color: "#64748b",
                  marginTop: 2,
                  textTransform: "capitalize",
                }}
              >
                {org.role} · {org.zone}
              </div>
              {placed && (
                <div
                  style={{
                    fontFamily: "Outfit, sans-serif",
                    fontSize: 10,
                    color: org.color,
                    marginTop: 4,
                    fontWeight: 700,
                  }}
                >
                  ✓ In bottle
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div
        className="rounded-xl p-3"
        style={{
          background: placedOrganisms.length === ALL_ORGANISMS.length ? "#00d4aa11" : "#0d1e2c",
          border: `1px solid ${placedOrganisms.length === ALL_ORGANISMS.length ? "#00d4aa44" : "#1e3a52"}`,
          fontFamily: "Outfit, sans-serif",
          fontSize: 13,
          color: placedOrganisms.length === ALL_ORGANISMS.length ? "#00d4aa" : "#64748b",
          transition: "all 0.3s",
        }}
      >
        {placedOrganisms.length === ALL_ORGANISMS.length
          ? "✅ All organisms placed — your ecosystem is ready!"
          : `${placedOrganisms.length} / ${ALL_ORGANISMS.length} organisms placed`}
      </div>
    </div>
  );
}

// ── Scene 1: Water Cycle ──────────────────────────────────────────────────

interface WaterCycleSceneProps {
  prediction: StudentPrediction | undefined;
  onPrediction: (answer: string) => void;
  animating: boolean;
}

function WaterCycleScene({ prediction, onPrediction, animating }: WaterCycleSceneProps) {
  return (
    <div className="space-y-4">
      <div
        className="rounded-2xl p-4"
        style={{ background: "#132638", border: "1px solid #1e3a52" }}
      >
        <h3 style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: 15, color: "#60a5fa", marginBottom: 6 }}>
          💧 Water Cycle
        </h3>
        <p style={{ fontFamily: "Outfit, sans-serif", fontSize: 13, color: "#94a3b8", lineHeight: 1.6 }}>
          Water evaporates from the aquatic zone, condenses on the bottle walls, and drips back down. This is a closed loop — no water enters or leaves the sealed bottle.
        </p>
      </div>

      <PredictionGate
        question="Before the animation plays: Where does the water go after it evaporates from the aquatic zone?"
        options={[
          "It condenses on the bottle walls and drips back down",
          "It escapes through the bottle cap",
          "It is absorbed directly by the soil without condensing",
          "It disappears and is lost from the system",
        ]}
        onSubmit={onPrediction}
        submitted={!!prediction}
      />

      {animating && prediction && (
        <div
          className="rounded-2xl p-4"
          style={{ background: "#0a2540", border: "1px solid #1e4a7a" }}
        >
          <p style={{ fontFamily: "Outfit, sans-serif", fontSize: 13, color: "#60a5fa", fontWeight: 600, marginBottom: 8 }}>
            🔵 Water Cycle Steps (animated in bottle)
          </p>
          <ol style={{ fontFamily: "Outfit, sans-serif", fontSize: 13, color: "#94a3b8", lineHeight: 2, paddingLeft: 20 }}>
            <li>☀️ Heat evaporates water from the aquatic zone</li>
            <li>💨 Water vapor rises and hits the cool bottle walls</li>
            <li>💧 Vapor condenses into droplets on glass surface</li>
            <li>⬇️ Droplets drip down into soil and aquatic zone</li>
          </ol>
        </div>
      )}

      {prediction && (
        <div
          className="rounded-xl p-3"
          style={{
            background: "#132638",
            border: "1px solid #1e3a52",
            fontFamily: "Outfit, sans-serif",
            fontSize: 13,
            color: "#94a3b8",
          }}
        >
          <span style={{ color: "#60a5fa", fontWeight: 600 }}>Your prediction: </span>
          {prediction.studentAnswer}
        </div>
      )}
    </div>
  );
}

// ── Scene 2: Carbon Cycle ─────────────────────────────────────────────────

interface CarbonCycleSceneProps {
  prediction: StudentPrediction | undefined;
  onPrediction: (answer: string) => void;
  animating: boolean;
}

function CarbonCycleScene({ prediction, onPrediction, animating }: CarbonCycleSceneProps) {
  return (
    <div className="space-y-4">
      <div
        className="rounded-2xl p-4"
        style={{ background: "#132638", border: "1px solid #1e3a52" }}
      >
        <h3 style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: 15, color: "#22c55e", marginBottom: 6 }}>
          🌿 Carbon Cycle
        </h3>
        <p style={{ fontFamily: "Outfit, sans-serif", fontSize: 13, color: "#94a3b8", lineHeight: 1.6 }}>
          Carbon flows as CO₂ is released by the fish and cricket during cellular respiration, then captured by the plant during photosynthesis to produce oxygen and glucose.
        </p>
      </div>

      <PredictionGate
        question="Identify the producer in this carbon cycle before the arrows appear. Which organism converts CO₂ into glucose using light energy?"
        options={[
          "Aquatic Plant 🌿 — uses CO₂ + light → glucose + O₂",
          "Fish 🐟 — breaks down glucose for energy",
          "Cricket 🦗 — consumes organic matter",
          "Worm 🪱 — decomposes dead organic material",
        ]}
        onSubmit={onPrediction}
        submitted={!!prediction}
      />

      {animating && prediction && (
        <div
          className="rounded-2xl p-4"
          style={{ background: "#0a1f0a", border: "1px solid #1a3a1a" }}
        >
          <p style={{ fontFamily: "Outfit, sans-serif", fontSize: 13, color: "#22c55e", fontWeight: 600, marginBottom: 8 }}>
            🟢 Carbon Cycle Arrows (animated in bottle)
          </p>
          <div className="space-y-2" style={{ fontFamily: "Outfit, sans-serif", fontSize: 13, color: "#94a3b8" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ color: "#22c55e", fontWeight: 700 }}>→</span>
              Fish &amp; Cricket respiration releases CO₂
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ color: "#22c55e", fontWeight: 700 }}>→</span>
              Aquatic Plant absorbs CO₂ for photosynthesis
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ color: "#22c55e", fontWeight: 700 }}>→</span>
              Plant releases O₂ — consumed by fish &amp; cricket
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ color: "#22c55e", fontWeight: 700 }}>→</span>
              Glucose stored in plant tissues feeds consumers
            </div>
          </div>
        </div>
      )}

      {prediction && (
        <div
          className="rounded-xl p-3"
          style={{
            background: "#132638",
            border: "1px solid #1e3a52",
            fontFamily: "Outfit, sans-serif",
            fontSize: 13,
            color: "#94a3b8",
          }}
        >
          <span style={{ color: "#22c55e", fontWeight: 600 }}>Your prediction: </span>
          {prediction.studentAnswer}
        </div>
      )}
    </div>
  );
}

// ── Scene 3: Nitrogen Cycle ───────────────────────────────────────────────

type NitrogenRankItem = { id: string; label: string };

const NITROGEN_STEPS: NitrogenRankItem[] = [
  { id: "a", label: "Organisms die and leave dead matter in the soil" },
  { id: "b", label: "Worm decomposes dead matter into simpler compounds" },
  { id: "c", label: "Nitrogen compounds dissolve in soil water" },
  { id: "d", label: "Plant roots absorb nitrogen from soil water" },
];

const CORRECT_NITROGEN_ORDER = ["a", "b", "c", "d"];

interface NitrogenCycleSceneProps {
  prediction: StudentPrediction | undefined;
  onPrediction: (answer: string) => void;
  animating: boolean;
}

function NitrogenCycleScene({ prediction, onPrediction, animating }: NitrogenCycleSceneProps) {
  const [order, setOrder] = useState<NitrogenRankItem[]>([...NITROGEN_STEPS]);
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  function handleDragStart(index: number) {
    dragItem.current = index;
  }

  function handleDragEnter(index: number) {
    dragOverItem.current = index;
  }

  function handleDragEnd() {
    if (dragItem.current === null || dragOverItem.current === null) return;
    const newOrder = [...order];
    const dragged = newOrder.splice(dragItem.current, 1)[0];
    newOrder.splice(dragOverItem.current, 0, dragged);
    setOrder(newOrder);
    dragItem.current = null;
    dragOverItem.current = null;
  }

  function handleSubmitRanking() {
    const answer = order.map((item) => item.label).join(" → ");
    onPrediction(answer);
  }

  const isCorrect = order.map((o) => o.id).join(",") === CORRECT_NITROGEN_ORDER.join(",");

  return (
    <div className="space-y-4">
      <div
        className="rounded-2xl p-4"
        style={{ background: "#132638", border: "1px solid #1e3a52" }}
      >
        <h3 style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: 15, color: "#f59e0b", marginBottom: 6 }}>
          🪱 Nitrogen Cycle
        </h3>
        <p style={{ fontFamily: "Outfit, sans-serif", fontSize: 13, color: "#94a3b8", lineHeight: 1.6 }}>
          Worms are decomposers that break down dead organic matter into nitrogen compounds. These compounds are absorbed by plant roots, completing the nitrogen cycle inside the bottle.
        </p>
      </div>

      {!prediction ? (
        <div
          className="rounded-2xl p-4"
          style={{ background: "#132638", border: "1px solid #1e3a52" }}
        >
          <p style={{ fontFamily: "Outfit, sans-serif", fontSize: 13, color: "#f59e0b", fontWeight: 600, marginBottom: 4 }}>
            🔒 Prediction Gate
          </p>
          <p style={{ fontFamily: "Outfit, sans-serif", fontSize: 13, color: "#e2e8f0", marginBottom: 12, lineHeight: 1.6 }}>
            Drag to rank these events in the correct order — what happens first, second, third, fourth?
          </p>
          <div className="space-y-2">
            {order.map((item, index) => (
              <div
                key={item.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragEnter={() => handleDragEnter(index)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => e.preventDefault()}
                className="flex cursor-grab items-center gap-3 rounded-xl p-3 transition-all active:cursor-grabbing"
                style={{ background: "#0d1e2c", border: "1px solid #1e3a52" }}
                aria-label={`Step ${index + 1}: ${item.label}. Drag to reorder.`}
              >
                <span style={{ color: "#64748b", fontSize: 12, fontFamily: "Outfit, sans-serif", minWidth: 20 }}>
                  {index + 1}.
                </span>
                <span style={{ color: "#94a3b8", fontSize: 13, fontFamily: "Outfit, sans-serif", lineHeight: 1.4 }}>
                  {item.label}
                </span>
                <span style={{ color: "#64748b", marginLeft: "auto" }}>⠿</span>
              </div>
            ))}
          </div>
          <button
            type="button"
            aria-label="Submit nitrogen cycle ranking"
            onClick={handleSubmitRanking}
            className="mt-4 rounded-full px-5 py-2 text-sm font-semibold transition-opacity hover:opacity-80"
            style={{ background: "#f59e0b", color: "#0d1e2c", fontFamily: "Outfit, sans-serif" }}
          >
            Submit Ranking →
          </button>
        </div>
      ) : null}

      {animating && prediction && (
        <div
          className="rounded-2xl p-4"
          style={{ background: "#1a0f00", border: "1px solid #3a2200" }}
        >
          <p style={{ fontFamily: "Outfit, sans-serif", fontSize: 13, color: "#f59e0b", fontWeight: 600, marginBottom: 8 }}>
            🟡 Nitrogen Cycle (animated in bottle)
          </p>
          <ol style={{ fontFamily: "Outfit, sans-serif", fontSize: 13, color: "#94a3b8", lineHeight: 2, paddingLeft: 20 }}>
            {NITROGEN_STEPS.map((step, i) => (
              <li key={step.id} style={{ color: isCorrect && order[i]?.id === step.id ? "#f59e0b" : "#94a3b8" }}>
                {step.label}
              </li>
            ))}
          </ol>
          {isCorrect && (
            <div style={{ fontFamily: "Outfit, sans-serif", fontSize: 13, color: "#f59e0b", marginTop: 8, fontWeight: 600 }}>
              ✅ You ranked the steps correctly!
            </div>
          )}
        </div>
      )}

      {prediction && (
        <div
          className="rounded-xl p-3"
          style={{
            background: "#132638",
            border: "1px solid #1e3a52",
            fontFamily: "Outfit, sans-serif",
            fontSize: 13,
            color: "#94a3b8",
          }}
        >
          <span style={{ color: "#f59e0b", fontWeight: 600 }}>Your ranking: </span>
          submitted ✓
        </div>
      )}
    </div>
  );
}

// ── Scene 4: Reflect & Connect ────────────────────────────────────────────

interface ReflectSceneProps {
  predictions: StudentPrediction[];
  submitted: boolean;
  feedback: string | null;
  onSubmit: (text: string) => Promise<void>;
}

function ReflectScene({ predictions, submitted, feedback, onSubmit }: ReflectSceneProps) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!text.trim() || loading) return;
    setLoading(true);
    await onSubmit(text);
    setLoading(false);
  }

  return (
    <div className="space-y-4">
      <div
        className="rounded-2xl p-4"
        style={{ background: "#132638", border: "1px solid #1e3a52" }}
      >
        <h3 style={{ fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: 15, color: "#e2e8f0", marginBottom: 6 }}>
          ✍️ Reflect &amp; Connect
        </h3>
        <p style={{ fontFamily: "Outfit, sans-serif", fontSize: 13, color: "#94a3b8", lineHeight: 1.6 }}>
          Now that you&apos;ve observed all three cycles, use what you know to answer this CER prompt.
        </p>
      </div>

      {/* Evidence scaffolding from earlier predictions */}
      {predictions.length > 0 && (
        <div
          className="rounded-2xl p-4 space-y-2"
          style={{ background: "#0d1e2c", border: "1px solid #1e3a52" }}
        >
          <p style={{ fontFamily: "Outfit, sans-serif", fontSize: 12, color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>
            📋 Your Earlier Predictions (use as evidence)
          </p>
          {predictions.map((p) => (
            <div
              key={p.sceneId}
              className="rounded-xl p-3"
              style={{ background: "#132638", border: "1px solid #1e3a52" }}
            >
              <p style={{ fontFamily: "Outfit, sans-serif", fontSize: 11, color: "#64748b", marginBottom: 2 }}>
                {p.questionText.slice(0, 60)}…
              </p>
              <p style={{ fontFamily: "Outfit, sans-serif", fontSize: 13, color: "#94a3b8" }}>
                {p.studentAnswer}
              </p>
            </div>
          ))}
        </div>
      )}

      <div
        className="rounded-2xl p-5"
        style={{ background: "#132638", border: "1px solid #1e3a52" }}
      >
        <p style={{ fontFamily: "Outfit, sans-serif", fontSize: 14, color: "#e2e8f0", fontWeight: 600, marginBottom: 4 }}>
          CER Prompt
        </p>
        <p style={{ fontFamily: "Outfit, sans-serif", fontSize: 14, color: "#cbd5e1", lineHeight: 1.6, marginBottom: 12 }}>
          &ldquo;Predict what happens if you remove the worms from the bottle ecosystem. Use one cycle to explain your reasoning.&rdquo;
        </p>
        <textarea
          aria-label="CER response"
          disabled={submitted}
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={5}
          placeholder="Write your Claim, Evidence, and Reasoning here…&#10;&#10;Claim: If the worms are removed...&#10;Evidence: From the nitrogen cycle, I observed that...&#10;Reasoning: This matters because..."
          className="w-full resize-none rounded-xl p-3 text-sm outline-none"
          style={{
            background: "#0d1e2c",
            border: "1px solid #1e3a52",
            color: "#e2e8f0",
            fontFamily: "Outfit, sans-serif",
            opacity: submitted ? 0.6 : 1,
          }}
        />
        {feedback && (
          <div
            className="mt-3 rounded-xl p-3"
            style={{
              background: "#00d4aa11",
              border: "1px solid #00d4aa44",
              fontFamily: "Outfit, sans-serif",
              fontSize: 13,
              color: "#94a3b8",
              lineHeight: 1.5,
            }}
          >
            <span style={{ color: "#00d4aa", fontWeight: 600 }}>Feedback: </span>
            {feedback}
          </div>
        )}
        {!submitted && (
          <button
            type="button"
            aria-label="Submit CER reflection"
            onClick={handleSubmit}
            disabled={!text.trim() || loading}
            className="mt-3 rounded-full px-5 py-2 text-sm font-semibold transition-opacity hover:opacity-80 disabled:opacity-40"
            style={{ background: "#00d4aa", color: "#0d1e2c", fontFamily: "Outfit, sans-serif" }}
          >
            {loading ? "Scoring…" : "Submit CER →"}
          </button>
        )}
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────

export default function BottleEcosystemCyclesPage() {
  const [labState, setLabState] = useState<BottleLabState>({
    organisms: ALL_ORGANISMS,
    placedOrganisms: [],
    completedScenes: [],
    predictions: [],
    currentScene: 0,
    cycleScore: {},
  });

  const [animating, setAnimating] = useState(false);
  const [reflectionSubmitted, setReflectionSubmitted] = useState(false);
  const [reflectionFeedback, setReflectionFeedback] = useState<string | null>(null);

  const allPlaced = labState.placedOrganisms.length === ALL_ORGANISMS.length;
  const currentSceneMeta = SCENE_META[labState.currentScene];

  // ── Helpers ──
  function toggleOrganism(id: string) {
    setLabState((prev) => {
      const already = prev.placedOrganisms.includes(id);
      return {
        ...prev,
        placedOrganisms: already
          ? prev.placedOrganisms.filter((o) => o !== id)
          : [...prev.placedOrganisms, id],
      };
    });
  }

  function getPrediction(sceneId: string) {
    return labState.predictions.find((p) => p.sceneId === sceneId);
  }

  function addPrediction(sceneId: string, questionText: string, answer: string) {
    setLabState((prev) => ({
      ...prev,
      predictions: [
        ...prev.predictions.filter((p) => p.sceneId !== sceneId),
        { sceneId, questionText, studentAnswer: answer, wasCorrect: null },
      ],
    }));
    setAnimating(true);
  }

  function goToScene(index: number) {
    // Can only navigate to completed or current scenes, or setup
    const canNavigate =
      index === 0 ||
      labState.completedScenes.includes(SCENE_META[index]?.id ?? "") ||
      index === labState.currentScene ||
      (index === labState.currentScene + 1 && labState.completedScenes.includes(SCENE_META[labState.currentScene]?.id ?? ""));
    if (!canNavigate) return;
    setLabState((prev) => ({ ...prev, currentScene: index }));
    setAnimating(false);
  }

  function completeCurrentScene() {
    const sceneId = currentSceneMeta.id;
    setLabState((prev) => ({
      ...prev,
      completedScenes: prev.completedScenes.includes(sceneId)
        ? prev.completedScenes
        : [...prev.completedScenes, sceneId],
      currentScene: Math.min(prev.currentScene + 1, SCENE_META.length - 1),
    }));
    setAnimating(false);
  }

  // ── Reflection CER submission ──
  async function handleReflectionSubmit(text: string) {
    try {
      const res = await fetch("/api/score/cer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          rubric: {
            criteria: [
              "States a clear claim about what happens when worms are removed",
              "References a specific cycle (nitrogen, water, or carbon) as evidence",
              "Explains the reasoning connecting the evidence to the claim",
            ],
          },
        }),
      });
      const data = await res.json();
      const score: number = typeof data.score === "number" ? data.score : 0;
      const max: number = typeof data.maxScore === "number" ? data.maxScore : 3;
      if (score >= max * 0.66) {
        setReflectionFeedback(
          "Excellent CER! You identified that removing the worms would disrupt the nitrogen cycle, preventing decomposition of dead matter and starving plant roots of nitrogen compounds.",
        );
      } else {
        setReflectionFeedback(
          "Good start! Make sure your response includes: a Claim (what happens without worms), Evidence (from a specific cycle you observed), and Reasoning (why that cycle breakdown matters for the whole ecosystem).",
        );
      }
      setLabState((prev) => ({
        ...prev,
        cycleScore: { ...prev.cycleScore, reflect: score },
      }));
    } catch {
      setReflectionFeedback(
        "Unable to score right now. Key idea: removing worms disrupts the nitrogen cycle — dead matter piles up, nitrogen compounds decrease, and plants lose their key nutrient source.",
      );
    }
    setReflectionSubmitted(true);
    setLabState((prev) => ({
      ...prev,
      completedScenes: prev.completedScenes.includes("reflect")
        ? prev.completedScenes
        : [...prev.completedScenes, "reflect"],
    }));
  }

  // ── Active organisms per cycle ──
  const activeOrganismIds: string[] = (() => {
    if (!animating) return [];
    switch (currentSceneMeta.cycleType) {
      case "water":
        return ["fish", "plant"];
      case "carbon":
        return ["fish", "cricket", "plant"];
      case "nitrogen":
        return ["worm", "plant"];
      default:
        return [];
    }
  })();

  return (
    <main
      className="ia-vh-page flex h-dvh flex-col overflow-hidden"
      style={{ background: "#0d1e2c", color: "#e2e8f0" }}
    >
      <PageBanner
        title="Bottle Ecosystem Cycles Lab"
        subtitle="Explore water, carbon & nitrogen cycles in a sealed bottle ecosystem — TEKS B.12A & B.12B"
      >
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/student/learn/unit-7"
            aria-label="Back to Unit 7"
            className="rounded-2xl px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:opacity-80"
            style={{ background: "rgba(255,255,255,0.15)" }}
          >
            ← Unit 7
          </Link>
          <Link
            href="/student/dashboard"
            aria-label="Go to dashboard"
            className="rounded-2xl px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:opacity-80"
            style={{ background: "rgba(255,255,255,0.15)" }}
          >
            Dashboard
          </Link>
        </div>
      </PageBanner>

      <PageContent className="flex-1 overflow-hidden">
        <div
          className="mx-auto flex h-full w-full max-w-6xl gap-0 overflow-hidden"
          style={{ fontFamily: "Outfit, sans-serif" }}
        >
          {/* ── Left Sidebar: Scene Progress ── */}
          <aside
            className="hidden w-56 shrink-0 flex-col gap-2 overflow-y-auto p-4 md:flex"
            style={{ borderRight: "1px solid #1e3a52" }}
            aria-label="Scene progress navigation"
          >
            <p
              style={{
                fontFamily: "Outfit, sans-serif",
                fontSize: 11,
                color: "#64748b",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: 4,
              }}
            >
              Progress
            </p>
            {SCENE_META.map((scene, index) => {
              const isCompleted = labState.completedScenes.includes(scene.id);
              const isCurrent = labState.currentScene === index;
              const isLocked =
                index > 0 &&
                !isCompleted &&
                !isCurrent &&
                !(index === 1 && allPlaced);

              return (
                <button
                  key={scene.id}
                  type="button"
                  aria-current={isCurrent ? "step" : undefined}
                  aria-label={`${scene.label}${isCompleted ? " (completed)" : isLocked ? " (locked)" : ""}`}
                  onClick={() => !isLocked && goToScene(index)}
                  disabled={isLocked}
                  className="flex items-center gap-3 rounded-xl p-3 text-left transition-all"
                  style={{
                    background: isCurrent ? "#132638" : "transparent",
                    border: `1px solid ${isCurrent ? "#1e3a52" : "transparent"}`,
                    cursor: isLocked ? "not-allowed" : "pointer",
                    opacity: isLocked ? 0.4 : 1,
                  }}
                >
                  <span style={{ fontSize: 18 }}>{isCompleted ? "✅" : scene.icon}</span>
                  <div>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: isCurrent ? 700 : 500,
                        color: isCurrent ? "#e2e8f0" : "#94a3b8",
                        fontFamily: "Outfit, sans-serif",
                      }}
                    >
                      {scene.label}
                    </div>
                    {scene.cycleType && (
                      <div
                        style={{
                          fontSize: 10,
                          color: CYCLE_COLORS[scene.cycleType],
                          fontFamily: "Outfit, sans-serif",
                          marginTop: 1,
                        }}
                      >
                        {scene.cycleType} cycle
                      </div>
                    )}
                  </div>
                </button>
              );
            })}

            {/* TEKS badges */}
            <div className="mt-auto pt-4 space-y-1">
              {["B.12A", "B.12B"].map((code) => (
                <span
                  key={code}
                  className="block rounded-full px-3 py-1 text-center text-xs font-semibold"
                  style={{
                    background: "#00d4aa22",
                    color: "#00d4aa",
                    border: "1px solid #00d4aa44",
                  }}
                >
                  TEKS {code}
                </span>
              ))}
            </div>
          </aside>

          {/* ── Main Content ── */}
          <div className="flex flex-1 flex-col overflow-hidden md:flex-row">
            {/* Bottle visualization */}
            <div
              className="flex shrink-0 items-center justify-center p-6"
              style={{ borderRight: "1px solid #1e3a52", minWidth: 260 }}
              aria-label="Bottle ecosystem visualization"
            >
              <div className="flex flex-col items-center gap-4">
                <BottleSVG
                  placedOrganisms={labState.placedOrganisms}
                  activeOrganismIds={activeOrganismIds}
                  cycleType={currentSceneMeta.cycleType}
                  animating={animating}
                />
                {/* Cycle legend */}
                {currentSceneMeta.cycleType && (
                  <div className="flex flex-wrap justify-center gap-3">
                    {(["water", "carbon", "nitrogen"] as CycleType[]).map((ct) => (
                      <span
                        key={ct}
                        className="rounded-full px-3 py-1 text-xs font-semibold"
                        style={{
                          background: `${CYCLE_COLORS[ct]}22`,
                          color: CYCLE_COLORS[ct],
                          border: `1px solid ${CYCLE_COLORS[ct]}44`,
                          opacity: currentSceneMeta.cycleType === ct ? 1 : 0.35,
                          textTransform: "capitalize",
                        }}
                      >
                        {ct}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Scene content */}
            <div className="flex-1 overflow-y-auto p-5">
              {/* Mobile scene nav */}
              <div className="mb-4 flex gap-2 overflow-x-auto md:hidden">
                {SCENE_META.map((scene, index) => {
                  const isCompleted = labState.completedScenes.includes(scene.id);
                  const isCurrent = labState.currentScene === index;
                  return (
                    <button
                      key={scene.id}
                      type="button"
                      aria-current={isCurrent ? "step" : undefined}
                      onClick={() => goToScene(index)}
                      className="shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold"
                      style={{
                        background: isCurrent ? "#132638" : "transparent",
                        border: `1px solid ${isCurrent ? "#1e3a52" : "transparent"}`,
                        color: isCompleted ? "#00d4aa" : isCurrent ? "#e2e8f0" : "#94a3b8",
                      }}
                    >
                      {isCompleted ? "✅" : scene.icon} {scene.label}
                    </button>
                  );
                })}
              </div>

              {/* Scene 0: Setup */}
              {labState.currentScene === 0 && (
                <>
                  <SetupScene
                    placedOrganisms={labState.placedOrganisms}
                    onPlace={toggleOrganism}
                  />
                  {allPlaced && (
                    <button
                      type="button"
                      aria-label="Activate bottle and start the simulation"
                      onClick={completeCurrentScene}
                      className="mt-4 rounded-full px-6 py-3 text-sm font-semibold transition-opacity hover:opacity-80"
                      style={{ background: "#00d4aa", color: "#0d1e2c" }}
                    >
                      Activate Bottle → Start Simulation
                    </button>
                  )}
                </>
              )}

              {/* Scene 1: Water Cycle */}
              {labState.currentScene === 1 && (
                <>
                  <WaterCycleScene
                    prediction={getPrediction("water")}
                    onPrediction={(answer) =>
                      addPrediction(
                        "water",
                        "Before the animation plays: Where does the water go after it evaporates from the aquatic zone?",
                        answer,
                      )
                    }
                    animating={animating}
                  />
                  {getPrediction("water") && (
                    <button
                      type="button"
                      aria-label="Continue to Carbon Cycle"
                      onClick={completeCurrentScene}
                      className="mt-4 rounded-full px-6 py-3 text-sm font-semibold transition-opacity hover:opacity-80"
                      style={{ background: "#60a5fa", color: "#0d1e2c" }}
                    >
                      Next: Carbon Cycle →
                    </button>
                  )}
                </>
              )}

              {/* Scene 2: Carbon Cycle */}
              {labState.currentScene === 2 && (
                <>
                  <CarbonCycleScene
                    prediction={getPrediction("carbon")}
                    onPrediction={(answer) =>
                      addPrediction(
                        "carbon",
                        "Identify the producer in this carbon cycle before the arrows appear.",
                        answer,
                      )
                    }
                    animating={animating}
                  />
                  {getPrediction("carbon") && (
                    <button
                      type="button"
                      aria-label="Continue to Nitrogen Cycle"
                      onClick={completeCurrentScene}
                      className="mt-4 rounded-full px-6 py-3 text-sm font-semibold transition-opacity hover:opacity-80"
                      style={{ background: "#22c55e", color: "#0d1e2c" }}
                    >
                      Next: Nitrogen Cycle →
                    </button>
                  )}
                </>
              )}

              {/* Scene 3: Nitrogen Cycle */}
              {labState.currentScene === 3 && (
                <>
                  <NitrogenCycleScene
                    prediction={getPrediction("nitrogen")}
                    onPrediction={(answer) =>
                      addPrediction(
                        "nitrogen",
                        "Rank these nitrogen cycle events from first to last.",
                        answer,
                      )
                    }
                    animating={animating}
                  />
                  {getPrediction("nitrogen") && (
                    <button
                      type="button"
                      aria-label="Continue to Reflect and Connect"
                      onClick={completeCurrentScene}
                      className="mt-4 rounded-full px-6 py-3 text-sm font-semibold transition-opacity hover:opacity-80"
                      style={{ background: "#f59e0b", color: "#0d1e2c" }}
                    >
                      Next: Reflect &amp; Connect →
                    </button>
                  )}
                </>
              )}

              {/* Scene 4: Reflect & Connect */}
              {labState.currentScene === 4 && (
                <ReflectScene
                  predictions={labState.predictions}
                  submitted={reflectionSubmitted}
                  feedback={reflectionFeedback}
                  onSubmit={handleReflectionSubmit}
                />
              )}
            </div>
          </div>
        </div>
      </PageContent>

      <StudentFloatingDock />
    </main>
  );
}
