import type { Holding } from "./types";

// Trimmed to the largest positions to keep the morning job fast.
export const HOLDINGS: Holding[] = [
  { symbol: "VTI",  shares: 0.426643 },
  { symbol: "VXUS", shares: 0.898803 },
  { symbol: "QQQM", shares: 0.222964 },
  { symbol: "NVDA", shares: 0.389214 },
  { symbol: "AVGO", shares: 0.130665 },
  { symbol: "MRVL", shares: 0.313952 },
  { symbol: "AMD",  shares: 0.145201 },
  { symbol: "ARM",  shares: 0.117154 },
  { symbol: "CEG",  shares: 0.114609 },
  { symbol: "VST",  shares: 0.174173 },
  { symbol: "CRWD", shares: 0.047405 },
  { symbol: "PLTR", shares: 0.092970 },
];

export const NEWS_FOCUS = [
  "US markets and the semiconductor / AI / data-center / power complex",
  "macro: rates, jobs, inflation",
  "one politics/world story",
  "one culture story",
  "NBA Finals and PGA golf",
];

export const OWNER_NAME = "Wyatt";
