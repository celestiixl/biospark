import { describe, it, expect } from "vitest";
import {
  normalizeDisplayName,
  validateStudentName,
} from "@/lib/nameModeration";

describe("normalizeDisplayName", () => {
  it("trims leading/trailing whitespace", () => {
    expect(normalizeDisplayName("  Alex  ")).toBe("Alex");
  });

  it("collapses internal whitespace to single spaces", () => {
    expect(normalizeDisplayName("Alex   Smith")).toBe("Alex Smith");
  });

  it("returns empty string for empty input", () => {
    expect(normalizeDisplayName("")).toBe("");
  });

  it("preserves apostrophes in names", () => {
    expect(normalizeDisplayName("O'Brien")).toBe("O'Brien");
  });

  it("preserves hyphens in names", () => {
    expect(normalizeDisplayName("Mary-Jane")).toBe("Mary-Jane");
  });
});

describe("validateStudentName", () => {
  it("accepts a standard first and last name", () => {
    const result = validateStudentName("Alex Smith");
    expect(result.valid).toBe(true);
    expect(result.normalizedName).toBe("Alex Smith");
  });

  it("accepts a single word name of sufficient length", () => {
    const result = validateStudentName("Alex");
    expect(result.valid).toBe(true);
  });

  it("rejects names shorter than 2 characters", () => {
    const result = validateStudentName("A");
    expect(result.valid).toBe(false);
    expect(result.reason).toMatch(/2/);
  });

  it("rejects names longer than 24 characters", () => {
    const result = validateStudentName("A".repeat(25));
    expect(result.valid).toBe(false);
    expect(result.reason).toMatch(/24/);
  });

  it("rejects names starting with a digit", () => {
    const result = validateStudentName("1Alex");
    expect(result.valid).toBe(false);
  });

  it("rejects names with special characters not in allowlist", () => {
    const result = validateStudentName("Alex@Smith");
    expect(result.valid).toBe(false);
  });

  it("accepts names with an apostrophe", () => {
    const result = validateStudentName("O'Brien");
    expect(result.valid).toBe(true);
  });

  it("accepts names with a hyphen", () => {
    const result = validateStudentName("Mary-Jane");
    expect(result.valid).toBe(true);
  });

  it("accepts names with a period", () => {
    const result = validateStudentName("Dr. Smith");
    expect(result.valid).toBe(true);
  });

  it("rejects names with profanity", () => {
    const result = validateStudentName("fuckhead");
    expect(result.valid).toBe(false);
    expect(result.reason).toMatch(/blocked/i);
  });

  it("rejects names that reference blocked public figures", () => {
    const result = validateStudentName("Adolf Hitler");
    expect(result.valid).toBe(false);
    expect(result.reason).toMatch(/blocked/i);
  });

  it("rejects blocked terms even with unicode normalization tricks", () => {
    // NFKD normalization strips diacritics before scanning
    const result = validateStudentName("fück");
    expect(result.valid).toBe(false);
  });

  it("trims and normalizes the name before validation", () => {
    const result = validateStudentName("  Alex Smith  ");
    expect(result.valid).toBe(true);
    expect(result.normalizedName).toBe("Alex Smith");
  });

  it("returns the normalized name on success", () => {
    const result = validateStudentName("  Alex  Smith  ");
    expect(result.valid).toBe(true);
    expect(result.normalizedName).toBe("Alex Smith");
  });
});
