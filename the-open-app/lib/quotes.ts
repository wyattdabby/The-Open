import type { Holding, QuoteRow } from "./types";

// Finnhub free tier: https://finnhub.io/docs/api/quote
async function fetchQuote(symbol: string): Promise<{ c: number; pc: number } | null> {
  const key = process.env.FINNHUB_API_KEY;
  if (!key) return null;
  try {
    const r = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(symbol)}&token=${key}`,
      { cache: "no-store" }
    );
    if (!r.ok) return null;
    const j = await r.json();
    if (typeof j.c !== "number" || !j.c) return null;
    return { c: j.c, pc: j.pc };
  } catch {
    return null;
  }
}

export async function buildPortfolio(holdings: Holding[]) {
  const rows: QuoteRow[] = [];
  for (const h of holdings) {
    const q = await fetchQuote(h.symbol);
    if (!q) continue;
    const value = h.shares * q.c;
    const dayUsd = h.shares * (q.c - q.pc);
    const dayPct = q.pc ? (q.c / q.pc - 1) * 100 : 0;
    rows.push({ symbol: h.symbol, price: q.c, prevClose: q.pc, value, dayPct, dayUsd });
    await new Promise((res) => setTimeout(res, 120)); // be gentle on free-tier rate limits
  }
  const total = rows.reduce((s, r) => s + r.value, 0);
  const dayUsd = rows.reduce((s, r) => s + r.dayUsd, 0);
  const prevTotal = total - dayUsd;
  const dayPct = prevTotal ? (dayUsd / prevTotal) * 100 : 0;
  rows.sort((a, b) => b.value - a.value);
  return { total, dayUsd, dayPct, rows };
}
