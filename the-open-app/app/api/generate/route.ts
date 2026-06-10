import { NextResponse } from "next/server";
import { HOLDINGS, NEWS_FOCUS } from "@/lib/config";
import { buildPortfolio } from "@/lib/quotes";
import { generateBriefContent } from "@/lib/anthropic";
import { saveEdition } from "@/lib/kv";
import { verifySession, COOKIE_NAME } from "@/lib/auth";
import type { Edition } from "@/lib/types";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Rotating deep-dive subjects (matches the newsletter plan).
const ROTATION = [
  "Broadcom (AVGO) — company deep-dive",
  "Broadcom (AVGO) — competitive moat analysis",
  "Semiconductors — sector intelligence report",
  "The AI-infrastructure stack — 10 stock ideas",
];

async function authorized(req: Request): Promise<boolean> {
  // (a) Vercel Cron sends Authorization: Bearer <CRON_SECRET>
  const auth = req.headers.get("authorization");
  if (process.env.CRON_SECRET && auth === `Bearer ${process.env.CRON_SECRET}`) return true;
  // (b) a logged-in user clicking "refresh now"
  const cookie = req.headers.get("cookie") || "";
  const m = cookie.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  return verifySession(m?.[1], process.env.SESSION_SECRET || "");
}

export async function GET(req: Request) {
  if (!(await authorized(req))) return NextResponse.json({ ok: false }, { status: 401 });

  const day = Math.floor(Date.now() / 86400000);
  const subject = ROTATION[day % ROTATION.length];

  const portfolio = await buildPortfolio(HOLDINGS);
  const content = await generateBriefContent(NEWS_FOCUS, subject);

  const edition: Edition = {
    date: new Date().toISOString().slice(0, 10),
    builtAt: new Date().toISOString(),
    portfolio,
    watch: content.watch,
    news: content.news,
    deepDive: content.deepDive,
  };
  await saveEdition(edition);
  return NextResponse.json({ ok: true, date: edition.date, holdings: portfolio.rows.length });
}
