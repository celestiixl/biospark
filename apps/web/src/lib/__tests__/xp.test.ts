import { describe, it, expect, beforeEach, vi } from "vitest";

// Mock localStorage before importing the module under test so the module
// references our mock when its module-level constants are evaluated.
const store: Record<string, string> = {};
const localStorageMock = {
  getItem: vi.fn((key: string) => store[key] ?? null),
  setItem: vi.fn((key: string, value: string) => {
    store[key] = value;
  }),
  removeItem: vi.fn((key: string) => {
    delete store[key];
  }),
  clear: vi.fn(() => {
    for (const k of Object.keys(store)) delete store[k];
  }),
};

vi.stubGlobal("localStorage", localStorageMock);

// Import after stubbing so the module picks up the mock
const { getXP, setXP, getStreak, setStreak, addXPForResult, levelFromXP, resetXP } =
  await import("@/lib/xp");

beforeEach(() => {
  localStorageMock.clear();
  vi.clearAllMocks();
});

describe("getXP / setXP", () => {
  it("returns 0 when no XP is stored", () => {
    expect(getXP()).toBe(0);
  });

  it("returns the stored XP value", () => {
    setXP(150);
    expect(getXP()).toBe(150);
  });

  it("floors non-integer XP values", () => {
    setXP(99.9);
    expect(getXP()).toBe(99);
  });

  it("clamps negative values to 0", () => {
    setXP(-10);
    expect(getXP()).toBe(0);
  });
});

describe("getStreak / setStreak", () => {
  it("returns 0 when no streak is stored", () => {
    expect(getStreak()).toBe(0);
  });

  it("stores and retrieves the streak", () => {
    setStreak(5);
    expect(getStreak()).toBe(5);
  });

  it("clamps negative streak to 0", () => {
    setStreak(-3);
    expect(getStreak()).toBe(0);
  });
});

describe("levelFromXP", () => {
  it("level 1 at 0 XP", () => {
    expect(levelFromXP(0).level).toBe(1);
  });

  it("level 1 at 99 XP (not yet 100)", () => {
    expect(levelFromXP(99).level).toBe(1);
  });

  it("level 2 at 100 XP", () => {
    expect(levelFromXP(100).level).toBe(2);
  });

  it("level 3 at 200 XP", () => {
    expect(levelFromXP(200).level).toBe(3);
  });

  it("into is the XP within the current level", () => {
    expect(levelFromXP(150).into).toBe(50);
  });

  it("next is always 100", () => {
    expect(levelFromXP(0).next).toBe(100);
    expect(levelFromXP(250).next).toBe(100);
  });
});

describe("addXPForResult", () => {
  it("grants 5 XP for a correct answer", () => {
    const { gained } = addXPForResult(true);
    expect(gained).toBe(5);
  });

  it("grants 0 XP for an incorrect answer", () => {
    const { gained } = addXPForResult(false);
    expect(gained).toBe(0);
  });

  it("increases streak by 1 on correct answer", () => {
    addXPForResult(true);
    const { streak } = addXPForResult(true);
    expect(streak).toBe(2);
  });

  it("resets streak to 0 on incorrect answer", () => {
    setStreak(4);
    const { streak } = addXPForResult(false);
    expect(streak).toBe(0);
  });

  it("grants streak bonus of 20 extra XP at the 3rd consecutive correct answer", () => {
    addXPForResult(true); // streak 1
    addXPForResult(true); // streak 2
    const { gained } = addXPForResult(true); // streak 3 — bonus
    expect(gained).toBe(25); // 5 base + 20 bonus
  });

  it("no streak bonus at streak 4 (bonus only at exactly 3)", () => {
    addXPForResult(true); // 1
    addXPForResult(true); // 2
    addXPForResult(true); // 3 (bonus)
    const { gained } = addXPForResult(true); // 4 — no bonus
    expect(gained).toBe(5);
  });

  it("reports leveledUp when crossing a 100-XP boundary", () => {
    setXP(98);
    addXPForResult(true); // +5 → 103 → level up
    // Need to call again to confirm it leveled up (first call might be 103 > 99's level)
    resetXP();
    setXP(96);
    const { leveledUp } = addXPForResult(true); // 96 + 5 = 101 → level 2
    expect(leveledUp).toBe(true);
  });

  it("does not report leveledUp within the same level", () => {
    setXP(10);
    const { leveledUp } = addXPForResult(true); // 15 → still level 1
    expect(leveledUp).toBe(false);
  });

  it("persists XP and streak after each call", () => {
    addXPForResult(true);
    expect(getXP()).toBe(5);
    expect(getStreak()).toBe(1);
  });
});

describe("resetXP", () => {
  it("sets XP back to 0", () => {
    setXP(200);
    resetXP();
    expect(getXP()).toBe(0);
  });

  it("sets streak back to 0", () => {
    setStreak(7);
    resetXP();
    expect(getStreak()).toBe(0);
  });
});
