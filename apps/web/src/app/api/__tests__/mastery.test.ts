/**
 * Tests for GET and POST /api/mastery
 */
import { describe, it, expect } from "vitest";
import { GET, POST } from "@/app/api/mastery/route";

function getRequest(params: Record<string, string>): Request {
  const url = new URL("http://localhost/api/mastery");
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }
  return new Request(url.toString(), { method: "GET" });
}

function postRequest(body: unknown): Request {
  return new Request("http://localhost/api/mastery", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

// ─── GET /api/mastery ─────────────────────────────────────────────────────────

describe("GET /api/mastery", () => {
  it("returns a JSON response with userId and items", async () => {
    const res = await GET(getRequest({ userId: "user1", itemIds: "a,b" }));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.userId).toBe("user1");
    expect(typeof data.items).toBe("object");
  });

  it("includes entries for each requested itemId", async () => {
    const res = await GET(getRequest({ itemIds: "item1,item2,item3" }));
    const data = await res.json();
    expect("item1" in data.items).toBe(true);
    expect("item2" in data.items).toBe(true);
    expect("item3" in data.items).toBe(true);
  });

  it("each item entry has correct, total, and masteryPct fields", async () => {
    const res = await GET(getRequest({ itemIds: "myItem" }));
    const data = await res.json();
    const entry = data.items["myItem"];
    expect(typeof entry.correct).toBe("number");
    expect(typeof entry.total).toBe("number");
    expect(typeof entry.masteryPct).toBe("number");
  });

  it("masteryPct is between 0 and 100 inclusive", async () => {
    const res = await GET(getRequest({ itemIds: "x" }));
    const data = await res.json();
    const { masteryPct } = data.items["x"];
    expect(masteryPct).toBeGreaterThanOrEqual(0);
    expect(masteryPct).toBeLessThanOrEqual(100);
  });

  it("defaults userId to anon when not provided", async () => {
    const res = await GET(getRequest({}));
    const data = await res.json();
    expect(data.userId).toBe("anon");
  });

  it("returns empty items when itemIds is empty", async () => {
    const res = await GET(getRequest({ itemIds: "" }));
    const data = await res.json();
    expect(Object.keys(data.items)).toHaveLength(0);
  });

  it("produces deterministic results for the same itemId", async () => {
    const a = await (await GET(getRequest({ itemIds: "stable" }))).json();
    const b = await (await GET(getRequest({ itemIds: "stable" }))).json();
    expect(a.items.stable.masteryPct).toBe(b.items.stable.masteryPct);
  });
});

// ─── POST /api/mastery ────────────────────────────────────────────────────────

describe("POST /api/mastery", () => {
  it("returns ok:true for a valid payload", async () => {
    const res = await POST(
      postRequest({ teks: "B.5A", score: 85, lessonSlug: "biomolecules-intro" }),
    );
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
  });

  it("echoes back teks, score, and lessonSlug", async () => {
    const res = await POST(
      postRequest({ teks: "B.11A", score: 70, lessonSlug: "energy-conversion" }),
    );
    const data = await res.json();
    expect(data.teks).toBe("B.11A");
    expect(data.score).toBe(70);
    expect(data.lessonSlug).toBe("energy-conversion");
  });

  it("defaults userId to anon when not provided", async () => {
    const res = await POST(
      postRequest({ teks: "B.5A", score: 90, lessonSlug: "cell-transport" }),
    );
    const data = await res.json();
    expect(data.userId).toBe("anon");
  });

  it("returns 400 when teks is missing", async () => {
    const res = await POST(
      postRequest({ score: 80, lessonSlug: "lab-safety" }),
    );
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("invalid_payload");
  });

  it("returns 400 when score is missing", async () => {
    const res = await POST(
      postRequest({ teks: "B.5A", lessonSlug: "lab-safety" }),
    );
    expect(res.status).toBe(400);
  });

  it("returns 400 when lessonSlug is missing", async () => {
    const res = await POST(postRequest({ teks: "B.5A", score: 80 }));
    expect(res.status).toBe(400);
  });
});
