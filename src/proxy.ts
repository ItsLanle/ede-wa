import { NextResponse, type NextRequest } from "next/server";

/**
 * Pseudo-authentication for Ọ̀rọ̀ Wa: the first time someone opens the
 * forum, give them a random secret user ID in a cookie. Their posts and
 * comments are tied to it, and only they can edit or delete them.
 */

const USER_COOKIE = "oro-wa-user"; // keep in sync with src/lib/forum.ts

export function proxy(request: NextRequest) {
  if (request.cookies.has(USER_COOKIE)) return NextResponse.next();

  const userId = crypto.randomUUID();

  // Add it to this request too, so the page being loaded already sees it.
  request.cookies.set(USER_COOKIE, userId);
  const response = NextResponse.next({ request });

  response.cookies.set(USER_COOKIE, userId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  });
  return response;
}

export const config = {
  matcher: ["/oro-wa", "/oro-wa/:path*"],
};
