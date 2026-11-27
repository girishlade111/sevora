import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { siteConfig } from "@/config/site";

const allowedProjectTypes = siteConfig.contactOptions.projectTypes.map((o) => o.value) as [
  string,
  ...string[],
];
const allowedBudgetRanges = siteConfig.contactOptions.budgetRanges.map((o) => o.value) as [
  string,
  ...string[],
];

const contactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(160),
  projectType: z.enum(allowedProjectTypes),
  budgetRange: z.enum(allowedBudgetRanges),
  message: z.string().trim().min(10).max(3000),
  website: z.string().max(0).optional().default(""),
});

const rateWindowMs = 60_000;
const maxPerWindow = 5;
const rateBuckets = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const history = (rateBuckets.get(ip) ?? []).filter((ts) => now - ts < rateWindowMs);
  if (history.length >= maxPerWindow) {
    rateBuckets.set(ip, history);
    return true;
  }
  history.push(now);
  rateBuckets.set(ip, history);
  return false;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many submissions. Please wait a minute before trying again." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON payload." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "Please check all required fields and try again.",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const webhookUrl = process.env.CONTACT_WEBHOOK_URL;
  if (webhookUrl) {
    const resp = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    });
    if (!resp.ok) {
      return NextResponse.json(
        { ok: false, error: "Configured delivery endpoint rejected the request." },
        { status: 502 }
      );
    }
    return NextResponse.json({
      ok: true,
      demoMode: false,
      message: "Your inquiry has been sent. We will respond within 24 hours.",
    });
  }

  // Local demonstration mode: never claims real email delivery
  return NextResponse.json({
    ok: true,
    demoMode: true,
    message:
      "Demo mode active: your inquiry passed validation locally (no external email provider configured).",
  });
}
