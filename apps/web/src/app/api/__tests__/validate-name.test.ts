/**
 * Tests for POST /api/student/validate-name
 */
import { describe, it, expect } from "vitest";
import { POST } from "@/app/api/student/validate-name/route";

function jsonRequest(body: unknown): Request {
  return new Request("http://localhost/api/student/validate-name", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/student/validate-name", () => {
  it("returns ok:true and a normalizedName for a valid name", async () => {
    const res = await POST(jsonRequest({ name: "Alex Smith" }));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(data.normalizedName).toBe("Alex Smith");
  });

  it("returns 400 for a name that is too short", async () => {
    const res = await POST(jsonRequest({ name: "A" }));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.ok).toBe(false);
    expect(typeof data.reason).toBe("string");
  });

  it("returns 400 for a name with profanity", async () => {
    const res = await POST(jsonRequest({ name: "fuckhead" }));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.ok).toBe(false);
  });

  it("returns 400 for a blocked public figure name", async () => {
    const res = await POST(jsonRequest({ name: "Adolf Hitler" }));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.ok).toBe(false);
  });

  it("normalizes whitespace in the valid name returned", async () => {
    const res = await POST(jsonRequest({ name: "  Alex   Smith  " }));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.normalizedName).toBe("Alex Smith");
  });

  it("treats a missing name field as an empty string (invalid)", async () => {
    const res = await POST(jsonRequest({}));
    expect(res.status).toBe(400);
  });

  it("handles a non-string name field gracefully", async () => {
    const res = await POST(jsonRequest({ name: 12345 }));
    // 12345 coerced to "" → invalid
    expect(res.status).toBe(400);
  });
});
