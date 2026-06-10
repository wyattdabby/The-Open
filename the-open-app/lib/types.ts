export type Holding = { symbol: string; shares: number };

export type QuoteRow = {
  symbol: string;
  price: number;
  prevClose: number;
  value: number;       // shares * price
  dayPct: number;      // (price/prevClose - 1) * 100
  dayUsd: number;      // shares * (price - prevClose)
};

export type NewsItem = { source: string; headline: string; body: string; define?: string };
export type NewsSection = { title: string; items: NewsItem[] };

export type Edition = {
  date: string;                 // ISO date the edition was built
  builtAt: string;              // ISO timestamp
  portfolio: {
    total: number;
    dayUsd: number;
    dayPct: number;
    rows: QuoteRow[];
  };
  watch: string[];              // "things to sit with" — non-advice prompts
  news: NewsSection[];
  deepDive?: { title: string; markdown: string };
};
