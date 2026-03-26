import { describe, it, expect } from "vitest";
import { defaultLearningSettings } from "@/lib/learningSettings";

describe("defaultLearningSettings", () => {
  it("sets all provided unit IDs as visible", () => {
    const settings = defaultLearningSettings(["unit-1", "unit-2"]);
    expect(settings.visibleUnitIds).toEqual(["unit-1", "unit-2"]);
  });

  it("returns empty visibleUnitIds when no units provided", () => {
    const settings = defaultLearningSettings([]);
    expect(settings.visibleUnitIds).toEqual([]);
  });

  it("defaults all grading periods to on_track pacing", () => {
    const settings = defaultLearningSettings(["unit-1"]);
    expect(settings.pacingByGradingPeriod[1]).toBe("on_track");
    expect(settings.pacingByGradingPeriod[2]).toBe("on_track");
    expect(settings.pacingByGradingPeriod[3]).toBe("on_track");
    expect(settings.pacingByGradingPeriod[4]).toBe("on_track");
  });

  it("defaults all period playlists to empty with null dueDate", () => {
    const settings = defaultLearningSettings(["unit-1"]);
    for (const period of ["P1", "P2", "P3", "P4"] as const) {
      expect(settings.playlistsByPeriod[period].lessonIds).toEqual([]);
      expect(settings.playlistsByPeriod[period].dueDate).toBeNull();
    }
  });

  it("returns a fresh object on each call (no shared references)", () => {
    const a = defaultLearningSettings(["unit-1"]);
    const b = defaultLearningSettings(["unit-1"]);
    expect(a).not.toBe(b);
    expect(a.pacingByGradingPeriod).not.toBe(b.pacingByGradingPeriod);
  });
});
