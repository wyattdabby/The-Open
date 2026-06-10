import type { Holding } from "./types";

// Your portfolio lives here — no brokerage login required.
// Update shares whenever you rebalance. (Seeded from your account on 2026-06-10.)
export const HOLDINGS: Holding[] = [
  { symbol: "VTI",  shares: 0.426643 },
  { symbol: "VXUS", shares: 0.898803 },
  { symbol: "QQQM", shares: 0.222964 },
  { symbol: "BND",  shares: 0.382902 },
  { symbol: "GLD",  shares: 0.060716 },
  { symbol: "NVDA", shares: 0.389214 },
  { symbol: "AVGO", shares: 0.130665 },
  { symbol: "AMD",  shares: 0.145201 },
  { symbol: "MRVL", shares: 0.313952 },
  { symbol: "ARM",  shares: 0.117154 },
  { symbol: "PLTR", shares: 0.092970 },
  { symbol: "SNOW", shares: 0.077777 },
  { symbol: "CRWD", shares: 0.047405 },
  { symbol: "VRT",  shares: 0.133790 },
  { symbol: "CEG",  shares: 0.114609 },
  { symbol: "VST",  shares: 0.174173 },
  { symbol: "PWR",  shares: 0.049367 },
  { symbol: "ETN",  shares: 0.058325 },
  { symbol: "EQIX", shares: 0.028854 },
  { symbol: "IREN", shares: 0.107604 },
  { symbol: "NBIS", shares: 0.052525 },
  { symbol: "APLD", shares: 0.363434 },
  { symbol: "WULF", shares: 0.318598 },
  { symbol: "SRRK", shares: 0.548516 },
];

// Themes the morning generator should scan for in the news.
export const NEWS_FOCUS = [
  "US stock market and the semiconductor / AI-data-center / power complex",
  "macro: rates, jobs, inflation",
  "a notable politics/world story",
  "one culture story",
  "NBA Finals (Knicks) and PGA / US Open golf",
];

export const OWNER_NAME = "Wyatt";
