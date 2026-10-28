import { NextResponse } from "next/server";
import { AUTH_COOKIE, sessionToken } from "./lib/auth";

export async function middleware(request) {
  const token = await sessionToken();
  const authed = token !== null && request.cookies.get(AUTH_COOKIE)?.value === token;
  const { pathname } = request.nextUrl;

  if (pathname === "/unlock") {
    return authed ? NextResponse.redirect(new URL("/", request.url)) : NextResponse.next();
  }

  if (!authed) {
    return NextResponse.redirect(new URL("/unlock", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Everything except the unlock/lock API, Next.js assets and the favicon.
  matcher: ["/((?!api/|_next/static|_next/image|favicon.ico).*)"],
};
