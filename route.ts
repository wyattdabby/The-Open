"use client";
import { useState } from "react";
import type { Edition } from "@/lib/types";

const fmt = (n: number) => "$" + n.toLocaleString(undefined, { maximumFractionDigits: 0 });
const pct = (n: number) => (n >= 0 ? "+" : "") + n.toFixed(2) + "%";

function renderMarkdown(md: string) {
  return md.split("\n").map((line, i) => {
    if (line.startsWith("### ")) return <h4 key={i}>{line.slice(4)}</h4>;
    if (line.startsWith("## ")) return <h3 key={i}>{line.slice(3)}</h3>;
    if (line.trim() === "") return null;
    if (line.startsWith("- ")) return <li key={i}>{line.slice(2)}</li>;
    return <p key={i}>{line}</p>;
  });
}

export default function Dashboard({ edition }: { edition: Edition | null }) {
  const [tab, setTab] = useState("today");
  const [busy, setBusy] = useState(false);

  async function refresh() {
    setBusy(true);
    await fetch("/api/generate", { method: "GET" });
    window.location.reload();
  }
  async function logout() {
    await fetch("/api/logout", { method: "POST" });
    window.location.href = "/login";
  }

  const tabs = [
    ["today", "Today"], ["portfolio", "Portfolio"],
    ["deepdive", "Deep Dive"], ["news", "News"],
  ];

  return (
    <>
      <div className="topbar"><div className="topbar-in">
        <div className="tb-left">
          <span className="tb-wm">THE OPEN</span>
          <span className="tb-date">{edition ? edition.date : "—"}</span>
        </div>
        <div className="tb-actions">
          <button onClick={refresh} disabled={busy}>{busy ? "Refreshing…" : "↻ Refresh"}</button>
          <button onClick={logout} className="ghost">Sign out</button>
        </div>
      </div></div>

      <div className="tabs"><div className="tabs-in">
        {tabs.map(([id, label]) => (
          <button key={id} className={"tab" + (tab === id ? " active" : "")} onClick={() => setTab(id)}>{label}</button>
        ))}
      </div></div>

      <div className="wrap">
        {!edition && (
          <div className="panel active">
            <h2>No brief yet</h2>
            <p>The morning job hasn&apos;t run, or storage is empty. Click <b>↻ Refresh</b> above to build today&apos;s edition now.</p>
          </div>
        )}

        {edition && tab === "today" && (
          <div className="panel active">
            <div className="kicker">The morning glance</div>
            <h2>Today at a glance</h2>
            <div className="hero-val">
              <span className="big-num">{fmt(edition.portfolio.total)}</span>
              <span className={"day-move " + (edition.portfolio.dayUsd < 0 ? "neg" : "pos")}>
                {(edition.portfolio.dayUsd >= 0 ? "+" : "−")}{fmt(Math.abs(edition.portfolio.dayUsd))} · {pct(edition.portfolio.dayPct)}
              </span>
            </div>
            <div className="sub">Account value · live quotes · built {new Date(edition.builtAt).toLocaleString()}</div>
            {edition.deepDive?.title && (
              <div className="info"><b>Today&apos;s deep dive:</b> {edition.deepDive.title}. See the Deep Dive tab.</div>
            )}
            {edition.news[0] && (
              <div className="story"><div className="src">{edition.news[0].items[0]?.source}</div>
                <p>{edition.news[0].items[0]?.body}</p></div>
            )}
          </div>
        )}

        {edition && tab === "portfolio" && (
          <div className="panel active">
            <div className="kicker">Your account</div>
            <h2>Holdings</h2>
            <div className="hero-val">
              <span className="big-num">{fmt(edition.portfolio.total)}</span>
              <span className={"day-move " + (edition.portfolio.dayUsd < 0 ? "neg" : "pos")}>
                {(edition.portfolio.dayUsd >= 0 ? "+" : "−")}{fmt(Math.abs(edition.portfolio.dayUsd))} · {pct(edition.portfolio.dayPct)}
              </span>
            </div>
            <table><thead><tr><th>Ticker</th><th className="r">Price</th><th className="r">Value</th><th className="r">Day</th></tr></thead>
              <tbody>{edition.portfolio.rows.map((r) => (
                <tr key={r.symbol}>
                  <td className="ticker">{r.symbol}</td>
                  <td className="r">${r.price.toFixed(2)}</td>
                  <td className="r">{fmt(r.value)}</td>
                  <td className={"r " + (r.dayPct < 0 ? "neg" : "pos")}>{pct(r.dayPct)}</td>
                </tr>
              ))}</tbody>
            </table>
            {edition.watch.length > 0 && (
              <div className="watch">
                <p style={{ marginTop: 0 }}><b>Things to sit with</b> — questions, not instructions. Decisions are yours.</p>
                {edition.watch.map((w, i) => <p key={i} className="q">· {w}</p>)}
              </div>
            )}
          </div>
        )}

        {edition && tab === "deepdive" && (
          <div className="panel active">
            <div className="kicker">Rotating research module</div>
            <h2>{edition.deepDive?.title || "Deep dive"}</h2>
            <div className="dd">{edition.deepDive ? renderMarkdown(edition.deepDive.markdown) : <p>None today.</p>}</div>
          </div>
        )}

        {edition && tab === "news" && (
          <div className="panel active">
            <div className="kicker">The world today</div>
            <h2>News</h2>
            {edition.news.map((sec, i) => (
              <div key={i}>
                <h4>{sec.title}</h4>
                {sec.items.map((it, j) => (
                  <div className="story" key={j}>
                    <div className="src">{it.source}</div>
                    <p><b>{it.headline}</b> — {it.body}</p>
                    {it.define && <div className="define"><b>PLAIN ENGLISH</b><br />{it.define}</div>}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        <footer>
          <b>Not investment advice.</b> Reports public info and your holdings for learning; recommends nothing. Not a licensed advisor; decisions are yours.<br />
          Quotes via Finnhub · news/deep-dive generated via your Anthropic API key · holdings from your config. THE OPEN.
        </footer>
      </div>
    </>
  );
}
