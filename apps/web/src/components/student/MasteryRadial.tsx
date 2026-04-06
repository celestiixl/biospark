"use client";

import { useState, useMemo } from "react";

export interface RadialSegment {
  key: string;
  label: string;
  value: number; // 0–100 mastery %
  group: string; // e.g. "B.5"
}

interface MasteryRadialProps {
  segments: RadialSegment[];
  size?: number;
}

/**
 * CLUSTER_COLORS
 * Each TEKS group gets a base color family.
 * Add new units by adding a new entry: "B.X": { fills: [...], label: "..." }
 * fills[0] = darkest (highest mastery contrast), fills[n] = lightest shade
 * Use 4-5 shades so individual TEKS within a cluster are distinguishable.
 */
const CLUSTER_COLORS: Record<string, { fills: string[]; label: string }> = {
  "B.5":  { fills: ["#006e55", "#1D9E75", "#5DCAA5", "#9FE1CB", "#d6f5ed"], label: "Biomolecules" },
  "B.11": { fills: ["#c0341a", "#ff4f2b", "#F0997B", "#F5C4B3", "#ffe8e3"], label: "Energy & Enzymes" },
  "B.7":  { fills: ["#4a2fc0", "#7c5cfc", "#AFA9EC", "#CECBF6", "#eeebff"], label: "Nucleic Acids" },
  "B.6":  { fills: ["#8a5e00", "#f5a800", "#FAC775", "#EF9F27", "#fff5d6"], label: "Cell Cycle" },
  "B.8":  { fills: ["#27500A","#3B6D11","#639922","#97C459","#C0DD97"], label: "Genetic Diversity" },
  "B.12": { fills: ["#27500A", "#639922", "#97C459", "#C0DD97", "#EAF3DE"], label: "Plants" },
  "B.9":  { fills: ["#0e7490", "#06b6d4", "#22d3ee", "#67e8f9", "#cffafe"], label: "Evolution: Patterns" },
  "B.10": { fills: ["#1d4ed8", "#2563eb", "#60a5fa", "#93c5fd", "#dbeafe"], label: "Evolution: Natural Selection" },
  // Add new units below:
  // "B.X": { fills: ["#darkest","#dark","#mid","#light","#lightest"], label: "Unit Name" },
};

const FALLBACK_FILLS = ["#444441", "#888780", "#B4B2A9", "#D3D1C7", "#F1EFE8"];

