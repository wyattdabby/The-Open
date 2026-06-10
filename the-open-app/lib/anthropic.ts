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

  const useSearch = process.env.ENABLE_WEB_SEARCH === "true";
  const freshness = useSearch
    ? "Use web search for current, dated facts."
    : "Write from your own knowledge; keep claims general rather than inventing specific dates or figures you are unsure of.";

  const system =
    "You are a markets-and-news editor writing a concise personal morning brief for a finance student/CRE intern. " +
    "Paraphrase everything in your own words; never quote sources; attribute by outlet name only when natural. " +
    "Do NOT give buy/sell advice. The 'watch' items are reflective questions, not instructions. " +
    "Return ONLY valid JSON, no preamble, matching exactly: " +
    '{"watch": string[], "news": [{"title": string, "items": [{"source": string, "headline": string, "body": string, "define": string}]}], ' +
    '"deepDive": {"title": string, "markdown": string}}. ' +
    "Keep each news body 1-3 sentences. 'define' is an optional plain-English definition of any jargon (empty string if none). " +
    freshness;

  const user =
    `Write today's brief. News focus areas: ${focus.join("; ")}. ` +
    `Then a short rotating deep-dive on: ${deepDiveSubject}. ` +
    `Provide 4-6 news sections covering markets, tech/AI, politics/world, culture, and sports. ` +
    `Add 3 'watch' reflective questions about portfolio concentration and healthy investing habits.`;

  const body: any = {
    model,
    max_tokens: 3000,
    system,
    messages: [{ role: "user", content: user }],
  };
  if (useSearch) body.tools = [{ type: "web_search_20250305", name: "web_search" }];

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(body),
    });
    if (!r.ok) {
      const errText = await r.text();
      console.error("generate: Anthropic API error", r.status, errText.slice(0, 500));
      return empty;
    }
    const data = await r.json();
    const text: string = (data.content || [])
      .filter((b: any) => b.type === "text")
      .map((b: any) => b.text)
      .join("\n");
    const clean = text.replace(/```json|```/g, "").trim();
    const start = clean.indexOf("{");
    const end = clean.lastIndexOf("}");
    if (start < 0 || end < 0) { console.error("generate: no JSON in response", text.slice(0, 300)); return empty; }
    return JSON.parse(clean.slice(start, end + 1));
  } catch (e) {
    console.error("generate: exception", String(e));
    return empty;
  }
}
