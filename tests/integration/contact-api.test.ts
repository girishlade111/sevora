import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "@/app/api/contact/route";

describe("POST /api/contact", () => {
  it("rejects invalid payloads with 400", async () => {
    const req = new NextRequest("http://localhost:3000/api/contact", {
      method: "POST",
      headers: { "content-type": "application/json", "x-forwarded-for": "10.0.0.1" },
      body: JSON.stringify({ name: "A", email: "bad", projectType: "invalid" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.ok).toBe(false);
  });

  it("accepts valid inquiry in demo mode without claiming external delivery", async () => {
    const req = new NextRequest("http://localhost:3000/api/contact", {
      method: "POST",
      headers: { "content-type": "application/json", "x-forwarded-for": "10.0.0.2" },
      body: JSON.stringify({
        name: "Jane Smith",
        email: "jane@example.com",
        projectType: "website_design",
        budgetRange: "3k_5k",
        message: "Looking for a clean portfolio website redesign and Framer build.",
      }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.ok).toBe(true);
    expect(json.demoMode).toBe(true);
  });
});
