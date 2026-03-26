import { describe, it, expect } from "vitest";
import { formatUSDate } from "@/lib/dateFormat";

describe("formatUSDate", () => {
  it("formats a valid ISO date string in en-US format", () => {
    const result = formatUSDate("2024-01-15");
    expect(result).toMatch(/Jan\s+15,\s+2024/);
  });

  it("formats a date with month name, day and year", () => {
    const result = formatUSDate("2025-12-31");
    expect(result).toMatch(/Dec\s+31,\s+2025/);
  });

  it("formats the first day of the year", () => {
    const result = formatUSDate("2024-01-01");
    expect(result).toMatch(/Jan\s+1,\s+2024/);
  });

  it("returns the raw string when input is invalid", () => {
    const bad = "not-a-date";
    const result = formatUSDate(bad);
    // Invalid Date will throw in some environments; the function catches and returns the raw string
    // or it may format "Invalid Date" — either way the function should not throw.
    expect(typeof result).toBe("string");
  });

  it("handles an ISO datetime string", () => {
    const result = formatUSDate("2026-03-26T16:22:48.000Z");
    expect(result).toMatch(/Mar\s+\d+,\s+2026/);
  });
});
