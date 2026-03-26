import { describe, it, expect } from "vitest";
import {
  normalizeTeksCategory,
  teksCategoryColor,
  teksCategoryDescription,
  TEKS_CATEGORY_COLORS,
  TEKS_CATEGORY_DESCRIPTIONS,
} from "@/lib/teksColors";

describe("normalizeTeksCategory", () => {
  it("returns the input as-is when it is a valid category (RC1–RC6)", () => {
    expect(normalizeTeksCategory("RC1")).toBe("RC1");
    expect(normalizeTeksCategory("RC2")).toBe("RC2");
    expect(normalizeTeksCategory("RC3")).toBe("RC3");
    expect(normalizeTeksCategory("RC4")).toBe("RC4");
    expect(normalizeTeksCategory("RC5")).toBe("RC5");
    expect(normalizeTeksCategory("RC6")).toBe("RC6");
  });

  it("uppercases input before matching", () => {
    expect(normalizeTeksCategory("rc1")).toBe("RC1");
    expect(normalizeTeksCategory("rc6")).toBe("RC6");
  });

  it("strips whitespace before matching", () => {
    expect(normalizeTeksCategory("  RC2  ")).toBe("RC2");
  });

  it("parses 'RC 1' with a space between RC and digit", () => {
    expect(normalizeTeksCategory("RC 1")).toBe("RC1");
    expect(normalizeTeksCategory("RC 4")).toBe("RC4");
  });

  it("returns null for invalid input", () => {
    expect(normalizeTeksCategory("RC7")).toBeNull();
    expect(normalizeTeksCategory("")).toBeNull();
    expect(normalizeTeksCategory("B.5A")).toBeNull();
    expect(normalizeTeksCategory("Category 1")).toBeNull();
  });
});

describe("teksCategoryColor", () => {
  it("returns the CSS variable for a valid RC category", () => {
    expect(teksCategoryColor("RC1")).toBe(TEKS_CATEGORY_COLORS["RC1"]);
    expect(teksCategoryColor("RC3")).toBe(TEKS_CATEGORY_COLORS["RC3"]);
  });

  it("returns the fallback color for an invalid category", () => {
    expect(teksCategoryColor("invalid")).toBe("var(--teks-rc2)");
  });

  it("normalizes the input before looking up the color", () => {
    expect(teksCategoryColor("rc1")).toBe(TEKS_CATEGORY_COLORS["RC1"]);
    expect(teksCategoryColor("  RC5  ")).toBe(TEKS_CATEGORY_COLORS["RC5"]);
  });
});

describe("teksCategoryDescription", () => {
  it("returns description for valid RC category", () => {
    expect(teksCategoryDescription("RC1")).toBe(
      TEKS_CATEGORY_DESCRIPTIONS["RC1"],
    );
    expect(teksCategoryDescription("RC4")).toBe(
      TEKS_CATEGORY_DESCRIPTIONS["RC4"],
    );
  });

  it("returns the raw input for an invalid category", () => {
    expect(teksCategoryDescription("something-unknown")).toBe(
      "something-unknown",
    );
  });

  it("normalizes input before lookup", () => {
    expect(teksCategoryDescription("rc2")).toBe(
      TEKS_CATEGORY_DESCRIPTIONS["RC2"],
    );
  });

  it("all six categories have descriptions", () => {
    for (const rc of ["RC1", "RC2", "RC3", "RC4", "RC5", "RC6"] as const) {
      const desc = teksCategoryDescription(rc);
      expect(typeof desc).toBe("string");
      expect(desc.length).toBeGreaterThan(0);
    }
  });
});
