/**
 * Tests for POST /api/check
 *
 * The handler scores three item types without calling any external service:
 *   1. inline_choice  – blanks matching
 *   2. quick_check    – single-option matching
 *   3. cer            – evidence-set matching
 */
import { describe, it, expect } from "vitest";
import { POST } from "@/app/api/check/route";

// Helper: build a Request with a JSON body
function jsonRequest(body: unknown): Request {
  return new Request("http://localhost/api/check", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

// ─── inline_choice ────────────────────────────────────────────────────────────

describe("POST /api/check – inline_choice", () => {
  it("returns correct=true when all blanks are filled correctly", async () => {
    const req = jsonRequest({
      item: {
        type: "inline_choice",
        correctByBlank: { blank1: "mitochondria", blank2: "ATP" },
      },
      response: { blank1: "mitochondria", blank2: "ATP" },
    });
    const res = await POST(req);
    const data = await res.json();
    expect(data.correct).toBe(true);
    expect(data.score).toBe(2);
    expect(data.max).toBe(2);
  });

  it("returns correct=false when at least one blank is wrong", async () => {
    const req = jsonRequest({
      item: {
        type: "inline_choice",
        correctByBlank: { blank1: "mitochondria", blank2: "ATP" },
      },
      response: { blank1: "mitochondria", blank2: "ADP" },
    });
    const res = await POST(req);
    const data = await res.json();
    expect(data.correct).toBe(false);
    expect(data.score).toBe(1);
  });

  it("scores 0 when all blanks are wrong", async () => {
    const req = jsonRequest({
      item: {
        type: "inline_choice",
        correctByBlank: { blank1: "X" },
      },
      response: { blank1: "Y" },
    });
    const res = await POST(req);
    const data = await res.json();
    expect(data.score).toBe(0);
    expect(data.correct).toBe(false);
  });

  it("is case-sensitive for blank matching", async () => {
    const req = jsonRequest({
      item: {
        type: "inline_choice",
        correctByBlank: { blank1: "Mitochondria" },
      },
      response: { blank1: "mitochondria" },
    });
    const res = await POST(req);
    const data = await res.json();
    expect(data.correct).toBe(false);
  });

  it("handles an empty correctByBlank (max = 0)", async () => {
    const req = jsonRequest({
      item: { type: "inline_choice", correctByBlank: {} },
      response: {},
    });
    const res = await POST(req);
    const data = await res.json();
    expect(data.max).toBe(0);
    expect(data.correct).toBe(false); // score === max but max === 0, so score===max is true... wait
    // Actually: score === max && max > 0 is false when max === 0
    expect(data.correct).toBe(false);
  });
});

// ─── quick_check ─────────────────────────────────────────────────────────────

describe("POST /api/check – quick_check", () => {
  it("returns correct=true when selectedOption matches correctAnswer", async () => {
    const req = jsonRequest({
      item: { kind: "quick_check", correctAnswer: "B" },
      response: { selectedOption: "B" },
    });
    const res = await POST(req);
    const data = await res.json();
    expect(data.correct).toBe(true);
    expect(data.score).toBe(1);
    expect(data.max).toBe(1);
  });

  it("returns correct=false for a wrong answer", async () => {
    const req = jsonRequest({
      item: { kind: "quick_check", correctAnswer: "B" },
      response: { selectedOption: "C" },
    });
    const res = await POST(req);
    const data = await res.json();
    expect(data.correct).toBe(false);
    expect(data.score).toBe(0);
  });

  it("returns correct=false when selectedOption is empty", async () => {
    const req = jsonRequest({
      item: { kind: "quick_check", correctAnswer: "B" },
      response: { selectedOption: "" },
    });
    const res = await POST(req);
    const data = await res.json();
    expect(data.correct).toBe(false);
  });

  it("returns correct=false when correctAnswer is empty", async () => {
    const req = jsonRequest({
      item: { kind: "quick_check", correctAnswer: "" },
      response: { selectedOption: "A" },
    });
    const res = await POST(req);
    const data = await res.json();
    expect(data.correct).toBe(false);
  });
});

// ─── cer ──────────────────────────────────────────────────────────────────────

describe("POST /api/check – cer", () => {
  const evidenceBank = [
    { id: "ev1" },
    { id: "ev2" },
    { id: "ev3" },
  ];

  it("scores full credit when all correct evidence IDs are selected", async () => {
    const req = jsonRequest({
      item: {
        kind: "cer",
        correctEvidenceIds: ["ev1", "ev2"],
        rubric: { evidencePoints: 2 },
        evidenceBank,
      },
      response: { selectedEvidenceIds: ["ev1", "ev2"] },
    });
    const res = await POST(req);
    const data = await res.json();
    expect(data.correct).toBe(true);
    expect(data.score).toBe(2);
    expect(data.max).toBe(2);
  });

  it("scores partial credit for partial evidence selection", async () => {
    const req = jsonRequest({
      item: {
        kind: "cer",
        correctEvidenceIds: ["ev1", "ev2"],
        rubric: { evidencePoints: 2 },
        evidenceBank,
      },
      response: { selectedEvidenceIds: ["ev1"] },
    });
    const res = await POST(req);
    const data = await res.json();
    expect(data.score).toBe(1);
    expect(data.correct).toBe(false);
  });

  it("provides feedback when wrong evidence is selected", async () => {
    const req = jsonRequest({
      item: {
        kind: "cer",
        correctEvidenceIds: ["ev1"],
        rubric: { evidencePoints: 1 },
        evidenceBank,
      },
      response: { selectedEvidenceIds: ["ev3"] },
    });
    const res = await POST(req);
    const data = await res.json();
    expect(data.feedback).toBeDefined();
    expect(Array.isArray(data.feedback)).toBe(true);
    expect(data.feedback.length).toBeGreaterThan(0);
  });

  it("scores 0 when no evidence matches", async () => {
    const req = jsonRequest({
      item: {
        kind: "cer",
        correctEvidenceIds: ["ev1", "ev2"],
        rubric: { evidencePoints: 2 },
        evidenceBank,
      },
      response: { selectedEvidenceIds: ["ev3"] },
    });
    const res = await POST(req);
    const data = await res.json();
    expect(data.score).toBe(0);
  });
});
