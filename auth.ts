"use client";
import { useState } from "react";

export default function Login() {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit() {
    setBusy(true);
    setErr("");
    const r = await fetch("/api/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ password: pw }),
    });
    if (r.ok) window.location.href = "/";
    else { setErr("Incorrect password."); setBusy(false); }
  }

  return (
    <div className="login">
      <div className="login-eyebrow">Personal Brief</div>
      <div className="login-wm">THE&nbsp;OPEN</div>
      <input
        type="password"
        placeholder="Password"
        value={pw}
        onChange={(e) => setPw(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        autoFocus
      />
      <button onClick={submit} disabled={busy}>{busy ? "…" : "Sign in"}</button>
      {err && <div className="login-err">{err}</div>}
      <div className="login-note">Server-checked password · signed httpOnly session cookie</div>
    </div>
  );
}
