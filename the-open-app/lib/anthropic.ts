import type { NewsSection } from "./types";

export async function generateBriefContent(focus: string[], deepDiveSubject: string): Promise<{
  watch: string[];
  news: NewsSection[];
  deepDive: { title: string; markdown: string };
}> {
  const key = process.env.ANTHROPIC_API_KEY;
  const model = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6";
  const empty = { watch: [], news: [], deepDive: { title: "", markdown: "" } };
  if (!key) { console.error("generate: no ANTHROPIC_API_KEY"); return empty; }

  const system =
    "You write a concise personal morning market brief. Paraphrase; never quote; no buy/sell advice. " +
    "Return ONLY valid JSON, no preamble: " +
    '{"watch": string[], "news": [{"title": string, "items": [{"source": string, "headline": string, "body": string, "define": string}]}], ' +
    '"deepDive": {"title": string, "markdown": string}}. ' +
    "Keep each news body to 1-2 sentences. 'define' may be an empty string.";

  const user =
    `Brief focus: ${focus.join("; ")}. Short deep-dive on: ${deepDiveSubject}. ` +
    `Give 4 news sections (markets, tech/AI, world, sports) with 1 item each, and 3 short 'watch' questions about portfolio concentration.`;

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model, max_tokens: 1500, system, messages: [{ role: "user", content: user }] }),
    });
    if (!r.ok) { console.error("generate: API error", r.status, (await r.text()).slice(0, 300)); return empty; }
    const data = await r.json();
    const text: string = (data.content || []).filter((b: any) => b.type === "text").map((b: any) => b.text).join("\n");
    const clean = text.replace(/```json|```/g, "").trim();
    const s = clean.indexOf("{"), e = clean.lastIndexOf("}");
    if (s < 0 || e < 0) { console.error("generate: no JSON", text.slice(0, 200)); return empty; }
    return JSON.parse(clean.slice(s, e + 1));
  } catch (err) {
    console.error("generate: exception", String(err));
    return empty;
  }
}
