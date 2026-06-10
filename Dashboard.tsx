import { NextRequest, NextResponse } from "next/server";
import { verifySession, COOKIE_NAME } from "./lib/auth";

// Protect everything except the login page, the login API, the cron endpoint,
// and static assets.
const PUBLIC = ["/login", "/api/login", "/api/generate"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (
    PUBLIC.some((p) => pathname.startsWith(p)) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon")
  ) {
    return NextResponse.next();
  }
  const cookie = req.cookies.get(COOKIE_NAME)?.value;
  const ok = await verifySession(cookie, process.env.SESSION_SECRET || "");
  if (!ok) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"] };
