import type { Holding, QuoteRow } from "./types";

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

async function fetchAll(symbols: string[]): Promise<Record<string, { c: number; pc: number }>> {
  const out: Record<string, { c: number; pc: number }> = {};
  const BATCH = 8;
  for (let i = 0; i < symbols.length; i += BATCH) {
    const slice = symbols.slice(i, i + BATCH);
    const results = await Promise.all(slice.map((s) => fetchQuote(s)));
    slice.forEach((s, idx) => { const q = results[idx]; if (q) out[s] = q; });
    if (i + BATCH < symbols.length) await new Promise((res) => setTimeout(res, 300));
  }
  return out;
}

export async function buildPortfolio(holdings: Holding[]) {
  const quotes = await fetchAll(holdings.map((h) => h.symbol));
  const rows: QuoteRow[] = [];
  for (const h of holdings) {
    const q = quotes[h.symbol];
    if (!q) continue;
    const value = h.shares * q.c;
    const dayUsd = h.shares * (q.c - q.pc);
    const dayPct = q.pc ? (q.c / q.pc - 1) * 100 : 0;
    rows.push({ symbol: h.symbol, price: q.c, prevClose: q.pc, value, dayPct, dayUsd });
  }
  const total = rows.reduce((s, r) => s + r.value, 0);
  const dayUsd = rows.reduce((s, r) => s + r.dayUsd, 0);
  const prevTotal = total - dayUsd;
  const dayPct = prevTotal ? (dayUsd / prevTotal) * 100 : 0;
  rows.sort((a, b) => b.value - a.value);
  return { total, dayUsd, dayPct, rows };
}
