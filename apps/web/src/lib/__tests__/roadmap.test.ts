import { describe, it, expect } from "vitest";
import {
  buildRoadmapSections,
  makeRoadmapId,
  type RoadmapItem,
} from "@/lib/roadmap";

// ─── helpers ──────────────────────────────────────────────────────────────────

function makeItem(overrides: Partial<RoadmapItem> = {}): RoadmapItem {
  return {
    id: "item-1",
    title: "Some feature",
    status: "shipped",
    updatedAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

// ─── buildRoadmapSections ─────────────────────────────────────────────────────

describe("buildRoadmapSections", () => {
  it("returns three sections (shipped, in-progress, upcoming)", () => {
    const sections = buildRoadmapSections([]);
    expect(sections).toHaveLength(3);
    const keys = sections.map((s) => s.key);
    expect(keys).toContain("shipped");
    expect(keys).toContain("in-progress");
    expect(keys).toContain("upcoming");
  });

  it("places each item in the correct section", () => {
    const items: RoadmapItem[] = [
      makeItem({ id: "a", status: "shipped" }),
      makeItem({ id: "b", status: "in-progress" }),
      makeItem({ id: "c", status: "upcoming" }),
    ];
    const sections = buildRoadmapSections(items);

    const shipped = sections.find((s) => s.key === "shipped")!;
    expect(shipped.items).toHaveLength(1);
    expect(shipped.items[0].id).toBe("a");

    const inProgress = sections.find((s) => s.key === "in-progress")!;
    expect(inProgress.items[0].id).toBe("b");

    const upcoming = sections.find((s) => s.key === "upcoming")!;
    expect(upcoming.items[0].id).toBe("c");
  });

  it("returns empty items array for sections with no matching items", () => {
    const sections = buildRoadmapSections([makeItem({ status: "shipped" })]);
    const inProgress = sections.find((s) => s.key === "in-progress")!;
    expect(inProgress.items).toHaveLength(0);
  });

  it("each section has a title, statusLabel, and tone", () => {
    const sections = buildRoadmapSections([]);
    for (const section of sections) {
      expect(typeof section.title).toBe("string");
      expect(section.title.length).toBeGreaterThan(0);
      expect(typeof section.statusLabel).toBe("string");
      expect(["emerald", "teal", "amber"]).toContain(section.tone);
    }
  });

  it("multiple items can appear in the same section", () => {
    const items = [
      makeItem({ id: "x", status: "upcoming" }),
      makeItem({ id: "y", status: "upcoming" }),
    ];
    const sections = buildRoadmapSections(items);
    const upcoming = sections.find((s) => s.key === "upcoming")!;
    expect(upcoming.items).toHaveLength(2);
  });
});

// ─── makeRoadmapId ────────────────────────────────────────────────────────────

describe("makeRoadmapId", () => {
  it("returns a non-empty string", () => {
    expect(typeof makeRoadmapId()).toBe("string");
    expect(makeRoadmapId().length).toBeGreaterThan(0);
  });

  it("starts with the rm_ prefix", () => {
    expect(makeRoadmapId()).toMatch(/^rm_/);
  });

  it("generates unique IDs on each call", () => {
    const ids = new Set(Array.from({ length: 20 }, () => makeRoadmapId()));
    expect(ids.size).toBe(20);
  });
});
