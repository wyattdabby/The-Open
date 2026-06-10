// Minimal, server-side session cookie signed with HMAC-SHA256 (Web Crypto).
// Buffer-free so it runs on the Edge runtime (Next.js middleware).
// Single-user. For multi-user / SSO, swap in Auth.js (next-auth).
const COOKIE = "open_session";

function toHex(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let out = "";
  for (let i = 0; i < bytes.length; i++) out += bytes[i].toString(16).padStart(2, "0");
  return out;
}

async function hmac(value: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(value));
  return toHex(sig);
}

export async function makeSessionValue(secret: string): Promise<string> {
  const payload = `ok.${Date.now()}`;          // integrity comes from the signature
  const sig = await hmac(payload, secret);
  return `${payload}.${sig}`;
}

export async function verifySession(value: string | undefined, secret: string): Promise<boolean> {
  if (!value || !secret) return false;
  const i = value.lastIndexOf(".");
  if (i < 0) return false;
  const payload = value.slice(0, i);
  const sig = value.slice(i + 1);
  const expected = await hmac(payload, secret);
  if (sig.length !== expected.length) return false;
  let diff = 0;                                  // constant-time-ish compare
  for (let k = 0; k < sig.length; k++) diff |= sig.charCodeAt(k) ^ expected.charCodeAt(k);
  return diff === 0;
}

export const COOKIE_NAME = COOKIE;