export default function MasteryRadial({ segments, size = 240 }: MasteryRadialProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const cx = size / 2;
  const cy = size / 2;
  const maxR = size * 0.44;  // max radius = 100% mastery
  const minR = size * 0.12;  // inner dead zone radius
  const gapDeg = 1.5;        // gap between slices in degrees

  // Group segments by cluster, preserving order
  const clusters = useMemo(() => {
    const map = new Map<string, RadialSegment[]>();
    for (const seg of segments) {
    const g = seg.group ?? seg.key.match(/^[A-Z]\.\d+/)?.[0] ?? seg.key;
      if (!map.has(g)) map.set(g, []);
      map.get(g)!.push(seg);
    }
    return Array.from(map.entries()); // [groupKey, segments[]]
  }, [segments]);

  const totalTeks = segments.length;
  const degreesPerTeks = totalTeks > 0 ? (360 - gapDeg * totalTeks) / totalTeks : 0;

  // Overall mastery = average of all segment values
  const overall = segments.length > 0
    ? Math.round(segments.reduce((s, seg) => s + seg.value, 0) / segments.length)
    : 0;

  // Convert polar to cartesian
  function polar(angleDeg: number, r: number) {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad),
    };
  }

  // Build SVG path for a wedge slice
  function wedgePath(startDeg: number, endDeg: number, r: number) {
    const inner = minR;
    const s1 = polar(startDeg, inner);
    const e1 = polar(endDeg, inner);
    const s2 = polar(startDeg, r);
    const e2 = polar(endDeg, r);
    const large = endDeg - startDeg > 180 ? 1 : 0;
    return [
      `M ${s1.x} ${s1.y}`,
      `L ${s2.x} ${s2.y}`,
      `A ${r} ${r} 0 ${large} 1 ${e2.x} ${e2.y}`,
      `L ${e1.x} ${e1.y}`,
      `A ${inner} ${inner} 0 ${large} 0 ${s1.x} ${s1.y}`,
      "Z",
    ].join(" ");
  }

  // Build all slices
  const slices: {
    path: string;
    fill: string;
    key: string;
    label: string;
    value: number;
    midDeg: number;
    r: number;
  }[] = [];
  let currentDeg = 0;

  for (const [groupKey, groupSegs] of clusters) {
    const colors = CLUSTER_COLORS[groupKey] ?? { fills: FALLBACK_FILLS, label: groupKey };

    groupSegs.forEach((seg, i) => {
      const startDeg = currentDeg;
      const endDeg = startDeg + degreesPerTeks;
      const r = minR + ((seg.value / 100) * (maxR - minR));
      const fill = colors.fills[i % colors.fills.length];
      const midDeg = (startDeg + endDeg) / 2;
      slices.push({
        path: wedgePath(startDeg, endDeg, r),
        fill,
        key: seg.key,
        label: seg.label,
        value: seg.value,
        midDeg,
        r,
      });
      currentDeg = endDeg + gapDeg;
    });
  }

  // Label positions for cluster groups (midpoint of each cluster arc)
  const clusterLabels: { x: number; y: number; text: string; color: string }[] = [];
  let labelDeg = 0;
  for (const [groupKey, groupSegs] of clusters) {
    const colors = CLUSTER_COLORS[groupKey] ?? { fills: FALLBACK_FILLS, label: groupKey };
    const clusterSpan = groupSegs.length * (degreesPerTeks + gapDeg) - gapDeg;
    const midDeg = labelDeg + clusterSpan / 2;
    const labelR = maxR + size * 0.08;
    const pos = polar(midDeg, labelR);
    clusterLabels.push({ x: pos.x, y: pos.y, text: groupKey, color: colors.fills[0] });
    labelDeg += clusterSpan + gapDeg;
  }

  const hoveredSlice = slices.find((s) => s.key === hovered);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ overflow: "visible" }}
        role="img"
        aria-label={`Mastery radial chart — ${overall}% overall`}
      >
        {/* Cluster divider lines */}
        {(() => {
          const lines = [];
          let deg = 0;
          for (const [, groupSegs] of clusters) {
            const pos1 = polar(deg, minR - 2);
            const pos2 = polar(deg, maxR + 4);
            lines.push(
              <line
                key={`div-${deg}`}
                x1={pos1.x}
                y1={pos1.y}
                x2={pos2.x}
                y2={pos2.y}
                stroke="white"
                strokeWidth="1.5"
                opacity="0.7"
              />
            );
            deg += groupSegs.length * (degreesPerTeks + gapDeg);
          }
          return lines;
        })()}

        {/* Ghost rings for 25/50/75/100% reference */}
        {[25, 50, 75, 100].map((pct) => {
          const r = minR + (pct / 100) * (maxR - minR);
          return (
            <circle
              key={pct}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke="rgba(0,0,0,0.05)"
              strokeWidth="0.5"
              strokeDasharray="3 3"
            />
          );
        })}

        {/* Wedge slices */}
        {slices.map((s) => (
          <path
            key={s.key}
            d={s.path}
            fill={s.fill}
            opacity={hovered === null ? 0.88 : hovered === s.key ? 1 : 0.35}
            style={{ cursor: "pointer", transition: "opacity 0.15s" }}
            aria-label={`${s.key}: ${Math.round(s.value)}% mastery`}
            onMouseEnter={() => setHovered(s.key)}
            onMouseLeave={() => setHovered(null)}
            onTouchStart={() => setHovered(s.key)}
            onTouchEnd={() => setTimeout(() => setHovered(null), 1200)}
          />
        ))}

        {/* Cluster labels */}
        {clusterLabels.map((l) => (
          <text
            key={l.text}
            x={l.x}
            y={l.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={size * 0.038}
            fontWeight="700"
            fill={l.color}
            fontFamily="var(--font-dm-sans), system-ui, sans-serif"
          >
            {l.text}
          </text>
        ))}

        {/* Center circle */}
        <circle cx={cx} cy={cy} r={minR - 2} fill="#003d2e" />
        <text
          x={cx}
          y={cy - size * 0.025}
          textAnchor="middle"
          fontSize={size * 0.07}
          fontWeight="700"
          fill="white"
          fontFamily="var(--font-fraunces), Georgia, serif"
          fontStyle="italic"
        >
          {overall}%
        </text>
        <text
          x={cx}
          y={cy + size * 0.055}
          textAnchor="middle"
          fontSize={size * 0.035}
          fill="rgba(255,255,255,0.55)"
          fontFamily="var(--font-dm-sans), system-ui, sans-serif"
        >
          overall
        </text>

        {/* Hover tooltip */}
        {hoveredSlice &&
          (() => {
            const tipPos = polar(hoveredSlice.midDeg, hoveredSlice.r + size * 0.06);
            return (
              <g>
                <rect
                  x={tipPos.x - 28}
                  y={tipPos.y - 14}
                  width="56"
                  height="26"
                  rx="6"
                  fill="#003d2e"
                />
                <text
                  x={tipPos.x}
                  y={tipPos.y - 4}
                  textAnchor="middle"
                  fontSize={size * 0.042}
                  fontWeight="600"
                  fill="white"
                  fontFamily="var(--font-dm-sans), system-ui, sans-serif"
                >
                  {hoveredSlice.key}
                </text>
                <text
                  x={tipPos.x}
                  y={tipPos.y + 8}
                  textAnchor="middle"
                  fontSize={size * 0.036}
                  fill="#9FE1CB"
                  fontFamily="var(--font-dm-sans), system-ui, sans-serif"
                >
                  {Math.round(hoveredSlice.value)}%
                </text>
              </g>
            );
          })()}
      </svg>

      {/* Legend */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "6px 14px",
          justifyContent: "center",
        }}
      >
        {clusters.map(([groupKey, groupSegs]) => {
          const colors = CLUSTER_COLORS[groupKey] ?? { fills: FALLBACK_FILLS, label: groupKey };
          const avg = Math.round(
            groupSegs.reduce((s, g) => s + g.value, 0) / groupSegs.length
          );
          return (
            <div
              key={groupKey}
              style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11 }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: colors.fills[0],
                  flexShrink: 0,
                }}
              />
              <span style={{ color: colors.fills[0], fontWeight: 600 }}>{groupKey}</span>
              <span style={{ color: "#8aada0" }}>· {avg}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
