import { describe, it, expect } from "vitest";
import { cn } from "@/lib/cn";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("deduplicates conflicting Tailwind classes (last wins)", () => {
    // tailwind-merge resolves conflicts: p-2 and p-4 → last one wins
    expect(cn("p-2", "p-4")).toBe("p-4");
  });

  it("filters falsy values", () => {
    expect(cn("foo", false, undefined, null, "bar")).toBe("foo bar");
  });

  it("handles conditional classes via clsx object syntax", () => {
    expect(cn({ "text-red-500": true, "text-blue-500": false })).toBe(
      "text-red-500",
    );
  });

  it("handles array syntax", () => {
    expect(cn(["foo", "bar"])).toBe("foo bar");
  });

  it("returns empty string for no arguments", () => {
    expect(cn()).toBe("");
  });

  it("merges responsive variants correctly", () => {
    // tailwind-merge should keep both because they are different breakpoints
    const result = cn("md:p-2", "lg:p-4");
    expect(result).toContain("md:p-2");
    expect(result).toContain("lg:p-4");
  });
});
