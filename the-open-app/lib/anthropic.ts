import type { NewsSection } from "./types";

// Calls YOUR Anthropic API key to write the news + deep-dive each morning.
// Returns parsed JSON. Falls back to an empty structure on any error.
export async function generateBriefContent(focus: string[], deepDiveSubject: string): Promise<{
  watch: string[];
  news: NewsSection[];
  deepDive: { title: string; markdown: string };
}> {
  const key = process.env.ANTHROPIC_API_KEY;
  const model = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-5";
  const empty = { watch: [], news: [], deepDive: { title: "", markdown: "" } };
  if (!key) return empty;

  const system =
    "You are a markets-and-news editor writing a concise personal morning brief for a finance student/CRE intern. " +
    "Paraphrase all news in your own words; never quote more than a few words from any source; attribute by outlet name. " +
    "Do NOT give buy/sell advice. The 'watch' items are reflective questions, not instructions. " +
    "Return ONLY valid JSON, no preamble, matching exactly: " +
    '{"watch": string[], "news": [{"title": string, "items": [{"source": string, "headline": string, "body": string, "define": string}]}], ' +
    '"deepDive": {"title": string, "markdown": string}}. ' +
    "Keep each news body 1-3 sentences. 'define' is an optional plain-English definition of any jargon used (omit with empty string if none). " +
    "Use web search for current, dated facts.";

  const user =
    `Write today's brief. News focus areas: ${focus.join("; ")}. ` +
    `Then a short rotating deep-dive on: ${deepDiveSubject}. ` +
    `Provide 4-6 news sections covering markets, tech/AI, politics/world, culture, and sports. ` +
    `Add 3 'watch' reflective questions about portfolio concentration and healthy investing habits.`;

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model,
        max_tokens: 3000,
        system,
        messages: [{ role: "user", content: user }],
        tools: [{ type: "web_search_20250305", name: "web_search" }],
      }),
    });
    if (!r.ok) return empty;
    const data = await r.json();
    const text: string = (data.content || [])
      .filter((b: any) => b.type === "text")
      .map((b: any) => b.text)
      .join("\n");
    const clean = text.replace(/```json|```/g, "").trim();
    const start = clean.indexOf("{");
    const end = clean.lastIndexOf("}");
    if (start < 0 || end < 0) return empty;
    return JSON.parse(clean.slice(start, end + 1));
  } catch {
    return empty;
  }
}
